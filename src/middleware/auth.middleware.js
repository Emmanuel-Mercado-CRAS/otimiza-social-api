const jwt = require('jsonwebtoken');

// Verifica se o token enviado no cabeçalho Authorization é válido
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  // Formato esperado: "Bearer <token>"
  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  const token = cabecalho.split(' ')[1];

  try {
    // Se o token for válido, guarda o id do usuário na requisição e segue
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = dados.id;
    next(); // libera a requisição para continuar
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = autenticar;