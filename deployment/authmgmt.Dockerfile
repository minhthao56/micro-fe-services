FROM golang:1.20-alpine

WORKDIR /app

COPY build/authmgmt /app/authmgmt

EXPOSE 8080

CMD [ "./authmgmt" ]