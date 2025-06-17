# Documentação Técnica

## Arquitetura

O projeto segue uma arquitetura modular com Angular:

- `core`: Serviços e modelos compartilhados (ex.: `PokemonService`, `ThemeService`, `pokemon.model.ts`).
- `features`: Módulos de funcionalidades (ex.: `PokemonListComponent`, `PokemonDetailComponent`, `ThemeToggleComponent` como standalone).
- `shared`: Componentes e pipes reutilizáveis.

## Configuração do Ambiente

- Node.js: v18.x
- Ionic CLI: v7.x
- Dependências: Angular 18, Ionic 7, ESLint (padrão), Ionic Storage

## Decisões Técnicas

- **Sem Tailwind CSS**: Estilização com Ionic e CSS nativo.
- **ESLint Padrão**: Usado para linting.
- **PokemonService**: Integração com PokeAPI usando `provideHttpClient`.
- **Tela Principal**: Implementada com `PokemonListComponent` standalone, usando `ion-grid` e paginação, com carregamento lazy de imagens e fade-in.
- **Dark Mode**: Implementado com `ThemeService` usando `BehaviorSubject` e `Ionic Storage`, com variáveis CSS e transição suave de 0.3s.
- **Tela de Detalhes**: Implementada com `PokemonDetailComponent` standalone, navegando por ID via rotas, com tratamento de carregamento, erros, e animações fade-in.
