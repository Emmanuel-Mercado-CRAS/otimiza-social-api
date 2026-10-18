# OtimizaSocial API

API de gestão de otimização de páginas de redes sociais para pequenos comerciantes.
Permite cadastrar usuários, autenticar com token JWT e gerenciar páginas de redes
sociais (CRUD completo), acompanhando o status de otimização de cada página.

## Funcionalidades

- Cadastro e autenticação de usuários com **JWT** (token válido por 2 horas)
- Senhas criptografadas com **bcryptjs**
- CRUD completo de páginas de redes sociais (criar, listar, consultar, atualizar, excluir)
- Rotas protegidas por autenticação (Bearer Token)
- Validação de dados e tratamento de erros com códigos HTTP adequados
- CORS configurado para origem específica
- Persistência em banco de dados **SQLite** com **Prisma ORM**

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução do JavaScript |
| Express | Framework para criação da API |
| Prisma ORM | Mapeamento objeto-relacional e criação do banco |
| SQLite | Banco de dados (arquivo local, sem servidor) |
| JSON Web Token (JWT) | Autenticação e proteção de rotas |
| bcryptjs | Criptografia de senhas |
| CORS | Liberação de acesso entre origens |
| dotenv | Gerenciamento de variáveis de ambiente |

## Estrutura do projeto
otimiza-social-api/ 
├── prisma/ 
│ └── schema.prisma # Definição das tabelas do banco 
├── src/ 
│ ├── server.js # Ponto de entrada da API 
│ ├── routes/ # Endpoints (endereços da API) 
│ │ ├── auth.routes.js 
│ │ └── paginas.routes.js 
│ ├── controllers/ # Regras de negócio 
│ │ ├── auth.controller.js 
│ │ └── paginas.controller.js 
│ └── middleware/ # Verificações (autenticação) 
│ └── auth.middleware.js 
├── .env # Variáveis de ambiente (não versionar) 
├── .env.example # Exemplo das variáveis necessárias 
└── package.json



## Pré-requisitos

- [Node.js](https://nodejs.org) versão 18 ou superior (LTS recomendada)
- [Git](https://git-scm.com) para clonar o repositório
- [Postman](https://www.postman.com) ou [Insomnia](https://insomnia.rest) para testar a API

## Como instalar e executar

1. **Clone o repositório**

```bash
git clone https://github.com/SEU_USUARIO/otimiza-social-api.git
cd otimiza-social-api

2. Instale as dependências
npm install

3. Configure as variáveis de ambiente
Copie o arquivo .env.example para .env e preencha os valores:
cp .env.example .env

4. Crie o banco de dados (migration)
npx prisma migrate dev --name init

5. Execute a API
npm run dev
O servidor inicia em http://localhost:3000. Para confirmar, acesse http://localhost:3000 no navegador — deve retornar:
{ "mensagem": "API OtimizaSocial funcionando!" }



Exemplo de uso
1. Criar usuário
POST http://localhost:3000/auth/registrar
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456"
}

2. Fazer login e copiar o token retornado
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "maria@email.com",
  "senha": "123456"
}

3. Criar uma página (com o token no cabeçalho Authorization)
POST http://localhost:3000/paginas
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Padaria da Maria",
  "url": "https://facebook.com/padariadamaria",
  "nicho": "Alimentação",
  "descricao": "Página da padaria do bairro"
}


Endpoints da API
Autenticação
Método	Endpoint	Descrição	Corpo (JSON)	Respostas
POST	/auth/registrar	Cria um usuário	{ "nome", "email", "senha" }	201, 400
POST	/auth/login	Autentica e retorna o token	{ "email", "senha" }	200, 401


Páginas (requerem autenticação — Bearer Token)
Método	Endpoint	Descrição	Respostas
GET	/paginas	Lista as páginas do usuário logado	200, 401
GET	/paginas/:id	Consulta uma página específica	200, 400, 401, 404
POST	/paginas	Cria uma nova página	201, 400, 401
PATCH	/paginas/:id	Atualiza uma página (atualização parcial)	200, 400, 401, 404
DELETE	/paginas/:id	Exclui uma página	204, 400, 401, 404



Segurança
Autenticação JWT: todas as rotas de /paginas exigem um token válido no cabeçalho Authorization no formato Bearer <token>.
Senhas criptografadas: as senhas são armazenadas com hash bcrypt, nunca em texto puro.
CORS: apenas a origem definida em CORS_ORIGIN pode acessar a API.
Variáveis de ambiente: dados sensíveis ficam no .env, que não é versionado.


Tratamento de erros
A API retorna códigos HTTP adequados para cada situação:

Código	Situação
200	Requisição bem-sucedida
201	Recurso criado com sucesso
204	Operação realizada sem conteúdo de retorno
400	Dados inválidos ou campos obrigatórios ausentes
401	Token ausente, inválido ou credenciais incorretas
404	Recurso não encontrado
500	Erro interno do servidor


Autor
[Wellington Emmanuel Caetano] — [wellmil@hotmail.com] — Curso de Análise e Desenvolvimento de Sistemas


