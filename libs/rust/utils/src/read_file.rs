use std::fs::File;
use std::io::{
    Read,
    Error
};

pub fn read_config(file_path: String) -> Result<String, Error> {
    // Open the file in read-only mode
    match File::open(file_path) {
        Ok(mut file) => {
            let mut contents = String::new();
            
            // Read the file contents into a string
            match file.read_to_string(&mut contents) {
                Ok(_) => {
                    eprintln!("File contents: {}", contents);
                   return Ok(contents);
                }
                Err(e) => {
                    eprintln!("Error reading file: {}", e);
                    return Err(e);
                }
            }
        }
        Err(e) => {
            eprintln!("Error opening file: {}", e);
            return Err(e);
        }
    }
}


pub fn get_endpoint_authmgmt() -> String {
    let path = String::from("/common-configmap/url_auth_service");
    let ip_service = match read_config(path) {
        Ok(url) => url,
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            return String::from("");
        }
    };
    return ip_service;
}


pub fn endpoint_create_firebase_user() -> String {
    let ip_service = get_endpoint_authmgmt();
    let endpoint = format!("http://{}:8080/authmgmt/create-firebase-user", ip_service);
    return endpoint;
}