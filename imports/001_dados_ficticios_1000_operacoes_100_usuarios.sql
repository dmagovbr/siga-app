-- OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo 001_dados_ficticios_1000_operacoes_100_usuarios.sql.
-- Cada bloco descreve a estrutura ou os dados que serão criados no banco.
-- SIGACrim - carga fictícia para desenvolvimento e homologação
-- Banco: PostgreSQL 17
-- Conteúdo: 1.000 operações e 100 usuários
-- Senha inicial de todos os usuários: Senha@123
--
-- Execução sugerida:
--   docker exec -i sigacrim-postgres psql -U sigacrim -d sigacrim \
--     < database/seeds/001_dados_ficticios_1000_operacoes_100_usuarios.sql
--
-- ATENÇÃO: não executar em produção.

begin;

-- Permite repetir a carga no ambiente local sem duplicar os dados deste seed.
delete from tb_operacao
where no_operacao like '[FICTÍCIO] %';

delete from tb_usuario
where cd_usuario like 'teste%';

-- -----------------------------------------------------------------------------
-- 100 usuários fictícios
-- Código: teste001 até teste100
-- E-mail: teste001@sigacrim.local até teste100@sigacrim.local
-- Senha: Senha@123 (BCrypt)
-- -----------------------------------------------------------------------------
-- Insere um registro inicial necessário para o funcionamento do sistema.
insert into tb_usuario
(
    cd_usuario,
    no_usuario,
    ds_email,
    ds_senha_hash,
    st_ativo,
    st_trocar_senha,
    st_suporte,
    dt_cadastro,
    dt_ultima_alteracao
)
select
    'teste' || lpad(numero::text, 3, '0'),
    (array[
        'Ana', 'Bruno', 'Carla', 'Daniel', 'Eduarda',
        'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João',
        'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olívia',
        'Paulo', 'Renata', 'Sérgio', 'Talita', 'Vinícius'
    ])[((numero - 1) % 20) + 1]
    || ' '
    || (array[
        'Almeida', 'Barbosa', 'Cardoso', 'Duarte', 'Esteves',
        'Ferreira', 'Gomes', 'Haddad', 'Ibrahim', 'Jardim',
        'Lima', 'Mendes', 'Nogueira', 'Oliveira', 'Pereira',
        'Queiroz', 'Ribeiro', 'Silva', 'Teixeira', 'Vieira'
    ])[(((numero - 1) / 20) % 20) + 1]
    || ' (Teste ' || lpad(numero::text, 3, '0') || ')',
    'teste' || lpad(numero::text, 3, '0') || '@sigacrim.local',
    '$2y$10$BYW7XJwUpHzdx1njuSbr1OvP3X7AopaXv6plQWqhizIwkiQz4RaZa',
    case when numero % 20 = 0 then '0' else '1' end,
    '1',
    case when numero in (1, 2, 3) then '1' else '0' end,
    current_timestamp - ((100 - numero) * interval '1 day'),
    current_timestamp - ((100 - numero) * interval '1 day')
from generate_series(1, 100) as serie(numero);

-- -----------------------------------------------------------------------------
-- 1.000 operações fictícias
-- Usa a etapa 10 (Cadastro), já criada pela migration inicial.
-- Distribui visibilidade, datas, status e textos para testar grid, filtros,
-- ordenação, paginação e carga incremental.
-- -----------------------------------------------------------------------------
-- Insere um registro inicial necessário para o funcionamento do sistema.
insert into tb_operacao
(
    id_etapa_operacao_fk,
    id_visibilidade_fk,
    nr_inquerito_ipl,
    no_operacao,
    ds_razao_nome,
    dt_inicio_operacao,
    st_tem_operacao_anterior,
    st_abortada,
    st_validacao,
    st_finalizacao,
    st_homologacao,
    st_concluida,
    ds_operacao,
    ds_notas,
    dt_cadastro,
    dt_ultima_alteracao,
    st_username_cadastro,
    st_username_ultima_alteracao,
    ds_ultima_alteracao,
    ds_uf_inq_out,
    ds_unidade_inq_out,
    ds_area_inq_out,
    ds_etapa_operacao_out,
    st_system
)
select
    10,
    case when numero % 4 = 0 then 'P' else 'R' end,
    lpad(numero::text, 7, '0') || '/2026',
    '[FICTÍCIO] Operação '
        || (array[
            'Aurora', 'Baluarte', 'Candeia', 'Diamante', 'Eclipse',
            'Fortaleza', 'Guardiã', 'Horizonte', 'Ícaro', 'Júpiter',
            'Lince', 'Muralha', 'Nébula', 'Órbita', 'Pioneira',
            'Quimera', 'Rastro', 'Sentinela', 'Trovão', 'Vértice'
        ])[((numero - 1) % 20) + 1]
        || ' ' || lpad(numero::text, 4, '0'),
    'Nome fictício criado para testes de desenvolvimento e homologação.',
    date '2023-01-01' + ((numero * 3) % 1300),
    case when numero % 9 = 0 then '1' else '0' end,
    case when numero % 37 = 0 then '1' else '0' end,
    case when numero % 3 = 0 then '1' else '0' end,
    case when numero % 5 = 0 then '1' else '0' end,
    case when numero % 7 = 0 then '1' else '0' end,
    case when numero % 11 = 0 then '1' else '0' end,
    'Descrição fictícia da operação ' || lpad(numero::text, 4, '0')
        || '. Registro destinado exclusivamente a testes funcionais, de desempenho e interface.',
    case
        when numero % 6 = 0 then 'Nota fictícia: revisar documentação e vínculos relacionados.'
        when numero % 10 = 0 then 'Nota fictícia: operação marcada para conferência em homologação.'
        else null
    end,
    current_timestamp - ((1000 - numero) * interval '2 hours'),
    current_timestamp - ((1000 - numero) * interval '90 minutes'),
    'teste' || lpad((((numero - 1) % 100) + 1)::text, 3, '0'),
    'teste' || lpad((((numero + 16) % 100) + 1)::text, 3, '0'),
    'Carga fictícia automatizada para validação do SIGACrim.',
    (array['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'])
        [((numero - 1) % 27) + 1],
    'Unidade de Teste ' || lpad((((numero - 1) % 50) + 1)::text, 2, '0'),
    (array[
        'Crimes Financeiros', 'Entorpecentes', 'Meio Ambiente',
        'Crimes Cibernéticos', 'Patrimônio', 'Organizações Criminosas',
        'Controle de Armas', 'Combate à Corrupção'
    ])[((numero - 1) % 8) + 1],
    'Cadastro',
    0
from generate_series(1, 1000) as serie(numero);

-- Ajusta as sequences após a carga, preservando inserções futuras por identity.
select setval(
    pg_get_serial_sequence('tb_usuario', 'id_usuario'),
    coalesce((select max(id_usuario) from tb_usuario), 1),
    true
);

select setval(
    pg_get_serial_sequence('tb_operacao', 'id_operacao'),
    coalesce((select max(id_operacao) from tb_operacao), 1),
    true
);

commit;

-- Conferência esperada deste seed:
select count(*) as usuarios_ficticios
from tb_usuario
where cd_usuario like 'teste%';

select count(*) as operacoes_ficticias
from tb_operacao
where no_operacao like '[FICTÍCIO] %';
