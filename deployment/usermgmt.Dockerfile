FROM rust:1.71 as builder

WORKDIR /usr/src/usermgmt

COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
COPY services/usermgmt services/usermgmt
COPY database/src database/src
COPY database/Cargo.toml database/Cargo.toml

RUN cargo install --path services/usermgmt

FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/usermgmt /usr/local/bin/usermgmt

EXPOSE 8080

CMD ["usermgmt"]