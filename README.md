# Sample

## migration

```
docker run -it --rm --network app_internal -v $(pwd)/migration:/migration migrate/migrate:4 -path /migration -database 'postgres://admin:password@postgresd:5432/dev?sslmode=disable' up
```
