FROM rust:1.71 as builder

WORKDIR /usr/src/usermgmt

ENV SQLX_OFFLINE=true
COPY .sqlx .sqlx
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
COPY services/usermgmt services/usermgmt
COPY libs/rust libs/rust

RUN cargo install --path services/usermgmt

FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/usermgmt /usr/local/bin/usermgmt

EXPOSE 9090

CMD ["usermgmt"]