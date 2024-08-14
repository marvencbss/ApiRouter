const express = require('express');
const sequelize = require('./data_base/db');
const usuariosRotas = require('./rotas/usuarioRotas');
const uploadArquivoRotas = require('./rotas/uploadArquivoRotas');
const validarToken = require('./rotas/tokenRotas');
const enviarMensagem = require('./rotas/enviarMensagemRotas');

const setupSwagger = require('./swagger');

const cors = require('cors');


const app = express();
const PORT = process.env.PORT;


app.use(require("cors")());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

setupSwagger(app);

app.use(express.json());
app.use('/api_super', usuariosRotas);
app.use('/api_super', uploadArquivoRotas);
app.use('/api_super', validarToken);
app.use('/api_super', enviarMensagem);


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});