# Documentação Técnica

## Arquitetura

O projeto segue uma arquitetura modular com Angular:

- `core`: Serviços e modelos compartilhados (ex.: `PokemonService`, `ThemeService`, `pokemon.model.ts`)
- `features`: Módulos de funcionalidades (ex.: `PokemonListComponent`, `PokemonDetailComponent`, `PokemonFavoritesComponent`, `ThemeToggleComponent` como standalone)
- `shared`: Componentes e pipes reutilizáveis

## Configuração do Ambiente

- Node.js: v18.x
- Ionic CLI: v7.x
- Dependências: Angular 18, Ionic 7, ESLint (padrão), Ionic Storage

## Decisões Técnicas

- **Sem Tailwind CSS**: Estilização com Ionic e CSS nativo
- **ESLint Padrão**: Usado para linting
- **PokemonService**: Integração com PokeAPI usando `provideHttpClient` e gerenciamento de favoritos com Ionic Storage
- **Tela Principal**: Implementada com `PokemonListComponent` standalone, usando `ion-grid` e paginação, com carregamento lazy de imagens e fade-in
- **Dark Mode**: Implementado com `ThemeService` usando `BehaviorSubject` e `Ionic Storage`, com variáveis CSS e transição suave de 0.3s
- **Tela de Detalhes**: Implementada com `PokemonDetailComponent` standalone, navegando por ID via rotas, com tratamento de carregamento, erros, e animações fade-in
- **Favoritos**: Implementada com `PokemonFavoritesComponent` standalone, usando `PokemonService` para gerenciar favoritos via Ionic Storage, com botões visuais para favoritar/desfavoritar na lista principal e navegação para a lista de favoritos. O `slot="end"` foi removido do `<ion-button>` para corrigir problemas de visibilidade
- **Navegação com Estado**: Implementação de preservação de estado durante a navegação usando o objeto `state` do roteador, com fallback para rota padrão (`/pokemon`) quando o estado não está presente. Exemplo:

  ```typescript
  // Navegação com estado (pokemon-favorites.component.ts)
  goToDetail(id: number) {
    this.router.navigate(['/pokemon/detail', id], {
      state: {
        from: '/pokemon/favorites',
        fromUrl: this.router.url
      }
    });
  }

  // Recuperação do estado (pokemon-detail.component.ts)
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.backRoute = navigation?.extras.state?.['from'] || '/pokemon';
  }
  ```
