# server

To install dependencies:

```bash
bun install
```

To run database:

```bash
cd docker; docker compose up -d
```

To stop database:

```bash
cd docker; docker compose down
```

To run sqlc:

```bash
cd docker; docker compose run sqlc generate
```

To run test:

```bash
npm run test
## or npm run test:debug  ## verbose log
```
