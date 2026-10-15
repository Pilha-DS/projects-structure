# [AGENTS.md](http://AGENTS.md)

Regras para agentes de IA (e pessoas) que trabalham neste repositório. O objetivo é manter as **estruturas** consistentes, previsíveis e fáceis de reutilizar.

> Este arquivo define **como criar e manter estruturas**. Ele não implementa as estruturas em si — veja o `[README.md](README.md)` para a lista do que existe e está planejado.

## 1. O que é uma "estrutura"

Uma **estrutura** é um modelo de organização de projeto: um esqueleto de diretórios, regras, convenções e arquivos-base que servem de ponto de partida para um novo software.

Cada estrutura deve ser:

- **Autocontida** — tudo que define aquela estrutura vive dentro da sua pasta;
- **Documentada** — precisa de um `README.md` próprio explicando quando e como usar;
- **Reutilizável** — feita para ser copiada/adaptada, não para ser um projeto real;
- **Sem código de negócio** — apenas estrutura, convenções e exemplos genéricos.

## 2. Onde as estruturas ficam

Toda estrutura vive dentro de `structures/`, agrupada pela **área** a que pertence:

```
structures/
├── Frontend/     # estruturas de interface
├── API/          # estruturas de servidor
└── MVC/          # padrões transversais
```

Regras:

- Cada estrutura é **uma pasta própria** dentro da sua área;
- Não criar estruturas na raiz do repositório;
- Não misturar estruturas de áreas diferentes na mesma pasta;
- O nome da área é o **domínio** da estrutura (`Frontend`, `API`), não a tecnologia.

## 3. Nomenclatura

Formato do nome da pasta:

```
<Prefixo>-<Variante>
```

- **Prefixo** — identifica a área: `Front` (Frontend), `API` (API). Padrões transversais usam apenas o nome (ex.: `MVC`);
- **Variante** — identifica a forma de organização daquela estrutura;
- Use **PascalCase com hífen** (`Front-Macro`, `API-Multi-Micro`);
- Nada de espaços, acentos ou underscore.

Variantes em uso (mantenha este vocabulário consistente):


| Termo      | Significado                                                 |
| ---------- | ----------------------------------------------------------- |
| `Macro`    | Monolito — aplicação única, sem divisão em serviços         |
| `Micro`    | Microsserviços — dividida em serviços independentes         |
| `Multi`    | Várias aplicações separadas por finalidade/responsabilidade |
| `Reusable` | Consome pacotes internos reutilizáveis                      |


Combinadores podem ser empilhados, do mais amplo ao mais específico: `API-Multi-Micro` = API (área) + Multi (várias por finalidade) + Micro (cada uma em microsserviços).

## 4. Conteúdo obrigatório de uma estrutura

Ao criar a pasta de uma estrutura, ela deve conter, no mínimo:


| Item                    | Obrigatório | Descrição                                                   |
| ----------------------- | ----------- | ----------------------------------------------------------- |
| `README.md`             | ✅           | Documentação da estrutura (ver formato na seção 7)          |
| `INSTALL.md`            | ✅           | O que configurar (ou não) ao usar a estrutura (ver seção 6) |
| Estrutura de diretórios | ✅           | O esqueleto de pastas/arquivos proposto                     |
| `AGENTS.md`             | ✅           | Regras de IA daquela estrutura (ver formato na seção 8)     |
| Docker pré-configurado  | ✅           | `Dockerfile` pronto para construir a imagem (ver seção 5)   |
| `.gitignore`            | ✅           | Adaptado à stack (se aplicável)                             |
| Arquivos-base           | ⚪           | Configs, exemplos genéricos, templates                      |


Regras:

- **Não** colocar código de aplicação real (domínio, features) — apenas o esqueleto;
- Nomes de pastas/arquivos em **inglês**, minúsculo e `kebab-case` (ex.: `src/`, `app/`, `use-cases/`);
- Arquivos de documentação podem ser em **português**;
- Se a estrutura tiver variantes com regras próprias, crie um `AGENTS.md` em cada uma.

## 5. Docker pré-configurado

Toda estrutura deve vir com um `**Dockerfile` pronto**, para que quem parte dela consiga construir e rodar sem configurar dependências manualmente.

> ℹ️ **Não** é exigido `compose.yaml`. Se a estrutura precisar de mais de um serviço, o `INSTALL.md` (seção 6) deve explicar o que subir e como.

O que cada estrutura deve fornecer:


| Arquivo         | Quando                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| `Dockerfile`    | Sempre — imagem da aplicação                                            |
| `.dockerignore` | Sempre — evita copiar `node_modules`, `dist`, `.git` etc. para a imagem |
| `.env.example`  | Quando houver variáveis de ambiente                                     |


Regras:

- O `Dockerfile` deve ser **genérico** — sem segredos, sem valores de um projeto específico;
- Usar **build multi-stage** quando fizer sentido (build e runtime separados);
- Preferir **imagens oficiais e leves** (`alpine`, `slim`);
- Usar `**.env.example**` para documentar variáveis (nunca commitar `.env` real ou segredos);
- O `INSTALL.md` e o `README.md` devem explicar **como construir e rodar** a imagem;
- Se houver mais de um serviço, documentar cada um no `INSTALL.md` em vez de criar `compose`.

Exemplo-base esperado (adapte à stack, mas mantenha o padrão):

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# --- build ---
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime ---
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```
# .env.example
DATABASE_URL=postgres://app:app@localhost:5432/app
```

## 6. `INSTALL.md` — o que configurar

Toda estrutura deve ter um `**INSTALL.md**`: um guia curto, para **IA ou humano**, dizendo exatamente **o que precisa ser configurado** ao adotar aquela estrutura — e o que **não** precisa (ou **não** deve) ser alterado.

É o arquivo que responde: *"copiei a estrutura, e agora?"*

Deve cobrir, quando aplicável:


| Item                      | Exemplo                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Nome do projeto**       | onde trocar `my-app` pelo nome real (arquivos, `package.json`, `README`)  |
| **Nomes de diretórios**   | quais pastas renomear e quais **não** renomear (fazem parte da estrutura) |
| **Variáveis de ambiente** | o que preencher no `.env` a partir do `.env.example`                      |
| **Links**                 | repositório, documentação, endpoints, dashboards, imagens Docker          |
| **Dependências**          | o que instalar antes de rodar (runtime, gerenciador de pacotes)           |
| **Banco de dados**        | como criar/aplicar migrations, seed, dados iniciais                       |
| **O que NÃO configurar**  | partes que devem ficar como estão para preservar a estrutura              |


Formato sugerido:

```markdown
# INSTALL

## Pré-requisitos
<o que precisa estar instalado>

## Configuração
1. <passo>
2. <passo>

## Variáveis de ambiente
| Variável | Descrição | Obrigatória |
| --- | --- | --- |

## Renomear / ajustar
<o que trocar (nomes, diretórios, links)>

## NÃO alterar
<o que deve permanecer como está>

## Links
<referências úteis>
```

Regras:

- Deve ser **objetivo e acionável** — passos, não teoria;
- Deve deixar explícito **o que NÃO mexer** (é o que evita quebrar a estrutura);
- Deve listar **links** relevantes para não exigir descoberta manual;
- Sem duplicar o `README.md`: aqui é **como instalar/configurar**, não *o que a estrutura é*.

## 7. Formato do `README.md` de cada estrutura

Todo `README.md` de estrutura deve seguir esta ordem:

```markdown
# <Nome da estrutura>

## O que é
<descrição curta e objetiva>

## Quando usar
<contextos em que faz sentido>

## Quando NÃO usar
<contextos em que é exagero ou prejudica>

## Estrutura de diretórios
<árvore de pastas/arquivos proposta, comentada>

## Convenções
<regras de nomes, camadas, fluxos>

## Vantagens / Desvantagens
<trade-offs honestos>

## Como rodar
<comandos de Docker para construir/rodar; detalhes de configuração ficam no INSTALL.md>

## Exemplo de uso
<como partir desta estrutura em um projeto novo>
```

Regras:

- Toda estrutura segue **o mesmo formato**, para permitir comparação entre elas;
- A árvore de diretórios deve ser **comentada** (um `# comentário` por pasta relevante);
- Vantagens e desvantagens são **obrigatórias** — nada de vender a estrutura como solução universal;
- A seção **"Como rodar"** é obrigatória quando a estrutura tiver Docker (ver seção 5);
- O `README.md` **não** deve virar guia de instalação — isso é papel do `INSTALL.md` (seção 6); aqui, linke para ele;
- Manter o tom direto, sem marketing.

## 8. Formato do `AGENTS.md` de cada estrutura

Cada estrutura tem um `AGENTS.md` próprio, com as regras que valem **dentro dela**. É o arquivo que o agente lê ao trabalhar naquela pasta — e que **viaja junto** quando a estrutura é copiada para um projeto novo.

> 📌 O `AGENTS.md` da estrutura **não repete** as regras deste arquivo (raiz). Ele só **especializa**: convenções de código, fronteiras e fluxo daquela estrutura.

Ordem sugerida:

```markdown
# AGENTS.md — <Estrutura>

## Escopo
<a que se aplica; o que está dentro e fora do escopo>

## Antes de começar
<arquivos a ler nesta estrutura: README.md, INSTALL.md, ...>

## Regras de código
<nomes, camadas, imports, padrões específicos da stack>

## Fronteiras
<o que o agente pode alterar e o que NÃO deve mexer>

## Fluxo de trabalho
<como adicionar uma feature, criar arquivo, rodar, testar>

## Proibido
<o que nunca fazer nesta estrutura>

## Checklist
<verificações antes de considerar pronto>
```

Regras:

- **Curto e acionável** — idealmente **menos de 50 linhas**;
- **Auto-suficiente** — pode ser lido fora deste repositório, pois a estrutura é copiada;
- **Específico** — só o que é próprio daquela estrutura; o que for comum a todas fica na raiz;
- **Sem duplicar** o `README.md` (o que é a estrutura) nem o `INSTALL.md` (como configurar) — aqui são **regras de comportamento do agente**;
- Se a estrutura tiver **variantes** com regras próprias, crie um `AGENTS.md` dentro de cada variante;
- Referenciar a raiz por link quando fizer falta, em vez de copiar.

## 9. Regras para agentes de IA

Ao criar ou alterar estruturas, o agente **deve**:

1. **Perguntar antes de inventar** — se faltar informação sobre uma estrutura, pedir ao usuário em vez de assumir;
2. **Não criar estruturas novas** sem pedido explícito do usuário;
3. **Não implementar** o conteúdo das estruturas enquanto elas estiverem em definição — só a documentação e o esqueleto, se solicitado;
4. **Seguir o vocabulário** da seção 3 (não inventar variantes novas sem alinhamento);
5. **Manter o** `README.md` **raiz sincronizado** — toda estrutura nova ou renomeada precisa ser citada lá (tabela-índice e seção correspondente);
6. **Alterar uma estrutura por vez** e explicar o que mudou;
7. **Respeitar o idioma** — documentação em português, nomes técnicos/arquivos em inglês;
8. **Não duplicar conteúdo** — referenciar outras estruturas por link em vez de copiar regras;
9. **Incluir Docker pré-configurado** em toda estrutura (ver seção 5);
10. **Incluir** `INSTALL.md` em toda estrutura, dizendo o que configurar e o que não alterar (ver seção 6);
11. **Incluir** `AGENTS.md` em toda estrutura, no formato da seção 8.

Ao **criar uma estrutura**, o agente **não deve**:

- Criar pastas vazias sem documentação;
- Criar uma estrutura **sem Docker** pré-configurado;
- Criar uma estrutura **sem** `INSTALL.md`;
- Criar uma estrutura **sem** `AGENTS.md` próprio;
- Deixar `README.md` incompleto ou com placeholders genéricos;
- Misturar responsabilidades de áreas diferentes;
- Introduzir dependências, stacks ou frameworks específicos sem alinhamento.

## 10. Checklist: adicionar uma nova estrutura

- [ ] Confirmar com o usuário que a estrutura deve mesmo ser criada;
- [ ] Definir **área** (`Frontend`, `API`, ...) e **nome** seguindo a seção 3;
- [ ] Criar a pasta em `structures/<Área>/<Prefixo>-<Variante>/`;
- [ ] Escrever o `README.md` no formato da seção 7;
- [ ] Escrever o `INSTALL.md` no formato da seção 6 (o que configurar, o que não alterar, links);
- [ ] Criar o esqueleto de diretórios (comentado no README);
- [ ] Criar o **Docker pré-configurado** (`Dockerfile`, `.dockerignore`, `.env.example` — ver seção 5);
- [ ] Criar o `AGENTS.md` específico da estrutura, no formato da seção 8;
- [ ] Adicionar a estrutura à tabela-índice e à seção do `README.md` raiz;
- [ ] Atualizar a "Árvore atual" na seção **Status** do `README.md` raiz.

## 11. Estado atual

⚠️ As estruturas estão **em definição**. As pastas já existem em `structures/`, mas o conteúdo (README, INSTALL, esqueleto, AGENTS) ainda será desenvolvido.

**Não implementar** as estruturas até que o usuário peça explicitamente. Nesta fase, o trabalho é alinhar **o que cada estrutura é** e **como ela deve ser usada**.