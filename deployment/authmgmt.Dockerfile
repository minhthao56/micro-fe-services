FROM rust:1.71 as builder

WORKDIR /usr/src/authmgmt

COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
COPY services/authmgmt services/authmgmt
COPY database/src database/src
COPY database/Cargo.toml database/Cargo.toml

RUN cargo install --path services/authmgmt

FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/authmgmt /usr/local/bin/authmgmt

EXPOSE 8080

CMD ["authmgmt"]