# loopback-4-app

## How to run

require engine

```shell
nodejs >= 20
```

run database & redis

```shell
# for local dev
docker compose -p loopback4-app up -d
```

migration

```shell
# start the server will auto run migration
pnpm dev
```

seed 

```shell
# will execute src/database/run-seeder.ts
pnpm run seed
```

start server

```shell
pnpm dev

// server running on http://localhost:3000
// api documentation on http://localhost:3000/documentation
```
