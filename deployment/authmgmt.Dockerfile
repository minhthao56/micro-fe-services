FROM rust

COPY services/authmgmt ./

RUN cargo build --release

EXPOSE 8080

CMD [ "./target/release/authmgmt" ]