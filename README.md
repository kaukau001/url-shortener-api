# 🔗 URL Shortener API

> Uma API de encurtamento de URLs desenvolvida com **Node.js**, **Express**, **TypeScript** e **PostgreSQL**.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 **Funcionalidades**

### **🔐 Sistema de Autenticação**
- **Registro de usuários** com validação
- **Login** com JWT tokens
- **Middleware de autenticação**
- **Tokens com expiração** configurável

### **🔗 Encurtamento de URLs**
- **Criação de URLs curtas** com códigos personalizados
- **Redirecionamento automático** para URLs originais
- **Gerenciamento completo** - criar, listar, atualizar, deletar
- **Validação de URLs**
- **URLs privadas** por usuário autenticado

### **📊 Recursos **
- **Documentação interativa** com Swagger UI
- **Logs estruturados** com request IDs para facilitar o trace
- **Validações de entrada** 
- **Tratamento de erros** 
- **Testes automatizados**

---

## 📚 **Documentação da API**

### **🎯 Swagger UI Interativo**
```
http://localhost:3000/api-docs
```

### **📄 OpenAPI JSON**
```
http://localhost:3000/api-docs.json
```

---

## 🏃‍♂️ **Como Rodar o Projeto**

### **📋 Pré-requisitos**
- **Node.js** = 20.0.0
- **Docker** e **Docker Compose**
- **Git**

### **🚀 Instalação Rápida**

#### **1. Clone o repositório**
```bash
git clone https://github.com/yourusername/url-shortener-api.git
cd url-shortener-api
```

#### **2. Configure o ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

#### **3. Inicie os serviços**
```bash
# Subir banco de dados
npm run docker:dev

# Instalar dependências
npm install

# Executar migrações
npm run prisma:migrate
npm run prisma:generate

# Iniciar aplicação
npm run start:express:dev
```

#### **4. Acesse a aplicação**
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### **🐳 Usando Docker (Recomendado)**
```bash
# Ambiente completo de desenvolvimento
npm run dev:full

# Parar serviços
npm run docker:dev:down
```

---

## 🔧 **Scripts Disponíveis**

### **🚀 Desenvolvimento**
```bash
npm run start:express:dev    # Inicia com hot-reload
npm run dev:full            # Ambiente completo (DB + API)
npm run docs:dev            # Alias para desenvolvimento
npm run docs:open           # Abre documentação no browser
```

### **🏗️ Build e Produção**
```bash
npm run build              # Compila TypeScript
npm run start              # Inicia versão compilada
npm run start:prod         # Inicia em modo produção
```

### **🧪 Testes**
```bash
npm test                   # Executa todos os testes
npm run test:unit          # Apenas testes unitários
npm run test:watch         # Modo watch
npm run test:cov           # Com cobertura
```

### **🔍 Qualidade de Código**
```bash
npm run lint               # ESLint com correção
npm run format             # Prettier
npm run format:check       # Verifica formatação
npm run ci:security        # Auditoria de segurança
```

### **🗃️ Banco de Dados**
```bash
npm run prisma:generate    # Gera cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Interface visual do banco
```

### **🐳 Docker**
```bash
npm run docker:dev         # Ambiente de desenvolvimento
npm run docker:prod        # Ambiente de produção
npm run docker:logs        # Visualizar logs
```

---

## ⚙️ **GitHub Actions**

### **🔄 CI/CD Pipeline** (`ci.yml`)
**Executado a cada push/PR nas branches `main` e `develop`**

#### **Jobs:**
1. **🧪 Test Job**
   - Configura PostgreSQL para testes
   - Executa migrações do banco
   - Roda todos os testes unitários
   - Envia cobertura para Codecov
   - Faz build da aplicação

2. **✨ Lint Job**
   - Verifica formatação do código (Prettier)
   - Executa linter (ESLint)

3. **🔒 Security Job**
   - Executa npm audit
   - Usa Snyk para verificar vulnerabilidades

### **🚀 Release Pipeline** (`release.yml`)
**Executado quando uma tag `v*` é criada**

#### **Fluxo:**
1. ✅ **Instala** dependências e gera Prisma client
2. ✅ **Builda** aplicação
3. ✅ **Executa** testes e auditoria de segurança
4. ✅ **Gera** changelog automático
5. ✅ **Cria** release no GitHub
6. ✅ **Builda** imagens Docker

#### **Como fazer um release:**
```bash
# Via GitHub Desktop
1. Vá em Repository → Create Tag
2. Digite: v1.0.0
3. Push da tag

# Via linha de comando
git tag v1.0.0
git push origin v1.0.0
```

### **🔄 Dependency Updates** (`dependency-updates.yml`)
- Atualiza dependências automaticamente
- Cria PRs com atualizações de segurança

---

## 📁 **Estrutura do Projeto**

```
src/
├── app-express.ts          # Configuração do Express
├── main-express.ts         # Entry point da aplicação
├── app/
│   ├── controller/         # Controllers REST com Swagger
│   │   ├── auth.controller.ts
│   │   ├── url.controller.ts
│   │   └── healthcheck.controller.ts
│   ├── service/           # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── url.service.ts
│   │   └── user.service.ts
│   ├── repository/        # Camada de dados (Prisma)
│   │   ├── url/
│   │   └── user/
│   ├── middleware/        # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── request-id.middleware.ts
│   ├── dto/              # Validação de dados
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   └── errors/           # Tratamento de erros
├── swagger/              # Configuração OpenAPI
├── test/                 # Testes automatizados
└── types/               # Tipos compartilhados
```

---

## 🏗️ **Arquitetura**

### **🎯 Princípios de Design**
- **📦 Separação de responsabilidades** - Controllers, Services, Repositories
- **🔒 Segurança por design** - JWT, validação, sanitização
- **📝 Documentação automática** - OpenAPI/Swagger integrado
- **🧪 Testabilidade** - Mocks, injeção de dependência
- **📊 Observabilidade** - Logs estruturados, request tracking

### **🔄 Fluxo de Request**
```
Request → Middleware → Controller → Service → Repository → Database
                ↓
Response ← Error Handler ← Validation ← Business Logic ← Data Layer
```

### **🛠️ Stack Tecnológica**
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker

---
## Features futuras
- Criar uma url customizada sem precisar passar pelo processo de criar e depois atualizar.
- Gerenciamento de usuário (excluir usuário, atualizar informações de email e senha)
- Possibilidade de criar urls com data de expiração

---
## Features futuras
- Criar uma url customizada sem precisar passar pelo processo de criar e depois atualizar.
- Gerenciamento de usuário (excluir usuário, atualizar informações de email e senha)
- Possibilidade de criar urls com data de expiração

---
## Mudanças para escalar horizontalmente
- Cache distribuído com Redis para URLs mais acessadas
- Load balancer para múltiplas instâncias
- Monitoramento de traces e dashboards no Datadog
- Segregação em microsserviços
- Utilizar testes de carga para estimar melhor os recursos

Os maiores desafios seriam:
- Gerenciar sessões entre múltiplas instâncias (JWT ajuda nisso)
- Manter a idempotência
- Pool de conexões do banco
- Logs centralizados
- Deploy coordenado sem downtime e em faixas de horário de baixa intensidade

## 🤝 **Contribuindo**

1. **Fork** o projeto
2. **Crie** uma branch: `git checkout -b feature/amazing-feature`
3. **Commit** suas mudanças: `git commit -m 'feat: add amazing feature'`
4. **Push** para a branch: `git push origin feature/amazing-feature`
5. **Abra** um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

</div>

