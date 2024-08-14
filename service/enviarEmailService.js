const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PWD_EMAIL_GMAIL_APP
    }
});

function enviarEmailService(destinatario, assunto, mensagem) {
    console.log('EnviarEmailService.destinatario',destinatario);
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: destinatario,
        subject: assunto, 
        html: mensagem
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar email:', error);
        } else {
            console.log('Email enviado com sucesso:', info.response);
        }
    });
}

module.exports = { enviarEmailService };