const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /paginas - lista as páginas do usuário logado
async function listar(req, res) {
  try {
    const paginas = await prisma.pagina.findMany({
      where: { userId: req.usuarioId }, // só as páginas do próprio usuário
      orderBy: { criadoEm: 'desc' }
    });
    return res.json(paginas); // 200 (padrão) com a lista
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao listar páginas' });
  }
}

// GET /paginas/:id - consulta uma página específica
async function consultar(req, res) {
  try {
    const id = Number(req.params.id);

    // Validação: o id precisa ser um número
    if (!Number.isInteger(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const pagina = await prisma.pagina.findFirst({
      where: { id, userId: req.usuarioId }
    });

    if (!pagina) {
      return res.status(404).json({ erro: 'Página não encontrada' });
    }

    return res.json(pagina);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao consultar página' });
  }
}

// POST /paginas - cria uma nova página
async function criar(req, res) {
  try {
    const { nome, url, nicho, descricao } = req.body;

    // Validação: nome e URL são obrigatórios
    if (!nome || !url) {
      return res.status(400).json({ erro: 'Nome e URL são obrigatórios' });
    }

    // Validação simples de URL (deve começar com http:// ou https://)
    if (!/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ erro: 'URL inválida. Use o formato https://...' });
    }

    const pagina = await prisma.pagina.create({
      data: {
        nome,
        url,
        nicho: nicho || null,
        descricao: descricao || null,
        userId: req.usuarioId
      }
    });

    return res.status(201).json(pagina); // 201 = criado com sucesso
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao criar página' });
  }
}

// PATCH /paginas/:id - atualiza apenas os campos enviados
// (foi escolhido PATCH em vez de PUT para obter atualização parcial:
//  o usuário pode mudar só o status sem reenviar todos os dados)
async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, url, nicho, descricao, status } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    // Confere se a página existe e pertence ao usuário logado
    const paginaExiste = await prisma.pagina.findFirst({
      where: { id, userId: req.usuarioId }
    });

    if (!paginaExiste) {
      return res.status(404).json({ erro: 'Página não encontrada' });
    }

    if (url && !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ erro: 'URL inválida. Use o formato https://...' });
    }

    const pagina = await prisma.pagina.update({
      where: { id },
      data: {
        nome: nome ?? paginaExiste.nome,
        url: url ?? paginaExiste.url,
        nicho: nicho ?? paginaExiste.nicho,
        descricao: descricao ?? paginaExiste.descricao,
        status: status ?? paginaExiste.status
      }
    });

    return res.json(pagina);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao atualizar página' });
  }
}

// DELETE /paginas/:id - exclui uma página
async function excluir(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const paginaExiste = await prisma.pagina.findFirst({
      where: { id, userId: req.usuarioId }
    });

    if (!paginaExiste) {
      return res.status(404).json({ erro: 'Página não encontrada' });
    }

    await prisma.pagina.delete({ where: { id } });

    return res.status(204).send(); // 204 = sucesso sem conteúdo no corpo
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao excluir página' });
  }
}

module.exports = { listar, consultar, criar, atualizar, excluir };