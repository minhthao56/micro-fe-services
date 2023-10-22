FROM debian:bullseye-slim

WORKDIR /app

RUN apt-get update && rm -rf /var/lib/apt/lists/*


COPY build/booking /app/booking

EXPOSE 6060

CMD [ "./booking" ]