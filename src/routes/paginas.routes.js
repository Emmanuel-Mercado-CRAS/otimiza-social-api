const express = require('express');
const router = express.Router();
const paginaController = require('../controllers/paginas.controller');
const autenticar = require('../middleware/auth.middleware');

// Todas as rotas de páginas exigem autenticação (endpoint protegido!)
router.use(autenticar);

// GET /paginas - lista as páginas do usuário logado
router.get('/', paginaController.listar);

// GET /paginas/:id - consulta uma página específica
router.get('/:id', paginaController.consultar);

// POST /paginas - cria uma nova página
router.post('/', paginaController.criar);

// PATCH /paginas/:id - atualiza uma página
router.patch('/:id', paginaController.atualizar);

// DELETE /paginas/:id - exclui uma página
router.delete('/:id', paginaController.excluir);

module.exports = router;