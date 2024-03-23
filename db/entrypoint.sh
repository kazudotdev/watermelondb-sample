#!/bin/sh

if [ -n "${DB_OPTS}" ]; then
  DB_OPTS="?${DB_OPTS}"
fi

migrate \
  -database "postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_OPTS}" \
  -path "${MIGRATION_DIR}" \
  "$@"

if [ $? -ne 0 ]; then
  echo [CMD] migrate \
  -database "postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_OPTS}" \
  -source "${MIGRATION_DIR}" \
  "$@"
fi
