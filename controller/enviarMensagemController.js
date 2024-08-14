const { enviarEmailService } = require('../service/enviarEmailService');

exports.enviarEmail = async (req, res) => {
    const { destinatario, assunto, mensagem } = req.body;
    try {
        enviarEmailService(destinatario, assunto, mensagem);
        res.status(200).json({ success: true, message: 'Email enviado com sucesso' });
    } catch (err) {
        console.log('Erro ao enviar E-mail', err);
        res.status(500).json({ error: 'Erro ao enviar E-mail' });
    }
}