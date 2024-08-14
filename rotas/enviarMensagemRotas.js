const express = require('express');
const router = express.Router();
const enviarMensagemController = require('../controller/enviarMensagemController');

/**
 * @swagger
 * /enviaremail:
 *   post:
 *     summary: Enviar mensagem via E-mail
 *     tags: [Envio de mensagens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinatario:
 *                 type: string
 *                 description: Destinatario que recebera o e-mail
 *               assunto:
 *                 type: string
 *                 description: Assunto do e-mail
 *               mensagem:
 *                 type: string
 *                 description: Mensagem do e-mail
 *     responses:
 *       200:
 *         description: E-mail enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 retorno:
 *                   type: string
 *       400:
 *         description: Erro ao enviar o e-mail ou e-mail inválido
 *       500:
 *         description: Erro ao enviar a e-mail
 */
router.post('/enviaremail', enviarMensagemController.enviarEmail);

module.exports = router;