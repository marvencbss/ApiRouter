const express = require('express');
const sequelize = require('./data_base/db');
const usuariosRotas = require('./rotas/usuarioRotas');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT;

const cors = require('cors');

app.use(express.json());
app.use('/api', usuariosRotas);

app.use(require("cors")());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSucessStatus: 204
};

app.use(cors(corsOptions));

setupSwagger(app);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});