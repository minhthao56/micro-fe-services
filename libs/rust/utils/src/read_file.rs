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
