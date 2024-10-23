# Todo-List trf api


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
docker compose up
```

## Compile and run the project

```bash
$ npm run start
```

## Run tests

```bash
# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# API first
you can find swagger here:
http://localhost:4000/swagger#/

# 12 factor app (https://12factor.net/)
- 1) [+] Codebase is tracked in GIT
- 2) [+] External dependencies are explicitly declared in docker-compose file. Application won't bootstrap if any dependency is not satisfied
- 3) [+] Configuration - configuration is done via environment variables (.env.example file is included)
- 4) [+] Backing services - credentials to external dependencies are to be provided via ENV variables. They are not stored in any hardcoded config files, which means they can be changed without rebuild the app, but with a simple restart

- 5) [~] Build, release, and run - because deployment pipeline is not set up, it is hard to claim this criteria is fulfilled
- 6) [+] Stateless process - the app doesn't operate with any implicit state, and purely relies on data provided by data-storage dependency (postgres in our case)
- 7) [+] Port binding - application is binded on port, specified in ENV vars (4000 by default)
- 8) [+] Concurrency (scalability) - due to its stateless nature, the application can be horizontally scaled up & down, to handle increasing workload. (At this moment the app doesn't operate with any transaction, nor it assumes concurrent read\write operations on the same resources. If needed - it will be handled by optimistic concurrency, distributed locks, whatever suits the most)
- 9) [~] Disposability - at this moment the app is simple enough to bootstrap & shutdown quickly enough, to align with horizontal scaling strategies
- 10) [~] Dev/Prod parity - the app is simple enough, and its dependencies are easy to satisfy, so it can be considered complained with this factor
- 11) [~] Logs - The application's logger utilizes different transports for logs: STDOUT & STDERR, files. I assume its logs are ready to be consumed as a stream of events, for further processing by any corresponding stack (ELK, Grafana-Loki, ect)
- 12) [--] Administrative processes - at this moment, migrations are not separated in their own job, but executed each time on application bootstrap for simplicity of development. When time comes to deploy the app in prod\staging environment, migrations (and any other administrative tasks & preparations) will be separated.

# Other notes:
- api-first - you can utilize swagger or any other tool to use the application
- healthcheck endpoint is available at `/api/v1/health`
- the app has basis for CQRS approach, which allows it to be easily divided in 2 separate apps\processes: one for read, and other one for write requests
- each command\query adopts Value-Object behavior (self validation)
- logger can be used either explicitly, via DI, or implicitly - via @withLogger decorator. Decorator logs method's arguments, returned result, and raised exception (in case of failure)
- all logs always contain `trace-id` property, which allows logs to be quired for a single request\flow
- authentication is done with JWT tokens. Currently, there is no feature to blacklist\invalidate tokens.
- application verifies its configuration on start, to fail fast in case of any misconfiguration