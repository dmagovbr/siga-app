# SIGA App

Nova base do SIGACrim, separada do Oracle APEX.

## Stack

- Java 21 + Spring Boot
- Angular
- Oracle (integração será adicionada por módulo)

## Estrutura

- `apps/api`: API Java
- `apps/web`: aplicação Angular
- `deploy/local`: setup e execução no WSL
- `database`: scripts de banco
- `docs`: documentação funcional e técnica

## Início rápido no WSL

```bash
cd /home/daniel/Code/govbr/siga-app
chmod +x deploy/local/*.sh
./deploy/local/setup.sh
./deploy/local/start.sh
```

Acessos:

- Site: http://localhost:4200
- API: http://localhost:8080/api/health

Para encerrar, pressione `Ctrl+C` no terminal do `start.sh`.
