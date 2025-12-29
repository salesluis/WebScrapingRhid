# Automatize RHID

API para automatização de obtenção de senhas de RHID através de web scraping.

## 📋 Descrição

Este projeto é uma API REST que automatiza o processo de obtenção de senhas de RHID através de web scraping. A aplicação recbe dados via URI para que possa ser extraido os dados necessário, foi ultilizado dessa abordagem por conta de uma integração com sistema de terceiros que não lidava bem com requests com dados via payload/body, a aplicação utiliza Puppeteer para navegar em um sistema web terceiro, executa o chromium, bloqueia requisições de fontes, css e assets para performance, faz o login e extrai informações específicas baseadas em parâmetros fornecidos no corpo da requisição.

## 🏗️ System Design

### Arquitetura

O projeto segue uma arquitetura modular baseada em **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── server.ts              # Ponto de entrada da aplicação
├── env.ts                 # Configuração de variáveis de ambiente
├── http/                  # Camada de apresentação
│   ├── routes/           # Definição de rotas
│   └── controller/       # Controladores HTTP
├── services/             # Camada de serviços (lógica de negócio)
└── interface/            # Interfaces e tipos TypeScript
```

### Fluxo de Dados

1. **Requisição HTTP** → `routes/getPassword.ts`
2. **Validação** → `controller/getPasswordController.ts`
3. **Processamento** → `services/scraping.ts`
4. **Resposta** → Cliente

### Módulos e Responsabilidades

#### 🚀 Server (`src/server.ts`)

- **Responsabilidade**: Configuração e inicialização do servidor Fastify
- **Funcionalidades**:
  - Configuração de CORS
  - Registro de rotas
  - Inicialização do servidor na porta configurada

#### 🔧 Environment (`src/env.ts`)

- **Responsabilidade**: Validação e tipagem de variáveis de ambiente
- **Funcionalidades**:
  - Validação com Zod
  - Tipagem TypeScript
  - Valores padrão para configurações

#### 🛣️ Routes (`src/http/routes/getPassword.ts`)

- **Responsabilidade**: Definição de endpoints da API
- **Funcionalidades**:
  - Mapeamento de rotas para controladores
  - Configuração de plugins Fastify

#### 🎮 Controller (`src/http/controller/getPasswordController.ts`)

- **Responsabilidade**: Manipulação de requisições HTTP
- **Funcionalidades**:
  - Validação de dados de entrada
  - Tratamento de erros
  - Orquestração de chamadas para serviços
  - Respostas HTTP padronizadas

#### 🕷️ Service (`src/services/scraping.ts`)

- **Responsabilidade**: Lógica de negócio e web scraping
- **Funcionalidades**:
  - Automação de navegador com Puppeteer
  - Navegação em páginas web
  - Preenchimento de formulários
  - Extração de dados
  - Otimização de performance (bloqueio de recursos desnecessários)

#### 📝 Interface (`src/interface/request.ts`)

- **Responsabilidade**: Definição de tipos TypeScript
- **Funcionalidades**:
  - Tipagem de requisições
  - Contratos de dados

## 🛠️ Tecnologias

- **Runtime**: Node.js com TypeScript
- **Framework**: Fastify (alta performance)
- **Web Scraping**: Puppeteer
- **Validação**: Zod
- **CORS**: @fastify/cors
- **Linting**: Biome
- **TypeScript**: Configuração moderna com ES2022

## 📦 Instalação

1. **Clone o repositório**:

```bash
git clone https://github.com/salesluis/WebScrapingRhid
cd WebScrapingRhid
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
EMAIL=seu-email@exemplo.com
PASSWORD=sua-senha
BASE_URL=https://url-do-sistema.com
ORIGIN_REQUEST=http://localhost:3000
```

## 🚀 Como Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## 📡 API Endpoints

### POST `/rhid`

Obtém a senha de um RHID específico.

**Request QueryString**:

```url
BASE_URL:PORT/rhid?serial={serial}&senha={senha}
```

**Response**:

```json
{
  "contraSenha": "string"
}
```

**Códigos de Status**:

- `200`: Sucesso
- `400`: Dados inválidos ou ausentes
- `500`: Erro interno do servidor

## 🔧 Configuração

### Variáveis de Ambiente

| Variável         | Descrição                   | Obrigatório | Padrão |
| ---------------- | --------------------------- | ----------- | ------ |
| `PORT`           | Porta do servidor           | Não         | 3333   |
| `EMAIL`          | Email para login no sistema | Sim         | -      |
| `PASSWORD`       | Senha para login no sistema | Sim         | -      |
| `BASE_URL`       | URL base do sistema         | Sim         | -      |
| `ORIGIN_REQUEST` | Origem permitida para CORS  | Sim         | -      |

## 🔍 Características Técnicas

### Performance

- **Fastify**: Framework de alta performance
- **Puppeteer Otimizado**: Bloqueio de recursos desnecessários (imagens, CSS, fontes)
- **TypeScript**: Tipagem estática para melhor performance em runtime

### Segurança

- **Validação com Zod**: Validação robusta de entrada
- **CORS Configurado**: Controle de origens permitidas
- **Tratamento de Erros**: Respostas padronizadas sem vazamento de informações

### Manutenibilidade

- **Arquitetura Modular**: Separação clara de responsabilidades
- **TypeScript**: Tipagem estática e melhor DX
- **Biome**: Linting e formatação consistente

## 👨‍💻 Autor

**Luis Felipe Ferreira Sales**

---

## ⚠️ Notas Importantes

- O sistema utiliza web scraping, então pode ser afetado por mudanças na interface do site alvo
- Certifique-se de ter permissão para automatizar o sistema de destino
- O Puppeteer está configurado em modo `headless: false` para debug, considere alterar para produção
