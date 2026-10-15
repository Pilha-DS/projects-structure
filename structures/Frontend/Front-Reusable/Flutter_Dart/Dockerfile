# syntax=docker/dockerfile:1

# ------------------------------------------------------------------ build ---
# Estágio 1: compila o Flutter Web (aplicação estática).
FROM ghcr.io/cirruslabs/flutter:stable AS build

WORKDIR /app

# Melos disponível no PATH
ENV PUB_CACHE=/root/.pub-cache
ENV PATH="/root/.pub-cache/bin:${PATH}"
RUN dart pub global activate melos

# Copia o workspace inteiro (.dockerignore já remove lixo e segredos).
COPY . .

# Linka e resolve todos os apps/packages.
RUN melos bootstrap

# Build de produção do app web.
RUN melos run build:web

# ---------------------------------------------------------------- runtime ---
# Estágio 2: serve os arquivos estáticos com nginx.
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/app_example/build/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
