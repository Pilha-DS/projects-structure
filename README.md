# Projects Structures

Coleção de **estruturas e padrões de projeto** para o desenvolvimento de software assistido por IA — reunindo regras, modelos de diretórios, convenções de código e fluxos de trabalho prontos para serem reutilizados em novos projetos.

## Sobre

Este projeto nasceu da necessidade de padronizar a forma como desenvolvemos software, principalmente quando o código é escrito com o apoio de IA (agentes, assistentes de código, etc.).

Ao definir de antemão **regras**, **modelos**, **diretórios** e **convenções**, conseguimos:

- Reduzir o tempo gasto decidindo "como começar" cada projeto;
- Manter consistência entre projetos e entre times;
- Dar contexto claro e previsível para a IA, gerando respostas mais assertivas;
- Facilitar onboarding, manutenção e evolução do código.

Cada estrutura documentada aqui funciona como um **ponto de partida** — um esqueleto de organização que você adapta ao problema em questão.

## Como usar este repositório

1. Decida **como o projeto se organiza** — uma estrutura só ou uma combinação delas (veja [Estruturas de projetos](#estruturas-de-projetos)).
2. Escolha as **estruturas** de cada parte (veja [Tipos de estruturas](#tipos-de-estruturas)).
3. Leia as **vantagens**, **desvantagens** e **quando usar** de cada uma.
4. Siga as **regras e convenções** definidas para a estrutura escolhida.
5. Reaproveite o **modelo de diretórios** em `structures/` como base do novo projeto, ajustando conforme necessário.

> 📌 Este repositório está em **desenvolvimento**. As estruturas abaixo já têm seus diretórios criados em `structures/`, mas o conteúdo está sendo definido e detalhado aos poucos.

## Tipos de estruturas

Existem várias formas de organizar um software, e cada uma atende melhor a um tipo de contexto. As estruturas estão agrupadas em **Frontend** e **API**, pois são coisas distintas: uma cuida da interface e da experiência do usuário, a outra cuida das regras de negócio e dos dados.

> 🧩 Aqui cada item é uma **estrutura** — o esqueleto de *uma parte* do software. Para como essas partes se combinam em um projeto inteiro, veja [Estruturas de projetos](#estruturas-de-projetos).

| Grupo | Estrutura | Diretório |
| --- | --- | --- |
| Frontend | [Frontend comum](#frontend-comum) | [`structures/Frontend/Front-Macro`](structures/Frontend/Front-Macro) |
| Frontend | [Frontend com package reutilizável](#frontend-com-package-reutilizável) | [`structures/Frontend/Front-Reusable`](structures/Frontend/Front-Reusable) |
| API | [API comum (sem microsserviços)](#api-comum-sem-microsserviços) | [`structures/API/API-Macro`](structures/API/API-Macro) |
| API | [API com microsserviços](#api-com-microsserviços) | [`structures/API/API-Micro`](structures/API/API-Micro) |
| API | [Multi-API](#multi-api) | [`structures/API/API-Multi-Macro`](structures/API/API-Multi-Macro) · [`structures/API/API-Multi-Micro`](structures/API/API-Multi-Micro) |
| Padrão | [MVC](#mvc) | [`structures/MVC`](structures/MVC) |

---

### Frontend

Estruturas voltadas para a camada de **interface**, responsável por apresentar dados, capturar interações do usuário e conversar com a API.

#### Frontend comum

> 📁 `structures/Frontend/Front-Macro`

Aplicação de interface única, com o código do projeto concentrado em si mesmo — sem compartilhar componentes ou lógica com outros projetos.

**Vantagens**

- Começo simples: uma base de código, um escopo bem definido;
- Sem overhead de versionamento de pacotes internos;
- Fácil de entender e manter por um time pequeno;
- Ideal para produtos isolados ou protótipos.

**Desvantagens**

- Duplicação de componentes e lógica quando há outros fronts;
- Correções e melhorias precisam ser replicadas manualmente;
- Consistência visual depende de disciplina do time;
- Escalar para vários produtos tende a virar retrabalho.

**Quando usar**

- Quando existe apenas um front no ecossistema;
- Quando o produto é isolado e não compartilha UI com outros;
- Em MVPs e projetos cujo escopo ainda não aponta necessidade de reuso.

#### Frontend com package reutilizável

> 📁 `structures/Frontend/Front-Reusable`

Aplicação de interface que consome **pacotes internos reutilizáveis** (design system, componentes, hooks, utilitários, tipos compartilhados) publicados e versionados à parte.

**Vantagens**

- Reuso real de componentes e lógica entre múltiplos fronts;
- Consistência visual e de comportamento entre produtos;
- Correções em um ponto refletem em todos os consumidores;
- Pacotes evoluem com versionamento próprio e independente.

**Desvantagens**

- Exige infraestrutura de publicação/versionamento de pacotes;
- Complica o setup local e o ciclo de desenvolvimento;
- Requer governança para evitar breaking changes;
- Pode ser complexo demais para um único front.

**Quando usar**

- Quando há mais de um front compartilhando UI ou lógica;
- Quando se quer padronizar design e comportamento entre produtos;
- Quando o time já tem maturidade em monorepo/pacotes internos.

---

### API

Estruturas voltadas para o **servidor**, responsável por expor dados, aplicar regras de negócio e atender clientes (front, mobile, integrações e terceiros).

#### API comum (sem microsserviços)

> 📁 `structures/API/API-Macro`

Aplicação **server-side única** (monolito) exposta como serviço, sem interface de usuário própria e sem divisão em serviços independentes.

**Vantagens**

- Foco exclusivo em regras de negócio e dados;
- Uma base de código só: mais simples de desenvolver, testar e implantar;
- Transações e consistência de dados mais fáceis de garantir;
- Reutilizável por qualquer cliente compatível (web, mobile, terceiros).

**Desvantagens**

- Escala de forma global: um gargalo afeta toda a aplicação;
- Deploy único: qualquer mudança exige subir o todo;
- Acoplamento tende a crescer com o tamanho da base;
- Sem UI, não entrega valor sozinha ao usuário final.

**Quando usar**

- Quando o produto é o próprio serviço/integração;
- Como backend de um ou mais fronts e/ou aplicativos;
- Quando o domínio ainda é pequeno ou o time é enxuto.

#### API com microsserviços

> 📁 `structures/API/API-Micro`

Conjunto de **serviços independentes**, cada um responsável por um domínio, comunicando-se por rede e implantados separadamente.

> 🔎 Não confundir com **[Multi-API](#multi-api)**: microsserviços dividem por **domínio de negócio**; multi-API divide por **finalidade/responsabilidade**. Veja a [comparação](#multi-api-x-microsserviços).

**Vantagens**

- Escala e implanta cada serviço de forma independente;
- Times podem ser donos de serviços e evoluir em paralelo;
- Isolamento de falhas: um serviço fora do ar não derruba os demais;
- Permite escolher tecnologia conforme a necessidade de cada serviço.

**Desvantagens**

- Complexidade operacional alta (deploy, observabilidade, rede);
- Consistência de dados distribuída: sem transações simples;
- Exige autenticação, versionamento e contratos bem definidos;
- Necessita de maturidade de time e infraestrutura.

**Quando usar**

- Quando domínios bem separados precisam escalar de forma distinta;
- Quando múltiplos times trabalham no mesmo produto;
- Quando há infraestrutura e processos para sustentar operação distribuída.

#### Multi-API

> 📁 `structures/API/API-Multi-Macro` · `structures/API/API-Multi-Micro`

Em vez de uma API única que atende a tudo, existem **várias APIs separadas por finalidade**, cada uma cuidando de um conjunto de responsabilidades bem distinto. Por exemplo: uma API para a **aplicação em si**, uma para **auditoria**, uma para **segurança** e assim por diante.

A multi-API tem duas variantes, conforme o modo como **cada API individualmente** é construída:

| Variante | Diretório | O que é |
| --- | --- | --- |
| **Multi-API macro** | [`structures/API/API-Multi-Macro`](structures/API/API-Multi-Macro) | Várias APIs separadas por finalidade, cada uma um **monolito** |
| **Multi-API micro** | [`structures/API/API-Multi-Micro`](structures/API/API-Multi-Micro) | Várias APIs separadas por finalidade, cada uma composta por **microsserviços** |

> 💡 **Nome:** o padrão não tem um nome único consolidado no mercado. Aparece como *Multi-API*, *arquitetura multi-API* ou *API por domínio de responsabilidade*. O importante é a ideia: **separar a API pela finalidade que ela serve**, e não pela entidade que ela manipula.

**Vantagens**

- Cada API evolui, escala e é implantada de forma independente;
- Isolamento maior: uma falha na API de auditoria não afeta a da aplicação;
- Superfícies distintas, com autenticação, limites de acesso e políticas próprias;
- Domínios sensíveis (segurança, auditoria) podem ter regras mais rígidas que o restante;
- Times podem ser donos de APIs específicas e trabalhar em paralelo.

**Desvantagens**

- Mais bases de código e mais contratos para manter e versionar;
- Requer orquestração: quem chama quem, e como o front lida com várias APIs;
- Consistência de dados entre APIs fica mais difícil de garantir;
- Aumenta a complexidade de observabilidade, deploy e autenticação;
- Risco de sobreposição de responsabilidades se as fronteiras não forem bem definidas.

**Quando usar**

- Quando existem responsabilidades claramente distintas (aplicação, auditoria, segurança, integrações, notificações);
- Quando a API de segurança/auditoria precisa de mais rigor que a API do produto;
- Quando se quer isolar o tráfego e a escala de cada finalidade;
- Quando o ecossistema cresceu o suficiente para uma API única virar gargalo.

##### Multi-API x microsserviços

São ideias próximas — ambas dividem o back-end em partes independentes — mas o **critério de divisão é diferente**, e essa é a distinção que importa:

| | **API com microsserviços** | **Multi-API** |
| --- | --- | --- |
| **Critério de divisão** | Por **domínio de negócio** | Por **finalidade / responsabilidade** |
| **Pergunta que responde** | "Qual parte do negócio isso resolve?" | "Para que serve essa API?" |
| **Exemplos** | Pedidos, pagamentos, clientes, catálogo | Aplicação, auditoria, segurança, notificações |
| **O que cada parte isola** | Um domínio de negócio | Uma responsabilidade transversal |
| **Foco principal** | Escala e autonomia do domínio | Segregação de acesso, rigor e políticas |

Na prática:

- **Microsserviços** dividem o produto em fatias de negócio. Cada serviço é dono dos dados e das regras daquele domínio (ex.: `pedidos`, `pagamentos`). A divisão é **horizontal ao negócio**.
- **Multi-API** divide o sistema por **finalidade**. A API principal cuida da aplicação, e APIs separadas cuidam de assuntos que têm requisitos próprios — auditoria (imutabilidade, retenção), segurança (acesso restrito, políticas rígidas), notificações etc. A divisão é **por tipo de responsabilidade**, mesmo que todas lidem com o mesmo negócio.

Exemplo combinado: num e-commerce, os **microsserviços** seriam `pedidos`, `pagamentos` e `catálogo`; a **multi-API** adicionaria, ao lado, uma `API de auditoria` (que registra tudo que acontece, seja qual for o domínio) e uma `API de segurança` (que centraliza autenticação, permissões e detecção de fraude).

Nada impede usar os dois juntos: uma multi-API onde **cada API internamente é um conjunto de microsserviços**. São camadas de divisão complementares, não concorrentes.

---

### MVC

> 📁 `structures/MVC`

Padrão de arquitetura que separa a aplicação em três camadas: **Model** (dados e regras de negócio), **View** (apresentação) e **Controller** (intermediação entre entrada, model e view). É um padrão **transversal**, aplicável tanto ao frontend quanto à API.

**Vantagens**

- Separação de responsabilidades clara e amplamente conhecida;
- Facilita manutenção e testes por camada;
- Boa integração com a maioria dos frameworks web;
- Curva de aprendizado baixa para quem já conhece o padrão.

**Desvantagens**

- Pode ficar confuso em aplicações muito grandes ou com muitas regras;
- Risco de "controllers gordos" concentrando lógica de negócio;
- Nem sempre é o encaixe ideal para apps fortemente orientados a eventos ou SPA.

**Quando usar**

- Aplicações web tradicionais com renderização no servidor;
- Projetos que se beneficiam de um padrão de camadas bem conhecido;
- Quando se quer um começo simples e organizado.

---

## Estruturas de projetos

Os itens anteriores são **estruturas**: o esqueleto de *uma parte* do software (um front, uma API, um padrão). Esta seção trata do nível acima — **como um projeto inteiro se organiza**, ou seja, como essas estruturas se combinam dentro de um mesmo projeto.

> 🧩 **Resumindo:** uma *estrutura* é uma peça; uma *estrutura de projeto* é como as peças são montadas.

Um projeto pode ser tão simples quanto uma estrutura única, ou reunir várias — front, uma ou mais APIs, packages compartilhados — convivendo no mesmo lugar, com fronteiras claras entre elas.

| Estrutura de projeto | Composição |
| --- | --- |
| [Projeto único](#projeto-único) | Uma única estrutura (só front, só API, ou MVC) |
| [Projeto com aplicação](#projeto-com-aplicação-front--api) | Uma aplicação com front + API(s) dentro |
| [Projeto multi-aplicação](#projeto-multi-aplicação) | Várias aplicações, compartilhando packages |

### Projeto único

Um projeto com **uma única estrutura**. O caso mais simples: o produto é uma coisa só.

| Composição | Estrutura usada |
| --- | --- |
| Só um front | [Frontend comum](#frontend-comum) ou [com package reutilizável](#frontend-com-package-reutilizável) |
| Só uma API | [API comum](#api-comum-sem-microsserviços), [com microsserviços](#api-com-microsserviços) ou [Multi-API](#multi-api) |
| Um app com MVC | [MVC](#mvc) |

**Quando usar**

- Quando o produto é uma entrega única (um site, um serviço, um painel);
- Quando não há necessidade de separar partes em projetos distintos;
- Em protótipos e MVPs.

### Projeto com aplicação (front + API)

Um projeto guarda-chuva em que a **aplicação** reúne o front e a(s) API(s) dentro dela. É o caso mais comum quando interface e servidor são desenvolvidos juntos, mas continuam sendo coisas distintas.

```text
my-project/
└── application/                # a aplicação em si
    ├── APIs/                   # as APIs (uma ou várias — ver Multi-API)
    └── Front/                  # tudo do frontend
        ├── Front_x/            # um front (x = nome, ex.: Front_Admin)
        └── Package/            # pacotes reutilizáveis do front
```

**Pastas**

| Diretório | O que é |
| --- | --- |
| `application/` | Raiz da aplicação — contém as APIs e o front |
| `APIs/` | Uma ou mais APIs (quando houver várias, ver [Multi-API](#multi-api)) |
| `Front/` | Agrupa tudo do frontend: os fronts e os packages |
| `Front/Front_x/` | Cada front fica em uma pasta `Front_x` própria |
| `Front/Package/` | Pacotes reutilizáveis consumidos pelo front (ver [package reutilizável](#frontend-com-package-reutilizável)) |

**Quando usar**

- Quando um mesmo produto tem interface e servidor e se quer mantê-los no mesmo projeto;
- Quando front e API são versionados e entregues juntos;
- Quando o time é pequeno e prefere um único repositório.

**Variantes**

- Front + **API comum** → aplicação com um back-end monolítico;
- Front + **Multi-API** → aplicação com APIs separadas por finalidade (aplicação, auditoria, segurança).

### Projeto multi-aplicação

Um projeto que contém **várias aplicações**, cada uma com seu front e/ou API, compartilhando código por meio de packages internos.

```text
my-project/
└── applications/               # cada aplicação segue o padrão da seção anterior
    ├── app_1/
    │   ├── APIs/
    │   └── Front/
    │       ├── Front_x/
    │       └── Package/
    └── app_2/
        └── ...
```

**Quando usar**

- Quando há mais de um produto/app que compartilha UI ou lógica;
- Quando se quer um único repositório para vários fronts/APIs;
- Quando o time já tem maturidade em monorepo/pacotes internos.

> 🚧 Estas composições estão sendo definidas. Novas variações (e os ajustes de cada uma) serão adicionadas aos poucos — nenhum diretório de projeto foi criado ainda.

## Regras e convenções

Além das estruturas, este repositório também reúne as **regras e convenções** que guiam o desenvolvimento assistido por IA:

- Convenções de nomes para arquivos, pastas e código;
- Organização de diretórios padrão por estrutura;
- **Docker pré-configurado** em toda estrutura (`Dockerfile` pronto para construir a imagem);
- **`INSTALL.md`** em toda estrutura, dizendo o que configurar e o que não alterar;
- **`AGENTS.md`** em toda estrutura, com as regras de IA daquela estrutura;
- Padrões de commits e versionamento;
- Diretrizes de documentação e comentários;

Cada estrutura terá **três arquivos de documentação**, com papéis distintos:

| Arquivo | Responde |
| --- | --- |
| `README.md` | O que a estrutura é e quando usar |
| `INSTALL.md` | O que configurar (e o que não alterar) |
| `AGENTS.md` | Como a IA deve se comportar dentro da estrutura |

> 📄 As regras detalhadas para criar e manter estruturas estão no [`AGENTS.md`](AGENTS.md). Essas seções serão detalhadas conforme as estruturas forem sendo desenvolvidas.

## Status

🚧 **Em desenvolvimento.**

Estruturas e regras estão sendo definidas e serão implementadas aos poucos. Os diretórios já existem em `structures/`, mas ainda estão vazios. Este README serve como **índice e referência** do que está planejado.

As **estruturas de projetos** (como as peças se combinam) também estão em definição e ainda não têm diretórios próprios.

### Árvore atual

```
structures/
├── API/
│   ├── API-Macro          # API comum (monolito)
│   ├── API-Micro          # API com microsserviços
│   ├── API-Multi-Macro    # Multi-API, cada uma monolito
│   └── API-Multi-Micro    # Multi-API, cada uma em microsserviços
├── Frontend/
│   ├── Front-Macro        # Frontend comum
│   └── Front-Reusable     # Frontend com package reutilizável
└── MVC/                   # Padrão MVC
```

## Contribuindo

Sugestões, correções e melhorias são bem-vindas. Abra uma *issue* ou envie um *pull request* descrevendo a proposta.

## Licença

Distribuído sob a licença **GNU General Public License v3.0**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
