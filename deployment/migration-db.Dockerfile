FROM debian:bullseye-slim

RUN apt-get update && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY build/migration /app/migration

COPY migrations migrations

CMD [ "./migration" ]