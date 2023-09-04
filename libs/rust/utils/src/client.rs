
pub  async fn client (){
    let res=  reqwest::get("http://communicatemgmt-service:7070/communicatemgmt/").await.unwrap();
    println!("Status: {}", res.status());
    println!("Headers:\n{:#?}", res.headers());

    let body = res.text().await.unwrap();
    println!("Body:\n{}", body);
}