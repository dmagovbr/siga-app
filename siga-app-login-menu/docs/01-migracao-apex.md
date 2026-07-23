# Estratégia de migração do APEX

1. Inventariar aplicações, páginas, regiões, processos, validações e autorizações.
2. Mapear tabelas, views, packages, procedures, triggers e jobs Oracle.
3. Selecionar um módulo pequeno e de baixo risco.
4. Reimplementar a regra no backend Java e a interface no Angular.
5. Operar APEX e nova aplicação em paralelo durante a homologação.
6. Desativar cada módulo legado somente após validação funcional.

Não mover regras críticas diretamente para o frontend. Regras de negócio e autorização devem ficar na API.
