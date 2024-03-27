#!/bin/sh

if [ -n "${DB_OPTS}" ]; then
  DB_OPTS="?${DB_OPTS}"
fi

dbmate \
  -u "postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_OPTS}" \
  "$@"
