# syntax=docker/dockerfile:1

# ------------------------------------------------------------------ build ---
# Estágio 1: instala o workspace e gera o build estático do app.
FROM node:22-alpine AS build

# pnpm via Corepack (já incluso no Node)
RUN corepack enable

WORKDIR /app

# Copia primeiro os manifestos: melhora o cache de camadas.
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml .npmrc ./
COPY apps/app-example/package.json        apps/app-example/
COPY packages/core/package.json           packages/core/
COPY packages/design-system/package.json  packages/design-system/
COPY packages/network/package.json        packages/network/

RUN pnpm install --frozen-lockfile=false

# Copia o restante do código e gera o build.
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

# ---------------------------------------------------------------- runtime ---
# Estágio 2: serve os arquivos estáticos com nginx.
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/app-example/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
