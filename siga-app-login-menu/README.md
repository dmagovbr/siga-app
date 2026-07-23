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


## Usuários e escopo organizacional

A `V1__operacao_base.sql` também cria o modelo normalizado de usuários:

- `tb_usuario`
- `tb_perfil` e `tb_usuario_perfil`
- `tb_uf` e `tb_usuario_uf`
- `tb_unidade` e `tb_usuario_unidade`
- `tb_area_atribuicao` e `tb_usuario_area_atribuicao`

Um usuário pode possuir vários perfis, UFs, unidades e áreas de atribuição. Senhas são armazenadas somente como hash BCrypt. O usuário local inicial é `admin`, senha temporária `Admin@123`, com troca obrigatória.

### Regra temporária de migrations

Durante a modelagem inicial deve existir somente `V1__operacao_base.sql`. Não criar V2 por enquanto. Toda nova tabela ou correção deve entrar na V1 e o banco local deve ser recriado com:

```bash
rm -rf apps/api/target
docker compose down -v --remove-orphans
./deploy/local/setup.sh
./deploy/local/start.sh
```

## Fluxo atual: somente V1

Durante a modelagem inicial, deve existir apenas `V1__operacao_base.sql`. Novas tabelas e correções entram diretamente na V1; o banco local é recriado. Não criar V2 até decisão explícita de estabilização do modelo.

Para limpar banco, rebuildar e iniciar tudo em um único comando:

```bash
cd /home/daniel/Code/govbr/siga-app
chmod +x deploy/local/*.sh
./deploy/local/reset-start.sh
```

Acesso inicial local:

- Site: http://localhost:4200
- Usuário: `admin`
- Senha: `Admin@123`
- API: http://localhost:8080/api/health
