const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');


/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token
 *       example:
 *         token: 'your_jwt_token'
 */

/**
 * @swagger
 * /validarToken:
 *   post:
 *     summary: Verifica a validade do token JWT
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Token'
 *     responses:
 *       200:
 *         description: Token é válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Token é válido
 *                   example: true
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Token é inválido
 *                   example: false
 *       400:
 *         description: Nenhum token fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Nenhum token fornecido
 *                   example: false
 */
router.post('/validarToken', tokenController.validaToken);

module.exports = router;