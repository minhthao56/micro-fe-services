FROM golang:1.20-alpine

WORKDIR /app

COPY build/migration /app/migration
COPY migrations migrations

CMD [ "./migration" ]