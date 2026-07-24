# Refatoração de componentes — Operações

## Objetivo
Reduzir a complexidade da tela de Cadastros de Operações sem alterar comportamento, API, rotas, banco ou aparência.

## Separação realizada

- `operacoes-lista.component`: coordena estado, carregamento, busca e mutações.
- `grid-toolbar`: campo de busca e totalizador.
- `operacoes-grid`: renderização da tabela e eventos do grid.
- `column-resize.directive`: redimensionamento de colunas.
- `infinite-scroll-sentinel.directive`: detecção da próxima página.
- `operacao-modal`: estrutura e ações do modal.
- `etapa-selector`: seleção visual das etapas.
- `operacao-form-fields`: campos do formulário.
- `operacao-form.mapper`: criação, preenchimento e conversão do formulário.
- `operacao-form.types`: tipagem explícita do formulário.
- `operacoes-lista.types`: tipos de ordenação.

## Compatibilidade preservada

- Mesmas rotas e query string `?novo=1`.
- Mesmos endpoints REST.
- Mesma paginação de 20 registros.
- Mesmo debounce de busca de 300 ms.
- Mesma ordenação.
- Mesmo redimensionamento de colunas.
- Mesmo carregamento automático ao chegar ao fim do grid.
- Mesmo formulário, validações, mensagens e confirmação de exclusão.
- Nenhuma migration ou dependência nova.

## Limpeza

A cópia antiga `siga-app-login-menu/` foi removida do pacote para evitar duas fontes de verdade.
