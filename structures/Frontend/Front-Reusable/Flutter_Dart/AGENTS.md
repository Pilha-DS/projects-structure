# AGENTS.md — Flutter_Dart

Regras para o agente **dentro desta estrutura**. Não repete as regras do [AGENTS.md](../../../../AGENTS.md) da raiz — apenas especializa.

## Escopo

Monorepo Flutter Web com `apps/` (aplicações) e `packages/` (bibliotecas internas), orquestrado pelo Melos.

## Antes de começar

1. Leia o [`README.md`](README.md) desta estrutura;
2. Leia o [`INSTALL.md`](INSTALL.md) para setup e variáveis;
3. Confirme a árvore real com um `ls` antes de assumir caminhos.

## Regras de código

- **Dart** segue `flutter_lints`; nomes de arquivos em `snake_case`;
- Um **package interno por responsabilidade** (`core`, `design_system`, `network`) — nunca por tela;
- Camadas por feature: `domain` → `data` → `presentation`;
  - `presentation` **não** importa `data` direto: use os contratos de `domain`;
- Estado sempre com **Riverpod** (`Provider`, `Notifier`, `AsyncNotifier`);
- `analysis_options.yaml` da raiz vale para todo o workspace;
- Sem `print` — use logging;
- Antes de finalizar: `melos exec -- dart analyze` e testes.

## Fronteiras

- **Pode** alterar: `apps/<app>/lib/`, `packages/<pkg>/lib/`, `test/`, `melos.yaml`, `pubspec.yaml`;
- **Não** altere a direção das dependências entre camadas nem packages;
- **Não** crie dependência de um package para um app (a seta é sempre app → package);
- **Não** exponha `src/` — só o arquivo público (`core.dart`, `design_system.dart`, `network.dart`);
- **Não** crie um package novo sem que **dois ou mais apps** precisem dele.

## Fluxo de trabalho

1. Nova funcionalidade → nova pasta em `apps/<app>/lib/features/<feature>/`;
2. Crie `domain` primeiro (entidade + contrato + use case), depois `data`, depois `presentation`;
3. Widget reutilizável em 2+ lugares → mova para `packages/design_system`;
4. Após mudar `pubspec.yaml` ou `melos.yaml`, rode `melos bootstrap`;
5. Build de web: `melos run build:web`.

## Proibido

- Lógica de negócio em `presentation` (vai para `domain`);
- Chamada HTTP direta em widget — passe pelo repositório;
- Import entre features diferentes;
- `pubspec_overrides.yaml` versionado (é gerado pelo Melos);
- `flutter create` sobrescrevendo o monorepo sem checar o que já existe.

## Checklist

- [ ] `melos bootstrap` sem erro;
- [ ] `melos exec -- dart analyze` limpo;
- [ ] Testes passando;
- [ ] Camadas e dependências respeitadas;
- [ ] Nenhum `print`, segredo ou `.env` versionado.
