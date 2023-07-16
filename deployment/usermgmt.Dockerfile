FROM golang:1.20-alpine

WORKDIR /app

COPY ./build/usermgmt ./

# COPY go.mod ./

# COPY go.sum ./

# COPY main.go ./

# COPY pkg ./pkg

# COPY core ./core

# COPY port ./port

# COPY database ./database

# RUN go mod download

# RUN go build -o /docker-todo-go-grpc

EXPOSE 9090

CMD [ "/usermgmt" ]