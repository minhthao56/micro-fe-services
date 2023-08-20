#!/bin/bash
 kubectl port-forward deployment/postgresql 5432:5432

 psql --host localhost --username postgres