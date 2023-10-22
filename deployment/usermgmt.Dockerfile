FROM debian:bullseye-slim

RUN apt-get update && rm -rf /var/lib/apt/lists/*

COPY target/x86_64-unknown-linux-gnu/release/usermgmt /usr/local/bin/usermgmt

EXPOSE 9090

CMD ["usermgmt"]