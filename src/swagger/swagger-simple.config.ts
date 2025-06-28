import { Express } from 'express';

// Comprehensive swagger setup for URL Shortener API
export const setupSimpleSwagger = (app: Express): void => {
  // Comprehensive HTML documentation
  app.get('/docs', (req, res) => {
    res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>URL Shortener API - Documentação Completa</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                        line-height: 1.6; 
                        color: #333;
                        background: #f8fafc;
                    }
                    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                    .header { 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white; 
                        text-align: center; 
                        padding: 40px 20px;
                        margin-bottom: 40px;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    }
                    .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
                    .header p { font-size: 1.2rem; opacity: 0.9; }
                    .badges { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
                    .badge { 
                        background: rgba(255,255,255,0.2); 
                        padding: 5px 12px; 
                        border-radius: 20px; 
                        font-size: 0.9rem;
                        backdrop-filter: blur(10px);
                    }
                    .section { 
                        background: white; 
                        margin: 30px 0; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        overflow: hidden;
                    }
                    .section-header { 
                        background: #f8fafc; 
                        padding: 20px; 
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .section-header h2 { 
                        color: #2d3748; 
                        display: flex; 
                        align-items: center; 
                        gap: 10px;
                    }
                    .section-content { padding: 20px; }
                    .endpoint { 
                        margin: 25px 0; 
                        border: 1px solid #e2e8f0; 
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .endpoint-header { 
                        display: flex; 
                        align-items: center; 
                        gap: 15px; 
                        padding: 15px 20px;
                        background: #f7fafc;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .method { 
                        padding: 5px 12px; 
                        border-radius: 6px; 
                        font-weight: bold; 
                        font-size: 0.8rem;
                        min-width: 60px;
                        text-align: center;
                    }
                    .method.POST { background: #48bb78; color: white; }
                    .method.GET { background: #4299e1; color: white; }
                    .method.PATCH { background: #ed8936; color: white; }
                    .method.DELETE { background: #f56565; color: white; }
                    .endpoint-path { 
                        font-family: 'Monaco', 'Consolas', monospace; 
                        font-size: 1.1rem; 
                        color: #2d3748;
                        font-weight: 600;
                    }
                    .endpoint-desc { padding: 20px; }
                    .endpoint-desc h4 { 
                        color: #4a5568; 
                        margin: 15px 0 8px 0; 
                        font-size: 1rem;
                    }
                    .code-block { 
                        background: #1a202c; 
                        color: #e2e8f0; 
                        padding: 15px; 
                        border-radius: 6px; 
                        overflow-x: auto;
                        font-family: 'Monaco', 'Consolas', monospace;
                        font-size: 0.9rem;
                        margin: 10px 0;
                    }
                    .param-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 10px 0;
                    }
                    .param-table th, .param-table td { 
                        padding: 8px 12px; 
                        text-align: left; 
                        border-bottom: 1px solid #e2e8f0;
                        font-size: 0.9rem;
                    }
                    .param-table th { 
                        background: #f7fafc; 
                        font-weight: 600; 
                        color: #4a5568;
                    }
                    .required { color: #e53e3e; font-weight: bold; }
                    .optional { color: #38a169; }
                    .status-codes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
                    .status-code { 
                        padding: 12px; 
                        border-radius: 6px; 
                        border-left: 4px solid;
                    }
                    .status-200 { background: #f0fff4; border-color: #38a169; }
                    .status-201 { background: #f0fff4; border-color: #38a169; }
                    .status-400 { background: #fffaf0; border-color: #ed8936; }
                    .status-401 { background: #fef5e7; border-color: #d69e2e; }
                    .status-403 { background: #fed7d7; border-color: #e53e3e; }
                    .status-404 { background: #fed7d7; border-color: #e53e3e; }
                    .status-409 { background: #fed7d7; border-color: #e53e3e; }
                    .status-500 { background: #faf5ff; border-color: #805ad5; }
                    .toc { 
                        background: white; 
                        padding: 20px; 
                        border-radius: 8px; 
                        margin-bottom: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    }
                    .toc h3 { margin-bottom: 15px; color: #2d3748; }
                    .toc ul { list-style: none; }
                    .toc li { margin: 8px 0; }
                    .toc a { 
                        color: #4299e1; 
                        text-decoration: none; 
                        padding: 5px 0;
                        display: block;
                        border-radius: 4px;
                        padding-left: 10px;
                        transition: all 0.2s;
                    }
                    .toc a:hover { 
                        background: #ebf8ff; 
                        color: #2b6cb0;
                        padding-left: 15px;
                    }
                    .auth-note { 
                        background: #fef5e7; 
                        border-left: 4px solid #d69e2e; 
                        padding: 15px; 
                        margin: 15px 0;
                        border-radius: 0 6px 6px 0;
                    }
                    .example-request { background: #0d1117; color: #e6edf3; }
                    .example-response { background: #0f1419; color: #e6edf3; }
                    .highlight { background: #fff3cd; padding: 2px 4px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚀 URL Shortener API</h1>
                        <p>Documentação Completa da API de Encurtamento de URLs</p>
                        <div class="badges">
                            <span class="badge">v0.4.0</span>
                            <span class="badge">Node.js + Express</span>
                            <span class="badge">TypeScript</span>
                            <span class="badge">PostgreSQL</span>
                            <span class="badge">JWT Auth</span>
                        </div>
                    </div>

                    <div class="toc">
                        <h3>📋 Índice</h3>
                        <ul>
                            <li><a href="#intro">🎯 Introdução</a></li>
                            <li><a href="#auth">🔐 Autenticação</a></li>
                            <li><a href="#endpoints-public">🌐 Endpoints Públicos</a></li>
                            <li><a href="#endpoints-auth">🔒 Endpoints Autenticados</a></li>
                            <li><a href="#errors">⚠️ Códigos de Erro</a></li>
                            <li><a href="#examples">💡 Exemplos Práticos</a></li>
                        </ul>
                    </div>

                    <div class="section" id="intro">
                        <div class="section-header">
                            <h2>🎯 Introdução</h2>
                        </div>
                        <div class="section-content">
                            <p>Esta API permite encurtar URLs de forma simples e eficiente. Você pode usar a API de duas formas:</p>
                            <ul style="margin: 15px 0; padding-left: 20px;">
                                <li><strong>Modo Público:</strong> Encurte URLs sem necessidade de cadastro</li>
                                <li><strong>Modo Autenticado:</strong> Gerencie suas URLs, visualize estatísticas e histórico</li>
                            </ul>
                            <p><strong>Base URL:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">http://localhost:3000</code></p>
                        </div>
                    </div>

                    <div class="section" id="auth">
                        <div class="section-header">
                            <h2>🔐 Autenticação</h2>
                        </div>
                        <div class="section-content">
                            <p>A API utiliza <strong>JWT (JSON Web Tokens)</strong> para autenticação. Para endpoints que requerem autenticação, inclua o token no header:</p>
                            <div class="code-block">Authorization: Bearer seu-jwt-token-aqui</div>
                            <div class="auth-note">
                                <strong>📌 Nota:</strong> Tokens têm validade limitada. Renove-os conforme necessário através do endpoint de login.
                            </div>
                        </div>
                    </div>

                    <div class="section" id="endpoints-public">
                        <div class="section-header">
                            <h2>🌐 Endpoints Públicos</h2>
                        </div>
                        <div class="section-content">
                            
                            <!-- Health Check -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method GET">GET</span>
                                    <span class="endpoint-path">/health</span>
                                    <span>Verificar status da API</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Endpoint para verificar se a API está funcionando corretamente.</p>
                                    <h4>📤 Resposta de Sucesso (200)</h4>
                                    <div class="code-block example-response">{
  "status": "OK",
  "timestamp": "2025-06-27T10:30:00.000Z",
  "requestId": "ee456fa7-8310-4f43-99a1-c7aeaf3ff3da"
}</div>
                                </div>
                            </div>

                            <!-- Register -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method POST">POST</span>
                                    <span class="endpoint-path">/auth/register</span>
                                    <span>Registrar novo usuário</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Cria uma nova conta de usuário no sistema.</p>
                                    <h4>📥 Parâmetros do Body</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>email</td><td>string</td><td class="required">✓</td><td>Email válido do usuário</td></tr>
                                        <tr><td>password</td><td>string</td><td class="required">✓</td><td>Senha (mínimo 6 caracteres)</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (201)</h4>
                                    <div class="code-block example-response">{
    "id": "7e73f64e-5d15-48ea-8c36-952a199f78c6",
    "email": "teste6@hotmail.com"
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-400">
                                            <strong>400 - Bad Request</strong><br>
                                            Email inválido ou senha inválida
                                        </div>
                                        <div class="status-code status-409">
                                            <strong>409 - Conflict</strong><br>
                                            Email já cadastrado no sistema
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Login -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method POST">POST</span>
                                    <span class="endpoint-path">/auth/login</span>
                                    <span>Fazer login</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Autentica um usuário existente e retorna um token JWT.</p>
                                    <h4>📥 Parâmetros do Body</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>email</td><td>string</td><td class="required">✓</td><td>Email do usuário cadastrado</td></tr>
                                        <tr><td>password</td><td>string</td><td class="required">✓</td><td>Senha do usuário</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (200)</h4>
                                    <div class="code-block example-response">{
    "access_token": "Bearer token"
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-400">
                                            <strong>400 - Bad Request</strong><br>
                                            Email ou senha não fornecidos
                                        </div>
                                        <div class="status-code status-401">
                                            <strong>401 - Unauthorized</strong><br>
                                            Email ou senha incorretos
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Shorten URL -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method POST">POST</span>
                                    <span class="endpoint-path">/shorten</span>
                                    <span>Encurtar URL</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Cria uma URL encurtada. Pode ser usado <span class="highlight">com ou sem autenticação</span>.</p>
                                    <h4>📥 Parâmetros do Body</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>originalUrl</td><td>string</td><td class="required">✓</td><td>URL válida para encurtar (deve começar com http/https)</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (201)</h4>
                                    <div class="code-block example-response">{
    "id": "d60ff18c-66f8-4eac-b557-5af8afe30740",
    "code": "O5g_LZ",
    "originalUrl": "https://www.google.com",
    "shortUrl": "http://localhost:3000/O5g_LZ",
    "clicks": 0,
    "status": "ACTIVE",
    "userId": null,
    "createdAt": "2025-06-27T16:37:03.890Z",
    "updatedAt": "2025-06-27T16:37:03.890Z"
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-400">
                                            <strong>400 - Bad Request</strong><br>
                                            URL inválida ou código personalizado já existe
                                        </div>
                                        <div class="status-code status-409">
                                            <strong>409 - Conflict</strong><br>
                                            Código personalizado já está em uso
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Redirect -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method GET">GET</span>
                                    <span class="endpoint-path">/:code</span>
                                    <span>Redirecionar para URL original</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Redireciona automaticamente para a URL original e incrementa o contador de cliques.</p>
                                    <h4>📥 Parâmetros da URL</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>code</td><td>string</td><td class="required">✓</td><td>Código da URL encurtada</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (301)</h4>
                                    <div class="code-block example-response">HTTP/1.1 301 Moved Permanently
Location: https://www.exemplo.com/pagina-muito-longa/com-muitos-parametros?id=123&ref=social</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-404">
                                            <strong>404 - Not Found</strong><br>
                                            Código não encontrado
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section" id="endpoints-auth">
                        <div class="section-header">
                            <h2>🔒 Endpoints Autenticados</h2>
                        </div>
                        <div class="section-content">
                            <div class="auth-note">
                                <strong>🔐 Autenticação Necessária:</strong> Todos os endpoints desta seção requerem o header <code>Authorization: Bearer token</code>
                            </div>

                            <!-- List User URLs -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method GET">GET</span>
                                    <span class="endpoint-path">/user/urls</span>
                                    <span>Listar URLs do usuário</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Lista todas as URLs criadas pelo usuário autenticado com paginação e filtros.</p>
                                    <h4>📥 Parâmetros de Query (opcionais)</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr>
                                        <tr><td>page</td><td>number</td><td>1</td><td>Página atual (mínimo 1)</td></tr>
                                        <tr><td>limit</td><td>number</td><td>10</td><td>Itens por página (1-100)</td></tr>
                                        <tr><td>status</td><td>enum</td><td>all</td><td>Filtrar por status: ACTIVE, DELETED</td></tr>
                                        <tr><td>code</td><td>string</td><td>-</td><td>Buscar pelo código da URL encurtada</td></tr>
                                        <tr><td>id</td><td>string</td><td>-</td><td>Buscar id gerado da entidade</td></tr>
                                        <tr><td>startDate</td><td>ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)</td><td>-</td><td>Buscar a partir de uma data de criação</td></tr>
                                        <tr><td>endDate</td><td>ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)</td><td>-</td><td>Buscar a partir de uma data de final</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (200)</h4>
                                    <div class="code-block example-response">{
    "urls": [
        {
            "id": "0d651bd9-6ed0-4893-9fc9-06ab125d08d2",
            "code": "CngT5A",
            "originalUrl": "https://www.x.com",
            "shortUrl": "http://localhost:3000/CngT5A",
            "clicks": 2,
            "status": "ACTIVE",
            "userId": "f30b52fe-47ec-4ed2-a8ff-056b0a1fdd56",
            "createdAt": "2025-06-27T03:51:49.076Z",
            "updatedAt": "2025-06-27T03:54:14.967Z",
            "deletedAt": "2025-06-27T03:54:14.964Z"
        }
    ],
    "pagination": {
        "page": 1,
        "previousPage": null,
        "maxItemsPerPage": 10,
        "totalItems": 1,
        "totalPages": 1,
        "lastPage": true
    }
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-401">
                                            <strong>401 - Unauthorized</strong><br>
                                            Token ausente ou inválido
                                        </div>
                                        <div class="status-code status-403">
                                            <strong>403 - Forbidden</strong><br>
                                            Token expirado
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Update URL Code -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method PATCH">PATCH</span>
                                    <span class="endpoint-path">/user/urls</span>
                                    <span>Atualizar código da URL</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Permite alterar o código de uma URL existente do usuário.</p>
                                    <h4>📥 Parâmetros do Body</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>originalCode</td><td>string</td><td class="required">✓</td><td>Código atual da URL</td></tr>
                                        <tr><td>newCode</td><td>string</td><td class="required">✓</td><td>Novo código (3-20 caracteres alfanuméricos)</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (200)</h4>
                                    <div class="code-block example-response">{
    "id": "05d803cf-b944-44ca-a666-1e3c2e0f48a9",
    "code": "k1K1k1",
    "originalUrl": "http://www.google.com",
    "shortUrl": "http://localhost:3000/k1K1k1",
    "clicks": 2,
    "status": "ACTIVE",
    "userId": "f30b52fe-47ec-4ed2-a8ff-056b0a1fdd56",
    "createdAt": "2025-06-27T17:05:51.350Z",
    "updatedAt": "2025-06-27T19:25:22.545Z"
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-400">
                                            <strong>400 - Bad Request</strong><br>
                                            Novo código inválido ou já existe
                                        </div>
                                        <div class="status-code status-404">
                                            <strong>404 - Not Found</strong><br>
                                            URL com código atual não encontrada
                                        </div>
                                        <div class="status-code status-409">
                                            <strong>409 - Conflict</strong><br>
                                            Novo código já está em uso
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delete URL -->
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method DELETE">DELETE</span>
                                    <span class="endpoint-path">/user/urls/:code</span>
                                    <span>Deletar URL</span>
                                </div>
                                <div class="endpoint-desc">
                                    <p>Remove uma URL do usuário (soft delete - pode ser recuperada).</p>
                                    <h4>📥 Parâmetros da URL</h4>
                                    <table class="param-table">
                                        <tr><th>Campo</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
                                        <tr><td>code</td><td>string</td><td class="required">✓</td><td>Código da URL a ser deletada</td></tr>
                                    </table>
                                    <h4>📤 Resposta de Sucesso (200)</h4>
                                    <div class="code-block example-response">{
    "id": "bfdb7be0-8a13-44f4-b558-c103f19cbb00",
    "code": "Muotpi",
    "originalUrl": "https://www.x.com",
    "shortUrl": "http://localhost:3000/Muotpi",
    "clicks": 10,
    "status": "DELETED",
    "userId": "f30b52fe-47ec-4ed2-a8ff-056b0a1fdd56",
    "createdAt": "2025-06-27T16:40:57.775Z",
    "updatedAt": "2025-06-27T19:21:59.665Z",
    "deletedAt": "2025-06-27T19:21:59.663Z"
}</div>
                                    <h4>⚠️ Possíveis Erros</h4>
                                    <div class="status-codes">
                                        <div class="status-code status-404">
                                            <strong>404 - Not Found</strong><br>
                                            URL não encontrada ou não pertence ao usuário
                                        </div>
                                        <div class="status-code status-401">
                                            <strong>401 - Unauthorized</strong><br>
                                            Token ausente ou inválido
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section" id="errors">
                        <div class="section-header">
                            <h2>⚠️ Códigos de Erro Globais</h2>
                        </div>
                        <div class="section-content">
                            <p>Todos os endpoints podem retornar os seguintes códigos de erro:</p>
                            <div class="status-codes">
                                <div class="status-code status-400">
                                    <strong>400 - Bad Request</strong><br>
                                    Dados inválidos na requisição
                                </div>
                                <div class="status-code status-401">
                                    <strong>401 - Unauthorized</strong><br>
                                    Autenticação necessária
                                </div>
                                <div class="status-code status-403">
                                    <strong>403 - Forbidden</strong><br>
                                    Token expirado ou inválido
                                </div>
                                <div class="status-code status-404">
                                    <strong>404 - Not Found</strong><br>
                                    Recurso não encontrado
                                </div>
                                <div class="status-code status-409">
                                    <strong>409 - Conflict</strong><br>
                                    Conflito com recurso existente
                                </div>
                                <div class="status-code status-500">
                                    <strong>500 - Internal Server Error</strong><br>
                                    Erro interno do servidor
                                </div>
                            </div>
                            <h4>📋 Formato Padrão de Erro</h4>
                            <div class="code-block example-response">{
  "message": "Descrição do erro",
  "error": "CÓDIGO_DO_ERRO",
  "requestId": "uuid-da-requisição",
  "timestamp": "2025-06-27T10:30:00.000Z"
}</div>
                        </div>
                    </div>

                    <div class="section" id="examples">
                        <div class="section-header">
                            <h2>💡 Exemplos Práticos</h2>
                        </div>
                        <div class="section-content">
                            <h3>🚀 Exemplo 1: Encurtar URL sem autenticação</h3>
                            <div class="code-block example-request"># Requisição
curl -X POST http://localhost:3000/shorten \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.github.com/meu-usuario/meu-repositorio"
  }'

# Resposta
{
  "message": "URL shortened successfully",
  "data": {
    "shortCode": "gh1a2b3",
    "shortUrl": "http://localhost:3000/gh1a2b3",
    "originalUrl": "https://www.github.com/meu-usuario/meu-repositorio"
  }
}</div>

                            <h3>🔐 Exemplo 2: Fluxo completo com autenticação</h3>
                            <div class="code-block example-request"># 1. Registrar usuário
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "dev@exemplo.com",
    "password": "minhasenha123"
  }'

# 2. Fazer login (usar o token retornado)
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "dev@exemplo.com",
    "password": "minhasenha123"
  }'

# 3. Encurtar URL autenticado
curl -X POST http://localhost:3000/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '{
    "url": "https://docs.exemplo.com/api/tutorial",
    "customCode": "tutorial-api"
  }'

# 4. Listar minhas URLs
curl -X GET "http://localhost:3000/user/urls?page=1&limit=10" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"</div>

                            <h3>📊 Exemplo 3: Gerenciamento de URLs</h3>
                            <div class="code-block example-request"># Atualizar código da URL
curl -X PATCH http://localhost:3000/user/urls \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '{
    "originalCode": "tutorial-api",
    "newCode": "docs-api-v2"
  }'

# Deletar URL
curl -X DELETE http://localhost:3000/user/urls/docs-api-v2 \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"</div>

                            <div class="auth-note">
                                <strong>💡 Dica Pro:</strong> Use ferramentas como Postman, Insomnia ou Thunder Client para testar a API de forma mais visual!
                            </div>

                            <h3>🔗 Links Úteis</h3>
                            <ul style="padding-left: 20px; margin-top: 15px;">
                                <li><a href="/docs.json" style="color: #4299e1;">📄 Download OpenAPI JSON</a></li>
                                <li><a href="/health" style="color: #4299e1;">❤️ Status da API</a></li>
                                <li><strong>GitHub:</strong> <code>git clone https://github.com/seu-usuario/url-shortener</code></li>
                            </ul>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 40px 0; padding: 20px; background: #f7fafc; border-radius: 8px;">
                        <p style="color: #4a5568; margin: 0;">
                            🚀 <strong>URL Shortener API v0.4.0</strong> | 
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `);
  });
  app.get('/docs.json', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'URL Shortener API',
        version: '0.4.0',
        description: `
# URL Shortener API

Sistema completo de encurtamento de URLs desenvolvido com Node.js, Express, TypeScript e PostgreSQL.

## Como usar esta API

### 1. Autenticação (Opcional)
Para gerenciar suas URLs, registre-se e faça login para obter um token JWT.

### 2. Encurtar URLs
Use o endpoint \`POST /shorten\` para criar URLs curtas. Pode ser usado sem autenticação.

### 3. Redirecionamento
Acesse a URL curta e será redirecionado automaticamente.

### 4. Gerenciamento (Autenticado)
Use os endpoints de usuário para listar, editar e deletar suas URLs.
                `,
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token obtido através do endpoint de login',
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID único do usuário' },
              email: { type: 'string', format: 'email', description: 'Email do usuário' },
              password: { type: 'string', format: 'email', description: 'Senha do usuário' },
              createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data da última atualização',
              },
              deletedAt: { type: 'string', format: 'date-time', description: 'Data de deleção' },
            },
          },
          Url: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
              code: { type: 'string', description: 'Código da URL encurtada' },
              originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
              shortUrl: { type: 'string', format: 'uri', description: 'URL encurtada completa' },
              clicks: { type: 'integer', minimum: 0, description: 'Número de cliques' },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'DELETED'],
                description: 'Status da URL',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'ID do usuário proprietário (null para URLs públicas)',
              },
              createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data da última atualização',
              },
              deletedAt: { type: 'string', format: 'date-time', description: 'Data de deleção' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Mensagem de erro' },
              error: { type: 'string', description: 'Código do erro' },
              requestId: { type: 'string', description: 'ID da requisição para debugging' },
            },
          },
          PaginationInfo: {
            type: 'object',
            properties: {
              page: { type: 'integer', minimum: 1, description: 'Página atual' },
              previousPage: {
                type: 'integer',
                nullable: true,
                description: 'Página anterior, null se for primeira página',
              },
              totalPages: { type: 'integer', minimum: 0, description: 'Total de páginas' },
              totalItems: { type: 'integer', minimum: 0, description: 'Total de itens' },
              maxItemsPerPage: { type: 'integer', minimum: 1, description: 'Itens por página' },
              lastPage: { type: 'boolean', description: 'Identifica se está na última página' },
            },
          },
        },
      },
      paths: {
        '/health': {
          get: {
            tags: ['System'],
            summary: 'Verificar status da API',
            description: 'Endpoint para monitoramento da saúde da API',
            responses: {
              '200': {
                description: 'API funcionando corretamente',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' },
                        timestamp: { type: 'string', format: 'date-time' },
                        requestId: { type: 'string', format: 'uuid' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '/auth/register': {
          post: {
            tags: ['Authentication'],
            summary: 'Registrar novo usuário',
            description: 'Cria uma nova conta de usuário no sistema',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                      email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email válido do usuário',
                        example: 'usuario@exemplo.com',
                      },
                      password: {
                        type: 'string',
                        minLength: 6,
                        description:
                          'Senha com no pelo menos: 6 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo ($*&@#)',
                        example: 'Minhasenha123@',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Usuário registrado com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        email: { type: 'string', example: 'teste@teste.com' },
                        id: { type: 'string', format: 'uuid' },
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'Dados inválidos',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                    example: {
                      message: 'Dados inválidos',
                      errors: 'VALIDATION_ERROR',
                    },
                  },
                },
              },
              '409': {
                description: 'Email já cadastrado',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                    example: {
                      message: 'Email already exists',
                      requestId: 'req-123',
                    },
                  },
                },
              },
            },
          },
        },
        '/auth/login': {
          post: {
            tags: ['Authentication'],
            summary: 'Fazer login',
            description: 'Autentica um usuário e retorna um token JWT',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                      email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email do usuário',
                        example: 'usuario@exemplo.com',
                      },
                      password: {
                        type: 'string',
                        description: 'Senha do usuário',
                        example: 'minhasenha123',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Login realizado com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        access_token: {
                          type: 'string',
                          description: 'JWT token para autenticação',
                        },
                      },
                    },
                  },
                },
              },
              '401': {
                description: 'Credenciais inválidas',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/shorten': {
          post: {
            tags: ['URLs'],
            summary: 'Encurtar URL',
            description: 'Cria uma URL encurtada. Pode ser usado com ou sem autenticação.',
            security: [{}, { BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['originalUrl'],
                    properties: {
                      originalUrl: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL para encurtar (deve começar com http/https)',
                        example: 'https://www.exemplo.com/pagina-muito-longa',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'URL encurtada com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'URL shortened successfully' },
                        data: { $ref: '#/components/schemas/Url' },
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'URL inválida',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
              '409': {
                description: 'Código personalizado já existe',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/{code}': {
          get: {
            tags: ['URLs'],
            summary: 'Redirecionar para URL original',
            description: 'Redireciona para a URL original e incrementa contador de cliques',
            parameters: [
              {
                name: 'code',
                in: 'path',
                required: true,
                description: 'Código da URL encurtada',
                schema: {
                  type: 'string',
                  example: 'abc123',
                },
              },
            ],
            responses: {
              '301': {
                description: 'Redirecionamento para URL original',
                headers: {
                  Location: {
                    description: 'URL original',
                    schema: {
                      type: 'string',
                      format: 'uri',
                    },
                  },
                },
              },
              '404': {
                description: 'URL não encontrada ou expirada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/user/urls': {
          get: {
            tags: ['User Management'],
            summary: 'Listar URLs do usuário',
            description: 'Lista todas as URLs criadas pelo usuário com paginação e filtros',
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: 'page',
                in: 'query',
                description: 'Número da página',
                schema: { type: 'integer', minimum: 1, default: 1 },
              },
              {
                name: 'limit',
                in: 'query',
                description: 'Itens por página',
                schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
              },
              {
                name: 'status',
                in: 'query',
                description: 'Filtrar por status',
                schema: {
                  type: 'string',
                  enum: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'all'],
                  default: 'all',
                },
              },
              {
                name: 'search',
                in: 'query',
                description: 'Buscar por URL ou código',
                schema: { type: 'string' },
              },
            ],
            responses: {
              '200': {
                description: 'URLs listadas com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'URLs retrieved successfully' },
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Url' },
                        },
                        pagination: { $ref: '#/components/schemas/PaginationInfo' },
                      },
                    },
                  },
                },
              },
              '401': {
                description: 'Token ausente ou inválido',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
          patch: {
            tags: ['User Management'],
            summary: 'Atualizar código da URL',
            description: 'Permite alterar o código de uma URL existente',
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['originalCode', 'newCode'],
                    properties: {
                      originalCode: {
                        type: 'string',
                        description: 'Código atual da URL',
                        example: 'abc123',
                      },
                      newCode: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 20,
                        pattern: '^[a-zA-Z0-9-_]+$',
                        description: 'Novo código para a URL',
                        example: 'meunovocódigo',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'API funcionando corretamente',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
                        code: { type: 'string', description: 'Código da URL encurtada' },
                        originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
                        shortUrl: {
                          type: 'string',
                          format: 'uri',
                          description: 'URL encurtada completa',
                        },
                        clicks: { type: 'integer', minimum: 0, description: 'Número de cliques' },
                        status: {
                          type: 'string',
                          enum: ['ACTIVE', 'DELETED'],
                          description: 'Status da URL',
                        },
                        userId: {
                          type: 'string',
                          format: 'uuid',
                          nullable: true,
                          description: 'ID do usuário proprietário (null para URLs públicas)',
                        },
                        createdAt: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Data de criação',
                        },
                        updatedAt: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Data da última atualização',
                        },
                      },
                    },
                  },
                },
              },
              '404': {
                description: 'URL não encontrada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
              '409': {
                description: 'Novo código já existe',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/user/urls/{code}': {
          delete: {
            tags: ['User Management'],
            summary: 'Deletar URL',
            description: 'Remove uma URL do usuário (soft delete)',
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: 'code',
                in: 'path',
                required: true,
                description: 'Código da URL a ser deletada',
                schema: { type: 'string', example: 'abc123' },
              },
            ],
            responses: {
              '200': {
                description: 'API funcionando corretamente',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
                        code: { type: 'string', description: 'Código da URL encurtada' },
                        originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
                        shortUrl: {
                          type: 'string',
                          format: 'uri',
                          description: 'URL encurtada completa',
                        },
                        clicks: { type: 'integer', minimum: 0, description: 'Número de cliques' },
                        status: {
                          type: 'string',
                          enum: ['ACTIVE', 'DELETED'],
                          description: 'Status da URL',
                        },
                        userId: {
                          type: 'string',
                          format: 'uuid',
                          nullable: true,
                          description: 'ID do usuário proprietário (null para URLs públicas)',
                        },
                        createdAt: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Data de criação',
                        },
                        updatedAt: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Data da última atualização',
                        },
                        deletedAt: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Data de deleção',
                        },
                      },
                    },
                  },
                },
              },
              '404': {
                description: 'URL não encontrada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'System',
          description: 'Endpoints do sistema',
        },
        {
          name: 'Authentication',
          description: 'Gerenciamento de autenticação',
        },
        {
          name: 'URLs',
          description: 'Operações com URLs',
        },
        {
          name: 'User Management',
          description: 'Gerenciamento de URLs do usuário',
        },
      ],
    });
  });
};
