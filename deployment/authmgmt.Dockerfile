FROM rust:1.71 as builder
WORKDIR /usr/src/authmgmt

COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
COPY services/authmgmt services/authmgmt

RUN cargo install --path services/authmgmt

FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/authmgmt /usr/local/bin/authmgmt
CMD ["authmgmt"]