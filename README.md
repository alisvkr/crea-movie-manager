## Excuses (Not enough time to fix those :/)

- .env file added to git (I know this is wrong just added to ease running app locally) (actual environment variables added to Github Action secrets ) \
- some of the development and deployment stages are missing
- missing heroku deployment (got error while deploying, not enough time to fix) \
- some tests not fully covered and some of the e2e test failing\
- could be buggy codes \

## Good To Know

- DB GUI => http://localhost:8081/?pgsql=pgsqldb&username=root
- password written in .env
- Use default "admin" credentials as "manager" user while testing => username:crea password:crea123

## Features

- Authentication => JWT \
- Authorization => RBAC (Role based) \
- ORM Integration => TypeORM \
- DB Migrations => TypeORM \
- In App Logging => winston \
- Audit & Exception Logs => TypeORM \
- Request Validation => class-validator \
- Pagination => SQL offset & limit \
- Docker Ready => Dockerfile \
- Github Actions for build&tests (removed e2e tests from actions(still buggy)) \

## Installation

Note: when using docker, all the `npm` commands can also be performed using `./scripts/npm` (for example `./scripts/npm install`).
This script allows you to run the same commands inside the same environment and versions than the service, without relying on what is installed on the host.

```bash
$ npm install
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- Postgres server running

Commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# using docker
$ docker compose exec app npm run migration:run

# generate migration (replace InitTables with name of the migration)
$ npm run migration:generate --name=InitTables

# run migration
$ npm run migration:run

# revert migration
$ npm run migration:revert
```
