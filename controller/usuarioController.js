const Usuario = require('../modelo/Usuario');
const { Op } = require('sequelize');


exports.createusuario = async (req, res) => {
  console.log('createusuario');
  const { nome, idade, cidade, uf, cep, complemento, bairro, numero } = req.body;
  console.log('Createusuario.Nome' +nome);
  console.log('Createusuario.Idade' +idade);
  console.log('Createusuario.Cidade' +cidade);
  console.log('Createusuario.UF' +uf);
  console.log('Createusuario.cep' +cep);
  console.log('Createusuario.complemento' +complemento);
  console.log('Createusuario.bairro' +bairro);
  console.log('Createusuario.numero' +numero);
  try {
    const novoUsuario = await Usuario.create({ nome, idade, cidade, uf})
    res.status(201).json(novoUsuario);
  } catch (err) {
    console.log("Erro ao criar o usuário.");
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
};

// Obter todos os usuários
exports.getusuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
};

// Atualizar um usuário
exports.updateusuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, cidade, uf, cep, complemento, bairro, numero } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      usuario.nome = nome;
      usuario.idade = idade;
      usuario.cidade = cidade;
      usuario.uf = uf;
      usuario.cep = cep;
      usuario.complemento = complemento;
      usuario.bairro = bairro;
      usuario.numero = numero;
      usuario.updatedAt = new Date();
      await usuario.save();
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.buscarId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o usuário' });
  }
};

exports.buscarUsuarioPorNome = async (req, res) => {
  const {nome} = req.params;
  try {
    const usuario = await Usuario.findAll({ where: { nome: {  [Op.like]: `%${nome}%` } } });

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Nenhum nome de usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar por nome de usuário' });
  }
};

exports.buscarUsuarioPorCidade = async (req, res) => {
  const {cidade} = req.params;
  try {
    const usuario = await Usuario.findAll({ where: { cidade: {  [Op.like]: `%${cidade}%` } } });

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Nenhuma cidade encontrada no banco de dados.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar por cidade.' });
  }
};

exports.deleteusuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      await usuario.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};