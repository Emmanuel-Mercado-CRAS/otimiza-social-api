// Carrega as variáveis do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importa as rotas que forem criadas
const authRoutes = require('./routes/auth.routes');
const paginaRoutes = require('./routes/paginas.routes');

const app = express();

// CORS: libera apenas a origem definida no .env
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Faz o Express entender JSON no corpo das requisições
app.use(express.json());

// Define os "endereços" principais da API
app.use('/auth', authRoutes);       // rotas de cadastro e login
app.use('/paginas', paginaRoutes);  // rotas de páginas (CRUD)

// Rota inicial só para confirmar que a API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API OtimizaSocial funcionando!' });
});

// Resposta padrão para endereço inexistente (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros inesperados (500)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Sobe o servidor na porta definida
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});