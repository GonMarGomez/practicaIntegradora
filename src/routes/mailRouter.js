import { Router } from 'express';
import nodemailer from 'nodemailer'
import { generateToken } from '../middlewares/generateJWT.js';


const mailRouter = Router();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

mailRouter.post('/changepassword', async (req, res) => {
    try {
        const { userId, userEmail } = req.body; 
        const token = generateToken(userId);

        const result = await transport.sendMail({
            from: 'Gon Gomez <gonzalomgomez5@gmail.com>',
            to: userEmail, 
            subject: 'Restablecer Contraseña',
            html: `
                <div>
                    <h1>Restablecer Contraseña</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="http://tu-sitio.com/reset-password/${token}">Restablecer Contraseña</a>
                </div>`,
            attachments: [],
        });

        res.send({ status: 'success', result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Error al enviar el correo electrónico' });
    }
});

export default mailRouter;