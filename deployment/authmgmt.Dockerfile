FROM golang:1.20-alpine

WORKDIR /app

COPY build/usermgmt /app/usermgmt

EXPOSE 9090

CMD [ "./authmgmt" ]