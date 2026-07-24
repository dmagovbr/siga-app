# Guia dos comentários do código

O código foi comentado para facilitar manutenção humana sem depender de IA.

## Padrão aplicado

- Todo arquivo de código começa com uma descrição curta de sua responsabilidade.
- Classes, componentes, diretivas, endpoints e funções recebem comentários de intenção.
- Condições, chamadas assíncronas e mudanças de estado recebem comentários quando ajudam a entender o fluxo.
- Imports, chaves, getters simples e sintaxe evidente não são comentados para evitar poluição visual.
- Arquivos JSON e `package-lock.json` não recebem comentários porque o formato JSON não permite comentários válidos.

## Regra de manutenção

Ao alterar uma regra, atualize o comentário apenas quando a intenção mudar. O comentário deve explicar **por que** ou **qual responsabilidade** o trecho possui, e não apenas repetir literalmente o código.
