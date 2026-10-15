# React_Javascript

Estrutura de **frontend com package reutilizável** em **React + JavaScript** para **web**: um monorepo com **apps** e **packages internos**, orquestrado pelo **pnpm workspaces**.

> 🧩 Variante React da estrutura [Frontend com package reutilizável](../../../../README.md#frontend-com-package-reutilizável).

## O que é

Um monorepo JavaScript dividido em duas camadas:

- **`apps/`** — as aplicações. Cada app é um projeto **Vite + React** independente (`main.jsx`, rotas, features).
- **`packages/`** — bibliotecas internas reutilizáveis consumidas pelos apps:
  - `core` — tipos, erros, utilitários e formatadores (JS puro);
  - `design-system` — tokens, tema, CSS e componentes compartilhados;
  - `network` — cliente HTTP, interceptors e tipos de transporte.

Os apps consomem os packages pelo **workspace** (`workspace:*`), e o **pnpm** cria os symlinks — não há build intermediário: os packages são consumidos direto da fonte.

O gerenciamento de estado combina **Zustand** (estado global do cliente) com **TanStack Query** (estado de servidor), e a navegação usa **React Router**.

## Quando usar

- Quando há **mais de um front** compartilhando UI ou lógica;
- Quando se quer **consistência visual e de comportamento** entre produtos;
- Quando uma SPA (Client-Side Rendering) atende ao produto;
- Quando o time já tem maturidade em **monorepo/pacotes internos**.

## Quando NÃO usar

- Quando existe **apenas um front** e nada é compartilhado — use [Frontend comum](../../../../README.md#frontend-comum);
- Quando o produto **depende de SEO/SSR** — avalie Next.js (fora do escopo desta estrutura);
- Quando o time não tem como manter a **governança de versões** dos packages;
- Quando o projeto é pequeno e o overhead de workspaces não se paga.

## Estrutura de diretórios

```text
React_Javascript/
├── package.json                     # raiz do workspace (scripts + devDeps globais)
├── pnpm-workspace.yaml              # define apps/** e packages/**
├── .npmrc                           # config do pnpm
├── eslint.config.js                 # lint compartilhado
├── .prettierrc                      # formatação compartilhada
├── Dockerfile                       # build do app + runtime nginx
├── nginx.conf                       # config do nginx (fallback de SPA)
├── .dockerignore
├── .gitignore
│
├── apps/                            # aplicações
│   └── app-example/                 # app de exemplo (copie e renomeie)
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html               # HTML de entrada do Vite
│       ├── .env.example             # variáveis VITE_* do app
│       └── src/
│           ├── main.jsx             # bootstrap (Providers + ReactDOM)
│           ├── app.jsx              # composição: router + layout
│           ├── core/                # config, constantes e utilitários do app
│           ├── routing/             # definição de rotas
│           ├── shared/              # componentes/hooks usados por 2+ features
│           └── features/            # feature-first
│               └── example/         # uma feature de exemplo
│                   ├── domain/      # entidades, contratos, regras
│                   ├── data/        # clients, DTOs, repositórios (impl)
│                   └── presentation/# páginas, componentes e hooks
│
└── packages/                        # bibliotecas internas reutilizáveis
    ├── core/                        # tipos, erros, utils, formatadores
    │   ├── package.json
    │   └── src/
    │       ├── index.js             # API pública do package
    │       └── ...                  # implementação
    ├── design-system/               # tokens, tema, CSS e componentes
    │   ├── package.json
    │   └── src/
    │       ├── index.js
    │       ├── tokens.css
    │       └── ...
    └── network/                     # cliente HTTP, interceptors
        ├── package.json
        └── src/
            ├── index.js
            └── ...
```

## Convenções

**Nomes**

- Package, pasta e arquivo em **`kebab-case`**: `design-system`, `example-page.jsx`;
- Componentes React exportados em **PascalCase** (`ExamplePage`), arquivos em `kebab-case`;
- Um **package interno por responsabilidade**, não por tela.

**Camadas (dentro de cada feature)**

| Camada | Contém | Pode importar |
| --- | --- | --- |
| `domain` | entidades, contratos, regras | apenas `domain` e `core` |
| `data` | clients, DTOs, implementações | `domain` e `core` |
| `presentation` | páginas, componentes, hooks | `domain` e `design-system` |

- `presentation` **não** importa `data` diretamente: use os contratos de `domain`;
- Um package **nunca** importa o código de um app;
- Nada de import cruzado entre features — o que é comum sobe para `shared/` ou `packages/`.

**Estado**

- **Zustand** para estado global do cliente (UI, sessão, preferências);
- **TanStack Query** para estado de servidor (fetch, cache, invalidação);
- Não duplicar estado de servidor no Zustand — a Query é a fonte da verdade.

**Estilo**

- **CSS Modules** por componente (`example-page.module.css`);
- Tokens e tema centralizados em `packages/design-system`;
- Nada de cor/espaçamento hardcoded — use as variáveis de token.

## Vantagens / Desvantagens

**Vantagens**

- Reuso real de tema, componentes e utilitários entre apps;
- Consistência visual garantida pelo `design-system`;
- Sem build intermediário: os packages são consumidos direto da fonte;
- Camadas bem separadas facilitam teste e refatoração;
- Build reprodutível via Docker.

**Desvantagens**

- Setup exige pnpm + workspaces (não é um `npm install` comum);
- Exige disciplina de fronteiras entre camadas e packages;
- A resolução de packages por fonte exige cuidado com o `exports` de cada um;
- Mudança em package interno exige atenção ao impacto nos apps;
- Overhead desnecessário para um app único.

## Como rodar

Detalhes de configuração ficam no [`INSTALL.md`](INSTALL.md).

**Local**

```bash
pnpm install                           # instala e linka o workspace
pnpm --filter app-example dev          # dev server do app
pnpm build                             # build de produção
pnpm lint && pnpm test                 # verificações
```

**Docker**

```bash
docker build -t front-reusable-react .
docker run --rm -p 8080:80 front-reusable-react
# abra http://localhost:8080
```

## Exemplo de uso

1. Copie esta pasta para o seu projeto;
2. Renomeie `apps/app-example` para o nome do seu app (ver [`INSTALL.md`](INSTALL.md));
3. Ajuste o escopo dos packages (`@front-reusable/*`) nos `package.json`;
4. Crie as features em `apps/<app>/src/features/<feature>/` seguindo as camadas;
5. Só coloque algo em `packages/` quando **dois ou mais apps** precisarem da mesma coisa.
