# Flutter_Dart

Estrutura de **frontend com package reutilizável** em **Flutter/Dart** para **web**: um monorepo com **apps** e **packages internos**, orquestrado pelo **Melos**.

> 🧩 Variante Flutter da estrutura [Frontend com package reutilizável](../../../../README.md#frontend-com-package-reutilizável).

## O que é

Um monorepo Flutter dividido em duas camadas:

- **`apps/`** — as aplicações. Cada app é um projeto Flutter Web independente (`main.dart`, rotas, features).
- **`packages/`** — bibliotecas internas reutilizáveis consumidas pelos apps:
  - `core` — tipos, erros, utilitários e extensões (Dart puro);
  - `design_system` — tema, cores, tipografia e widgets compartilhados;
  - `network` — cliente HTTP, interceptors e tipos de transporte.

Os apps consomem os packages por **dependência local**, e o **Melos** linka o workspace, roda comandos em todos os packages e cuida de versionamento.

O gerenciamento de estado é feito com **Riverpod** (`flutter_riverpod`), e a navegação com **go_router**.

## Quando usar

- Quando há **mais de um front** compartilhando UI ou lógica;
- Quando se quer **consistência visual e de comportamento** entre produtos;
- Quando o alvo é **web** (build estático servido por nginx);
- Quando o time já tem maturidade em **monorepo/pacotes internos**.

## Quando NÃO usar

- Quando existe **apenas um front** e nada é compartilhado — use [Frontend comum](../../../../README.md#frontend-comum);
- Quando o alvo é **apenas mobile** e não há outros apps consumindo os packages;
- Quando o time não tem como manter a **governança de versões** dos packages;
- Quando o projeto é pequeno e o overhead do Melos não se paga.

## Estrutura de diretórios

```text
Flutter_Dart/
├── melos.yaml                       # configuração do monorepo (Melos)
├── pubspec.yaml                     # raiz do workspace
├── analysis_options.yaml            # análise estática compartilhada
├── Dockerfile                       # build do web + runtime nginx
├── nginx.conf                       # config do nginx (fallback de SPA)
├── .dockerignore
├── .gitignore
├── .env.example                     # variáveis usadas via --dart-define
│
├── apps/                            # aplicações Flutter Web
│   └── app_example/                 # app de exemplo (copie e renomeie)
│       ├── pubspec.yaml
│       ├── lib/
│       │   ├── main.dart            # bootstrap (ProviderScope + App)
│       │   ├── app.dart             # MaterialApp, tema, roteador
│       │   ├── core/                # config, constantes e extensões do app
│       │   ├── routing/             # definição de rotas (go_router)
│       │   └── features/            # feature-first
│       │       └── example/         # uma feature de exemplo
│       │           ├── data/        # data sources, DTOs, repositórios (impl)
│       │           ├── domain/      # entidades, contratos, use cases
│       │           └── presentation/# páginas, widgets e controllers (Riverpod)
│       ├── test/                    # testes do app
│       ├── web/                     # index.html e manifest do Flutter Web
│       └── assets/
│           └── images/
│
└── packages/                        # bibliotecas internas reutilizáveis
    ├── core/                        # tipos, erros, utils, extensões
    │   ├── pubspec.yaml
    │   ├── lib/
    │   │   ├── core.dart            # API pública do package
    │   │   └── src/                 # implementação (não exportada direto)
    │   └── test/
    ├── design_system/               # tema, cores, tipografia, widgets
    │   ├── pubspec.yaml
    │   ├── lib/
    │   │   ├── design_system.dart
    │   │   └── src/
    │   └── test/
    └── network/                     # cliente HTTP, interceptors
        ├── pubspec.yaml
        ├── lib/
        │   ├── network.dart
        │   └── src/
        └── test/
```

## Convenções

**Nomes**

- Packages Dart usam **`snake_case`** (exigência do `pub`): `design_system`, `app_example`;
- Pastas dentro de `lib/` usam **`kebab-case`** quando não são pacotes: `use-cases`, `data-sources`;
- Um **package interno por responsabilidade**, não por tela.

**Camadas (dentro de cada feature)**

| Camada | Contém | Pode importar |
| --- | --- | --- |
| `domain` | entidades, contratos, use cases | apenas `domain` e `core` |
| `data` | DTOs, data sources, implementações | `domain` e `core` |
| `presentation` | páginas, widgets, controllers | `domain`, `design_system` |

- `presentation` **não** importa `data` diretamente: use os contratos de `domain`;
- Um package **nunca** importa o código de um app;
- Nada de import cruzado entre features — o que é comum sobe para `packages/`.

**Estado (Riverpod)**

- `Provider` para injeção de dependência (repositórios, clientes);
- `Notifier`/`AsyncNotifier` para estado de tela;
- Providers declarados **junto da feature** (`presentation/`), não num arquivo global único.

**Versionamento**

- Packages internos começam em `0.1.0` e seguem **semver**;
- Breaking change em package interno exige bump de major e nota no changelog.

## Vantagens / Desvantagens

**Vantagens**

- Reuso real de tema, widgets e utilitários entre apps;
- Consistência visual garantida pelo `design_system`;
- Um comando só (`melos bootstrap`) resolve o workspace inteiro;
- Camadas bem separadas facilitam teste e refatoração;
- Build web reprodutível via Docker.

**Desvantagens**

- Setup mais complexo: Melos, workspace e dependências locais;
- Exige disciplina de fronteiras entre camadas e packages;
- Mudança em package interno exige atenção ao impacto nos apps;
- `snake_case` de packages **contraria** a regra geral de `kebab-case` do repositório;
- Overhead desnecessário para um app único.

## Como rodar

Detalhes de configuração ficam no [`INSTALL.md`](INSTALL.md).

**Local (Flutter + Melos)**

```bash
melos bootstrap                        # linka e resolve o workspace
melos run build:web                    # build de produção do app
cd apps/app_example && flutter run -d chrome
```

**Docker**

```bash
docker build -t front-reusable-flutter .
docker run --rm -p 8080:80 front-reusable-flutter
# abra http://localhost:8080
```

## Exemplo de uso

1. Copie esta pasta para o seu projeto;
2. Renomeie `apps/app_example` para o nome do seu app (ver [`INSTALL.md`](INSTALL.md));
3. Ajuste os nomes dos packages em `melos.yaml` e nos `pubspec.yaml`;
4. Crie as features em `apps/<app>/lib/features/<feature>/` seguindo as camadas;
5. Só coloque algo em `packages/` quando **dois ou mais apps** precisarem da mesma coisa.
