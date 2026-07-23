-- Padronização deduzida do schema legado SIGACrim.
-- Mantém nomes de tabelas/colunas do Oracle para simplificar a migração,
-- mas normaliza constraints e índices no PostgreSQL.

-- Fidelidade aos tamanhos e nulabilidade da TB_OPERACAO original.
alter table tb_operacao
    alter column id_etapa_operacao_fk drop not null,
    alter column nr_inquerito_ipl type varchar(12),
    alter column dt_cadastro drop not null,
    alter column dt_ultima_alteracao drop not null;

alter table tb_visibilidade
    alter column ds_visibilidade drop not null;

-- Oracle DATE/TIMESTAMP não carrega offset. No PostgreSQL usamos timestamp sem fuso
-- e tratamos o fuso na aplicação.
alter table tb_operacao
    alter column dt_validacao type timestamp without time zone
        using dt_validacao at time zone 'UTC',
    alter column dt_homologacao type timestamp without time zone
        using dt_homologacao at time zone 'UTC',
    alter column dt_cadastro type timestamp without time zone
        using dt_cadastro at time zone 'UTC',
    alter column dt_ultima_alteracao type timestamp without time zone
        using dt_ultima_alteracao at time zone 'UTC',
    alter column dt_cache_update type timestamp without time zone
        using dt_cache_update at time zone 'UTC';

-- Constraints: <tipo>_<tabela>__[coluna ou tabela referenciada]
alter table tb_etapa_operacao
    rename constraint tb_etapa_operacao_pkey to pk_tb_etapa_operacao;

alter table tb_etapa_operacao
    rename constraint tb_etapa_operacao_cd_etapa_operacao_key
    to uk_tb_etapa_operacao__cd_etapa_operacao;

alter table tb_visibilidade
    rename constraint tb_visibilidade_pkey to pk_tb_visibilidade;

alter table tb_operacao
    rename constraint tb_operacao_pkey to pk_tb_operacao;

alter table tb_operacao
    rename constraint fk_tb_operacao_etapa
    to fk_tb_operacao__tb_etapa_operacao;

alter table tb_operacao
    rename constraint fk_tb_operacao_visibilidade
    to fk_tb_operacao__tb_visibilidade;

alter table tb_operacao
    rename constraint fk_tb_operacao_relacionada
    to fk_tb_operacao__tb_operacao_relacionada;

alter table tb_operacao
    rename constraint ck_tb_operacao_tem_anterior
    to ck_tb_operacao__st_tem_operacao_anterior;

-- Índices: ix_<tabela>__<colunas principais>
alter index tb_etapa_operacao_ix_ds
    rename to ix_tb_etapa_operacao__ds_etapa_operacao;

alter index tb_operacao_ix_nome
    rename to ix_tb_operacao__no_operacao;

alter index tb_operacao_ix_etapa
    rename to ix_tb_operacao__id_etapa_operacao_fk;

alter index idx_operacao_ipl
    rename to ix_tb_operacao__nr_inquerito_ipl;

alter index idx_operacao_dt_alt
    rename to ix_tb_operacao__dt_ultima_alteracao;
