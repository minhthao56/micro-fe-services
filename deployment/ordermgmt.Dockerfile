FROM golang:1.20-alpine

WORKDIR /app

COPY build/ordermgmt /app/ordermgmt

EXPOSE 6060

CMD [ "./ordermgmt" ]