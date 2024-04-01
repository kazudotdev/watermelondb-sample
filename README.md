# Sample

## migration

- create migration files
```
docker compose run migrate create -dir /migration -seq -ext sql {migration name}
```
- apply migration files
```
docker compose run migrate up
```

## structures

- apps/
  - server
    - backend server
  - hanko
    - passkey (webauthn) service
- packages
  - db
    - packages for database accessing and management
