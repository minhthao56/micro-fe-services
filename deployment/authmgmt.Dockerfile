FROM rust:1.71
WORKDIR /app
COPY Cargo.lock Cargo.lock
COPY Cargo.toml Cargo.toml
COPY services/authmgmt services/authmgmt
RUN cargo build --release --bin authmgmt

CMD ["./target/release/authmgmt "]