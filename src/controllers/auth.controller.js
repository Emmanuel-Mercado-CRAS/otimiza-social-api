const bcrypt = require('bcryptjs');   // criptografa senhas
const jwt = require('jsonwebtoken');  // gera tokens
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();    // conexão com o banco via ORM

// POST /auth/registrar
async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Validação: campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
    }

    // Verifica se o e-mail já existe no banco
    const emailExiste = await prisma.user.findUnique({ where: { email } });
    if (emailExiste) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado' });
    }

    // Criptografa a senha (nunca guardamos senha em texto puro!)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco usando o ORM
    const usuario = await prisma.user.create({
      data: { nome, email, senha: senhaCriptografada }
    });

    // 201 = recurso criado com sucesso
    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    // Busca o usuário pelo e-mail
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    // Compara a senha digitada com a criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    // Gera o token JWT válido por 2 horas
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao fazer login' });
  }
}

module.exports = { registrar, login };