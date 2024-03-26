# server

To install dependencies:

```bash
bun install
```

To run database:

```bash
docker compose up -d
```

To stop database:

```bash
docker compose down
```

To run:

```bash
bun run dev
```

To run sqlc:

```bash
docker compose run sqlc generate
```

To run test:

```bash
npm run test
## or npm run test:debug  ## verbose log
```
