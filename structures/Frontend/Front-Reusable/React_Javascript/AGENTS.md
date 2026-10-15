# AGENTS.md — React_Javascript

Regras para o agente **dentro desta estrutura**. Não repete as regras do [AGENTS.md](../../../../AGENTS.md) da raiz — apenas especializa.

## Escopo

Monorepo JavaScript (React + Vite) com `apps/` (aplicações) e `packages/` (bibliotecas internas), orquestrado pelo pnpm workspaces.

## Antes de começar

1. Leia o [`README.md`](README.md) desta estrutura;
2. Leia o [`INSTALL.md`](INSTALL.md) para setup e variáveis;
3. Confirme a árvore real com um `ls` antes de assumir caminhos.

## Regras de código

- **Nomes em `kebab-case`** (pastas e arquivos); componentes exportados em `PascalCase`;
- Um **package interno por responsabilidade** (`core`, `design-system`, `network`) — nunca por tela;
- Camadas por feature: `domain` → `data` → `presentation`;
  - `presentation` **não** importa `data` direto: use os contratos de `domain`;
- Estado: **Zustand** para o cliente, **TanStack Query** para servidor — nunca duplicar;
- Estilo sempre com **CSS Modules**; cores/espaços vêm dos tokens do `design-system`;
- Sem `console.log` — use o logger do `core`;
- Antes de finalizar: `pnpm lint` e `pnpm test`.

## Fronteiras

- **Pode** alterar: `apps/<app>/src/`, `packages/<pkg>/src/`, `package.json`, `vite.config.js`;
- **Não** altere a direção das dependências entre camadas nem packages;
- **Não** crie dependência de um package para um app (a seta é sempre app → package);
- **Não** exponha arquivos internos — só o `src/index.js` de cada package;
- **Não** crie um package novo sem que **dois ou mais apps** precisem dele;
- **Não** adicione dependência de terceiros sem necessidade clara.

## Fluxo de trabalho

1. Nova funcionalidade → nova pasta em `apps/<app>/src/features/<feature>/`;
2. Crie `domain` primeiro (entidade + contrato), depois `data`, depois `presentation`;
3. Componente/hook reutilizável em 2+ features → `src/shared/`; em 2+ apps → `packages/design-system`;
4. Após mudar dependências, rode `pnpm install`;
5. Build: `pnpm build`.

## Proibido

- Lógica de negócio em `presentation` (vai para `domain`);
- `fetch`/`axios` direto em componente — passe pelo repositório (`network` + `data`);
- Import entre features diferentes;
- Estado de servidor no Zustand (use TanStack Query);
- Cor/espaçamento hardcoded fora dos tokens;
- Segredo em variável `VITE_*` (tudo é público no bundle);
- `npm install` / `yarn` — o gerenciador é o **pnpm**.

## Checklist

- [ ] `pnpm install` sem erro;
- [ ] `pnpm lint` limpo;
- [ ] Testes passando;
- [ ] Camadas e dependências respeitadas;
- [ ] Nenhum `console.log`, segredo ou `.env` versionado.
