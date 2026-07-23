# Banco PostgreSQL do SIGACrim

O ambiente local usa PostgreSQL via Docker Compose.

- Host: `localhost`
- Porta: `5432`
- Banco: `sigacrim`
- Usuário: `sigacrim`
- Senha local: `sigacrim`

O Flyway executa automaticamente os arquivos de:

`apps/api/src/main/resources/db/migration`

A primeira migration cria `tb_etapa_operacao`, `tb_visibilidade` e `tb_operacao`, preservando os nomes do legado Oracle para facilitar a migração.


Consulte [`padrao-nomenclatura.md`](./padrao-nomenclatura.md) para o padrão deduzido do legado e adotado no PostgreSQL.
