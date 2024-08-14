const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

function enviarSMSService(para, mensagem) {
    console.log('ENVIAR SMS');
    client.messages.create({
        body: mensagem,
        from: '51986650556',
        to: para
    })
    .then((message) => console.log(`Mensagem enviada com ID: ${message.sid}`))
    .catch((error) => console.error(error));
}

module.exports = { enviarSMSService };