#!/bin/sh

./psqldef -W passwordpostgres -h localhost -f postgres/migration/schema.sql appdb
