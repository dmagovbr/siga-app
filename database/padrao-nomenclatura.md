# Padrão de nomenclatura do banco SIGACrim

Padrão deduzido do schema Oracle legado e adotado no PostgreSQL.

## Tabelas

- Sempre em `snake_case`.
- Prefixo `tb_` para tabelas persistentes.
- Nome no singular: `tb_operacao`, `tb_etapa_operacao`.
- Tabelas associativas combinam as entidades: `tb_operacao_recurso`.

## Colunas

| Prefixo | Uso | Exemplo |
|---|---|---|
| `id_` | identificador | `id_operacao` |
| `id_*_fk` | chave estrangeira | `id_etapa_operacao_fk` |
| `cd_` | código estável | `cd_etapa_operacao` |
| `no_` | nome | `no_operacao` |
| `ds_` | descrição/texto curto | `ds_operacao` |
| `ob_` | observação/texto longo | `ob_validacao` |
| `st_` | estado/indicador | `st_concluida` |
| `dt_` | data ou instante | `dt_cadastro` |
| `nr_` | número identificador | `nr_inquerito_ipl` |
| `qt_` | quantidade | `qt_indiciados` |
| `vl_` | valor monetário/numérico | `vl_montante_fraude` |
| `sg_` | sigla | `sg_unidade` |

Os nomes legados em inglês, como `username`, `saved`, `out` e `system`, são mantidos somente onde já existem no Oracle. Novas colunas devem usar português.

## Chaves e constraints

- PK: `pk_<tabela>`
- FK: `fk_<tabela_filha>__<tabela_pai>`
- FK autorreferente: `fk_<tabela>__<papel_da_relacao>`
- UK: `uk_<tabela>__<colunas>`
- CK: `ck_<tabela>__<regra_ou_coluna>`

Exemplos:

```text
pk_tb_operacao
fk_tb_operacao__tb_etapa_operacao
fk_tb_operacao__tb_operacao_relacionada
uk_tb_etapa_operacao__cd_etapa_operacao
ck_tb_operacao__st_tem_operacao_anterior
```

## Índices

Formato:

```text
ix_<tabela>__<coluna_1>[_<coluna_2>]
```

Exemplo:

```text
ix_tb_operacao__nr_inquerito_ipl
```

Não criar índice manual duplicando uma PK ou UK, pois o PostgreSQL já cria o índice correspondente.

## Tipos PostgreSQL

- IDs numéricos legados: `bigint`.
- Novos identificadores, quando não precisarem interoperar com IDs Oracle: `uuid`.
- Oracle `VARCHAR2`: `varchar(n)` ou `text`, conforme o domínio.
- Oracle `DATE` com horário: `timestamp without time zone`.
- Oracle `TIMESTAMP`: `timestamp without time zone`.
- Datas puras: `date`.
- Valores monetários: `numeric(precision, scale)`.
- Flags legadas: manter `char(1)` durante a migração.
- Novas flags internas: usar `boolean` quando não precisarem reproduzir o Oracle.

## Regra de migração

Tabelas e colunas existentes mantêm seus nomes para permitir comparação e carga Oracle → PostgreSQL. A padronização de constraints, índices e novos objetos acontece desde o início, sem alterar o significado dos dados legados.
