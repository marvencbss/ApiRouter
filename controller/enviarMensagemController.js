const  { enviarSMSService } = require('../service/enviarSMSService');

exports.enviarSMS = async(req, res) => {
    const { telefone , mensagem } = req.body;
    console.log('Telefone:',telefone);
    console.log('Mensagem:',mensagem);
    try{
        if (!telefone) {
            console.log('Retorna http 400');
            res.status(400).json('Informar telefone');
        }else{
            enviarSMSService(telefone,mensagem);
        }
    }catch(err){
        console.log('Erro ao enviar SMS',err);
        res.status(500).json({ error: 'Erro ao enviar SMS' });
    }
};