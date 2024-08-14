const axios = require('axios');
const jwttoken = require('./tokenController');
const Usuario = require('../modelo/Usuario');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EsqueciMinhaSenha = require('../modelo/esqueciMinhaSenha');

exports.createusuario = async (req, res) => {
  console.log('createusuario');
  const { nome, idade, cidade, uf ,cep, logradouro, complemento, bairro, numero, email, senha} = req.body;
  console.log('Createusuario.Nome'+nome);
  console.log('createusuario.Idade'+idade);
  console.log('createusuario.Cidade'+cidade);
  console.log('createusuario.UF'+uf);
  console.log('createusuario.CEP'+cep);
  console.log('createusuario.Logradouro'+logradouro);
  console.log('createusuario.Complemento'+complemento);
  console.log('createusuario.Bairro'+bairro);
  console.log('createusuario.Numero'+numero);
  console.log('createusuario.Email'+email);

  const hashedPassword = getHashedPassword(senha);
  
  try {
    const novoUsuario = await Usuario.create({ nome, idade , cidade, uf, cep, logradouro, complemento, bairro, numero, email, senha:hashedPassword});
    res.status(201).json(novoUsuario);
  } catch (err) {
    console.log("Erro ao criar usuário",err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.getusuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
};

exports.updateusuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, cidade, uf, cep, logradouro, complemento, bairro, numero  } = req.body;
  console.log("updateusuario id:"+id+" - nome:"+nome+" - idade:"+idade+"- cidade:"+cidade+"- uf:"+uf+"- cep:"+cep+"- logradouro:"+logradouro+"- complemento:"+complemento+"- bairro:"+bairro+"- numero:"+numero);
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      usuario.nome = nome;
      usuario.idade = idade;
      usuario.cidade = cidade;
      usuario.uf = uf;
      usuario.cep = cep;
      usuario.logradouro = logradouro;
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
    res.status(500).json({ error: 'Erro ao buscar o por nome usuário' });
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

function getHashedPassword(senha) {
  console.log('getHashedPassword',senha);
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(senha, salt);
  console.log('getHashedPassword.hashedPassword:',hashedPassword);
  return hashedPassword;
};

exports.login = async (req, res) => {

  const { email, senha } = req.body;

  console.log('login',email);
  try {
      const usuario = await Usuario.findOne({ where: { email } });
      console.log('Usuario....:',usuario);
      
      if (usuario === null) {
          return res.status(400).send('Dados incorretos - cod 001!');
      }
      else{
        console.log('Usuario.email econtrado:',usuario.email);
        const isPasswordValid = bcrypt.compareSync(senha, usuario.senha);

        if (!isPasswordValid) {
            console.log('Dados incorretos - cod 002!');
            return res.status(400).send('Dados incorretos!');

        }
        const token = gerarToken(usuario,'35m');

        res.send({ token });
    }
  } catch (err) {
   
    console.log('Erro no login',err);
      res.status(400).send('Erro no login : ' + err.message);
  }
};

exports.esqueciMinhaSenha = async (req, res) => {
  console.log('esqueciMinhaSenha');
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
      const token = gerarToken(usuario,'10m');
      const usuarioId = usuario.id;
      const esqueciMinhaSenha = await EsqueciMinhaSenha.create({ usuarioId, email, token});
      const assunto = 'Recuperar senha'
      const resetUrl = `http://localhost:3000/resetar-senha/${esqueciMinhaSenha.token}`;
      const mensagem = `
          <h1>Você solicitou a redefinição de senha</h1>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      `;

     const response = await axios.post('http://localhost:3001/api_super/enviaremail', {
      destinatario: email,
      assunto: assunto,
      mensagem: mensagem
    });

      if (response.status === 200) {
        console.log('E-mail de recuperação enviado com sucesso.');
        res.status(200).json('E-mail de recuperação enviado com sucesso.');
      }
      else {
        console.log('Erro ao buscar o usuário');
        res.status(500).json({ error: 'Erro ao buscar o usuário' });
      }
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.log('Erro ao buscar o usuário:',err);
    res.status(500).json({ error: 'Erro ao buscar o usuário' });
  }
};

function gerarToken(usuario,tempoExpiracao) {
  return jwt.sign({ usuarioId: usuario.id }, process.env.JWT_KEY, { expiresIn: tempoExpiracao });
};

exports.resetarSenha = async (req, res) => {

  const { senha } = req.body;
  const { token } = req.body;
  
  try {
    const esqueciMinhaSenha = await EsqueciMinhaSenha.findOne({ where: { token } });

    if (esqueciMinhaSenha) {

      try {
        const response = await axios.post('http://localhost:3001/api_super/validarToken', { token: token });

        if (response.status === 200) {
          console.log('Token valido.......:');
          const usuario = await Usuario.findByPk(esqueciMinhaSenha.usuarioId);
          if (usuario) {
            const hashedPassword = getHashedPassword(senha);
            usuario.updatedAt = new Date();
            usuario.senha = hashedPassword;
            await usuario.save();
            res.status(200).json('Senha alterada com sucesso');
          }
        }
        else {
          console.log('Token invalido');
          res.status(500).json({ error: 'Token invalido' });
        }

      } catch (erro) {
        res.status(401).json({ error: 'Token invalido'});
      }
    } else {
      console.log('Dados não encontrados');
      res.status(401).json({ error: 'Dados não encontrados' });
    }
  } catch (err) {
    console.log('Erro ao resetar a senha',err);
    res.status(500).json({ error: 'Erro ao resetar a senha' });
  }
};