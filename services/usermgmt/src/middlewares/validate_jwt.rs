use std::{
    future::{ready, Ready},
    task::{Context, Poll},
};

use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use jsonwebtoken::{decode_header, Algorithm, DecodingKey, Validation, decode};

use crate::helpers::firebase::{JwkKeys, get_configuration, FirebaseUser};

#[derive(Debug, Clone)]

#[doc(hidden)]
pub struct ValidateJWTService<S> {
    service: S,
    public_keys: JwkKeys,
}

impl<S, B> Service<ServiceRequest> for ValidateJWTService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error>,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = S::Future;

    fn poll_ready(&self, ctx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let public_keys = self.public_keys.clone();
        let headers = req.headers();
        let auth_header = headers.get("Authorization").unwrap();
        let auth_header_str = auth_header.to_str().unwrap();
        let token = auth_header_str.replace("Bearer ", "");
        let header = decode_header(&token).expect("Failed to decode header");

        if header.alg != Algorithm::RS256 {
            println!("header.alg: {:?}", header.alg);
        }

        let kid =  header.kid.expect("No kid found in header");
        println!("kid: {:?}", kid);
        println!("public_keys: {:?}", public_keys);
        let public_key =  public_keys.keys.iter().find(|v| v.kid == kid).expect("No public key found");

        let decoding_key = DecodingKey::from_rsa_components(&public_key.n, &public_key.e).expect("Failed to create decoding key");
        let mut validation = Validation::new(Algorithm::RS256);
        let config = get_configuration("app-taxi-8fb2b");
        validation.set_audience(&[config.audience.to_owned()]);
        validation.set_issuer(&[config.issuer.to_owned()]);

        let token_data = decode::<FirebaseUser>(&token, &decoding_key, &validation).expect("Failed to decode token");
        let firebase_user = token_data.claims;
        req.extensions_mut().insert(firebase_user);

        self.service.call(req)
    }
}

#[derive(Clone, Debug)]
pub struct ValidateJWT {
    public_keys: JwkKeys,
}

impl ValidateJWT {
    pub fn add_public_key(public_keys: JwkKeys) -> Self {
        Self { public_keys }
    }
}

impl<S, B> Transform<S, ServiceRequest> for ValidateJWT
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error>,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
    type Transform = ValidateJWTService<S>;
    type InitError = ();

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(ValidateJWTService {
            service,
            public_keys: self.public_keys.clone(),
        }))
    }
}