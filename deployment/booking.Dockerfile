FROM golang:1.20-alpine

WORKDIR /app

COPY build/booking /app/booking

EXPOSE 6060

CMD [ "./booking" ]