# INSTALL

Guia do que **configurar** (e do que **não** alterar) ao usar a estrutura `Flutter_Dart`.

## Pré-requisitos

| Ferramenta | Versão | Para quê |
| --- | --- | --- |
| Flutter SDK | `>= 3.27` (Dart `>= 3.6`) | build do app |
| Dart SDK | vem com o Flutter | tooling |
| Melos | `^6` | orquestração do monorepo |
| Docker | `>= 24` | build/serve da imagem |
| Chrome/Edge | atual | `flutter run -d chrome` |

Instalação do Melos:

```bash
dart pub global activate melos
```

## Configuração

1. **Linke o workspace**

   ```bash
   melos bootstrap
   ```

   Isso roda `pub get` em cada app/package e cria os `pubspec_overrides.yaml` locais.

2. **Crie o arquivo de ambiente**

   ```bash
   cp .env.example .env
   ```

3. **Rode o app em modo dev**

   ```bash
   cd apps/app_example
   flutter run -d chrome --dart-define-from-file=../../.env
   ```

4. **Gere o build de produção**

   ```bash
   melos run build:web
   ```

5. **(Opcional) Suba via Docker**

   ```bash
   docker build -t front-reusable-flutter .
   docker run --rm -p 8080:80 front-reusable-flutter
   ```

## Variáveis de ambiente

O Flutter não lê `.env` em runtime no runtime web: os valores são **injetados no build** via `--dart-define` (ou `--dart-define-from-file`).

| Variável | Descrição | Obrigatória |
| --- | --- | --- |
| `API_URL` | URL base da API consumida pelo app | sim |
| `APP_ENV` | ambiente (`development`, `staging`, `production`) | não |

Para injetar no build do Docker, passe como credencial de build:

```bash
docker build --build-arg API_URL=https://api.exemplo.com -t app .
```

> Requer a linha `ARG API_URL` + `--dart-define` no `Dockerfile`. Por padrão o build sai sem variáveis.

## Renomear / ajustar

Ao adotar a estrutura, ajuste:

| O que | Onde |
| --- | --- |
| Nome do app | pasta `apps/app_example` → `apps/<seu_app>` |
| Nome do package do app | `name:` em `apps/<seu_app>/pubspec.yaml` |
| Nomes dos apps no workspace | `melos.yaml` → `packages:` e o `scope:` do script `build:web` |
| Nome raiz do workspace | `name:` em `pubspec.yaml` (raiz) e `name:` em `melos.yaml` |
| Título exibido | `apps/<seu_app>/lib/app.dart` e `apps/<seu_app>/web/index.html` |
| `description` dos packages | `description:` em cada `pubspec.yaml` |
| URL da API | `API_URL` no `.env` |

## NÃO alterar

- **A separação `apps/` + `packages/`** — é a base da estrutura;
- **As camadas `domain` / `data` / `presentation`** dentro de cada feature;
- **A direção das dependências** entre camadas (ver `AGENTS.md`);
- **`lib/core.dart` / `lib/design_system.dart` / `lib/network.dart`** como API pública de cada package (o `src/` é interno);
- O **multi-stage do `Dockerfile`** (build Flutter → runtime nginx).

## Links

- [Melos](https://melos.invertase.dev)
- [Riverpod](https://riverpod.dev)
- [go_router](https://pub.dev/packages/go_router)
- [Flutter Web — build e deploy](https://docs.flutter.dev/platform-integration/web/building)
- [`--dart-define-from-file`](https://docs.flutter.dev/deployment/flavors)
- [Imagem Flutter para CI/Docker](https://github.com/cirruslabs/docker-images-flutter)
