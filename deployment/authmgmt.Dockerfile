FROM rust:1.67-alpine

WORKDIR /app

COPY services/authmgmt/target/release/authmgmt /app/authmgmt

EXPOSE 8080

CMD [ "./authmgmt" ]