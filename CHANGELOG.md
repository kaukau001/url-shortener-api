# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]
### TODO
- Rate limiting para prevenção de spam
- Métricas de performance com Prometheus

## [1.0.0] - 2025-06-27
### Added
- 🚀 **Sistema de autenticação JWT completo**
  - Registro e login de usuários
  - Middleware de autenticação robusto
  - Tokens com expiração configurável
- 🔗 **API de encurtamento de URLs**
  - URLs públicas (sem autenticação)
  - URLs privadas (com autenticação)
  - Códigos personalizados para URLs privadas
  - Contabilização de cliques
- 📊 **Sistema de gerenciamento**
  - CRUD completo para URLs do usuário
  - Paginação e filtros na listagem
  - Soft delete (deleção lógica)
- 📚 **Documentação completa**
  - Swagger/OpenAPI interativo
  - Exemplos práticos de uso
  - Guias de deploy e contribuição
- 🧪 **Testes unitários completos**
  - 90 testes unitários (11 suites)
  - Cobertura de todos os fluxos críticos
  - Mocks para dependências externas
- 🔧 **CI/CD com GitHub Actions**
  - Pipeline de testes automatizados
  - Deploy automático para staging/prod
  - Auditoria de segurança
  - Release automático com tags
- 🐳 **Containerização**
  - Docker para desenvolvimento
  - Docker Compose para ambiente completo
  - Otimização para produção

### Technical Details
- **Stack**: Node.js 20, Express, TypeScript, PostgreSQL, Prisma
- **Arquitetura**: Repository pattern, Service layer, DTO validation
- **Banco**: Migrações Prisma, índices otimizados
- **Segurança**: JWT, validação de entrada, sanitização
- **Observabilidade**: Logs estruturados com request ID

### Breaking Changes
- Migração de NestJS para Express (melhor performance)
- Reestruturação completa da autenticação

## [0.2.0] - 2025-06-26
### Added
- Enum UrlStatus para controle de estado das URLs
- Campo status na tabela short_urls
- Suporte a soft delete

### Changed
- Migração do banco para incluir campo de status

## [0.1.0] - 2025-06-25
### Added
- 🎉 **Primeira versão funcional**
- Estrutura inicial do projeto
- Modelos de banco (Users, URLs)
- API básica de encurtamento
- Sistema de redirecionamento

### Technical Details
- Configuração inicial do Prisma
- Estrutura base do Express
- Middleware de validação básico
