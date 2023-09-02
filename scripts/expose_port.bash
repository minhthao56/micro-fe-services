#!/bin/bash
 kubectl port-forward deployment/postgresql 5432:5432

#  psql --host localhost --username postgres
# migrate -source file://migrations -database postgres://localhost:5432/taxi-db up 2