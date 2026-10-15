# INSTALL

Guia do que **configurar** (e do que **não** alterar) ao usar a estrutura `React_Javascript`.

## Pré-requisitos

| Ferramenta | Versão | Para quê |
| --- | --- | --- |
| Node.js | `>= 20.19` | runtime e build |
| pnpm | `>= 9` | workspaces do monorepo |
| Docker | `>= 24` | build/serve da imagem |

Sem pnpm instalado? Ative via Corepack (incluso no Node):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Configuração

1. **Instale e linke o workspace**

   ```bash
   pnpm install
   ```

   O pnpm cria os symlinks de `packages/*` dentro de `node_modules`, permitindo que os apps importem os packages pelo escopo (`@front-reusable/design-system`).

2. **Configure o ambiente do app**

   ```bash
   cp apps/app-example/.env.example apps/app-example/.env
   ```

3. **Rode em modo dev**

   ```bash
   pnpm --filter app-example dev
   ```

4. **Gere o build de produção**

   ```bash
   pnpm build
   # saída em apps/app-example/dist
   ```

5. **(Opcional) Suba via Docker**

   ```bash
   docker build -t front-reusable-react .
   docker run --rm -p 8080:80 front-reusable-react
   ```

## Variáveis de ambiente

No Vite, **apenas variáveis com o prefixo `VITE_`** chegam ao código do cliente, via `import.meta.env`. Elas são **injetadas no build**, não lidas em runtime.

| Variável | Descrição | Obrigatória |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API consumida pelo app | sim |
| `VITE_APP_ENV` | ambiente (`development`, `staging`, `production`) | não |

Para injetar no build do Docker, passe como build arg:

```bash
docker build --build-arg VITE_API_URL=https://api.exemplo.com -t app .
```

> ⚠️ Tudo que começa com `VITE_` é **público** no bundle final. Nunca coloque segredos (chaves privadas, tokens de serviço) em variáveis do app.

## Renomear / ajustar

Ao adotar a estrutura, ajuste:

| O que | Onde |
| --- | --- |
| Nome do app | pasta `apps/app-example` → `apps/<seu-app>` |
| Nome do package do app | `name:` em `apps/<seu-app>/package.json` |
| Filtros de script | referências a `app-example` no `package.json` (raiz) e no `Dockerfile` |
| Nome exibido / título | `apps/<seu-app>/index.html` |
| Escopo dos packages | `@front-reusable/*` nos `package.json` (packages e apps) |
| Pacotes incluídos | `pnpm-workspace.yaml` |
| URL da API | `VITE_API_URL` no `.env` do app |

## NÃO alterar

- **A separação `apps/` + `packages/`** — é a base da estrutura;
- **As camadas `domain` / `data` / `presentation`** dentro de cada feature;
- **A direção das dependências** entre camadas (ver `AGENTS.md`);
- **O `src/index.js` de cada package** como API pública (o resto é interno);
- O **multi-stage do `Dockerfile`** (build Node → runtime nginx);
- O **`vite.config.js`** sem necessidade: o alias do `@` e o proxy já estão configurados.

## Links

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Vite](https://vite.dev/guide/)
- [React](https://react.dev)
- [Zustand](https://zustand.docs.pmnd.rs)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Modos e variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
