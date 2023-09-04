#!/bin/bash
 kubectl port-forward deployment/postgresql 5432:5432

#  psql -h 127.0.0.1 -p 5432 -d taxi-db -U postgres
# migrate -source file://migrations -database postgres://localhost:5432/taxi-db up 2
