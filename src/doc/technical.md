# Documentação Técnica

## Arquitetura

O projeto segue uma arquitetura modular com Angular:

- `core`: Serviços e modelos compartilhados (ex.: `PokemonService`, `pokemon.model.ts`).
- `features`: Módulos de funcionalidades (ex.: Pokémon).
- `shared`: Componentes e pipes reutilizáveis.

## Configuração do Ambiente

- Node.js: v18.x
- Ionic CLI: v7.x
- Dependências: Angular 18, Ionic 7, ESLint (padrão)

## Decisões Técnicas

- **Sem Tailwind CSS**: Estilização com Ionic e CSS nativo.
- **ESLint Padrão**: Usado para linting.
- **PokemonService**: Integração com PokeAPI usando HttpClient, com `provideHttpClient` para DI moderna.
- **Depreciação**: Substituído `HttpClientModule` por `provideHttpClient(withInterceptorsFromDi())`.
