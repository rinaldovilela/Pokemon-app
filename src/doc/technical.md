# Documentação Técnica

## Arquitetura

O projeto segue uma arquitetura modular com Angular:

- `core`: Serviços e modelos compartilhados.
- `features`: Módulos de funcionalidades (ex.: Pokémon).
- `shared`: Componentes e pipes reutilizáveis.

## Configuração do Ambiente

- Node.js: v18.x
- Ionic CLI: v7.x
- Dependências: Ionic 7, Angular 18, ESLint

## Decisões Técnicas

- **SCSS nativo**: Escolhido para estilização, aproveitando as variáveis do Ionic.
- **ESLint padrão**: Usado para garantir qualidade de código sem ferramentas adicionais.
