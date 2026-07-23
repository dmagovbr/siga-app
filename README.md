# SIGACrim

Nova base do SIGACrim em Java, Angular e PostgreSQL.

## Stack

- Java 21 + Spring Boot
- Angular 20
- PostgreSQL 17
- Flyway
- Spring Data JPA

## Setup local

```bash
cd /home/daniel/Code/govbr/siga-app
chmod +x deploy/local/*.sh
./deploy/local/setup.sh
```

## Iniciar

```bash
./deploy/local/start.sh
```

Acessos:

- Site: http://localhost:4200
- Health: http://localhost:8080/api/health
- Operações: http://localhost:8080/api/operacoes

O PostgreSQL é iniciado automaticamente pelos scripts.
