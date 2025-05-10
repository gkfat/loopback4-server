# loopback-4-app

## How to run

require engine

```shell
nodejs >= 20
pnpm 9.15.2
```

run database

```shell
# for local dev
docker compose -p loopback4-app up -d
```

migration

```shell
pnpm migrate
```

test

```shell
pnpm test
```

start server

```shell
pnpm dev

// server running on http://localhost:3000
// api documentation on http://localhost:3000/documentation
```
