const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/registrar - cria um novo usuário
router.post('/registrar', authController.registrar);

// POST /auth/login - faz login e devolve o token
router.post('/login', authController.login);

module.exports = router;