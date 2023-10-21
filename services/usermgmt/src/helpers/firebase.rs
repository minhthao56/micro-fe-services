use std::time::Duration;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};


const FALLBACK_TIMEOUT: Duration = Duration::from_secs(60);
const JWK_URL: &str =
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";


#[derive(Clone, Debug, Deserialize)]
pub struct JwkKey {
    pub e: String,
    pub alg: String,
    pub kty: String,
    pub kid: String,
    pub n: String,
}
#[derive(Debug, Clone)]
pub struct JwkKeys {
    pub keys: Vec<JwkKey>,
    pub max_age: Duration,
}

#[derive(Debug)]
pub enum PublicKeysError {
    CannotParsePublicKey,
}

#[derive(Debug, Deserialize)]
pub struct KeyResponse {
    pub keys: Vec<JwkKey>,
}

#[derive(Debug)]
pub struct JwkConfiguration {
    pub jwk_url: String,
    pub audience: String,
    pub issuer: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FirebaseUser {
    pub provider_id: Option<String>,
    pub name: Option<String>,
    pub picture: Option<String>,
    pub iss: String,
    pub aud: String,
    pub auth_time: u64,
    pub user_id: String,
    pub sub: String,
    pub iat: u64,
    pub exp: u64,
    pub email: Option<String>,
    pub email_verified: Option<bool>,
    pub firebase: FirebaseProvider,
    pub db_user_id: String,
    pub user_group: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FirebaseProvider {
    sign_in_provider: String,
    identities: Map<String, Value>,
}


pub fn get_configuration(project_id: &str) -> JwkConfiguration {
    JwkConfiguration {
        jwk_url: JWK_URL.to_owned(),
        audience: project_id.to_owned(),
        issuer: format!("https://securetoken.google.com/{}", project_id),
    }
}

pub async fn get_public_keys() -> Result<JwkKeys, PublicKeysError> {
    let client = reqwest::Client::builder().danger_accept_invalid_certs(true).build().unwrap();

    let response = match client
        .get(JWK_URL)
        .send()
        .await {
            Ok(response) => response,
            Err(err) => {
                println!("Error: {:?}", err);
                return Err(PublicKeysError::CannotParsePublicKey);
            }
        };

    let public_keys = response
        .json::<KeyResponse>()
        .await
        .map_err(|_| PublicKeysError::CannotParsePublicKey)?;

    Ok(JwkKeys {
        keys: public_keys.keys,
        max_age: FALLBACK_TIMEOUT,
    })
}