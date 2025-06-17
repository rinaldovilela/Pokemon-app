# Documentação Técnica

## Arquitetura

O projeto segue uma arquitetura modular com Angular:

- `core`: Serviços e modelos compartilhados (ex.: `PokemonService`, `pokemon.model.ts`).
- `features`: Módulos de funcionalidades (ex.: `PokemonListComponent` como standalone).
- `shared`: Componentes e pipes reutilizáveis.

## Configuração do Ambiente

- Node.js: v18.x
- Ionic CLI: v7.x
- Dependências: Angular 18, Ionic 7, ESLint (padrão)

## Decisões Técnicas

- **Sem Tailwind CSS**: Estilização com Ionic e CSS nativo.
- **ESLint Padrão**: Usado para linting.
- **PokemonService**: Integração com PokeAPI usando `provideHttpClient`.
- **Tela Principal**: Implementada com `PokemonListComponent` standalone, usando `ion-grid` e paginação com `offset` e `limit`.
- **Correção Standalone**: Ajustado para suportar componentes standalone com rotas diretas.
- **Depuração**: Resolvido erro de sintaxe no `app-routing.module.ts` para exibir a lista de Pokémons.
