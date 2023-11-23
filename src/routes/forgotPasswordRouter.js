import { Router } from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import UserController from '../dao/controllers/UserController.js';
import { isValidPassword } from '../utils/funcionUtil.js';
import { generateToken, verifyToken } from '../middlewares/generateJWT.js';

const changePasswordRouter = Router();
const userController = new UserController();
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

changePasswordRouter.get('/', (req, res) => {
    res.render('forgot-password', {
        title: 'Change Password',
        style: 'forgotPassword.css',
    });
});

changePasswordRouter.post('/send-email', async (req, res) => {
    try {
        const { userEmail } = req.body;
        const user = await userController.getUserByEmail(userEmail);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        const token = generateToken(user._id);


        await transport.sendMail({
            from: 'Gon Gomez <gonzalomgomez5@gmail.com>',
            to: userEmail,
            subject: 'Restablecer Contraseña',
            html: `
                <div>
                    <h1>Restablecer Contraseña</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="http://localhost:8080/forgot-password/reset-password/${token}">Restablecer Contraseña</a>
                </div>`,
            attachments: [],
        });

        res.send({ status: 'success', message: 'Correo electrónico enviado para restablecer la contraseña' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Error al enviar el correo electrónico' });
    }
});
changePasswordRouter.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decodedToken = verifyToken(token);
        if (!decodedToken || !decodedToken.userId) {
            return res.status(400).send('Token inválido');
        }

        const user = await userController.getUserById(decodedToken.userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('reset-password', {
            title: 'Reset Password',
            style: 'forgotPassword.css',
            token: token,
            currentPassword: user.password,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor');
    }
});


changePasswordRouter.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const decodedToken = verifyToken(token);
        const user = await userController.getUserById(decodedToken.userId);

     if (!decodedToken || !decodedToken.userId) {
         return res.status(400).send('Token inválido');
     }
     if (decodedToken.exp < Date.now() / 1000) {
         return res.redirect('/forgot-password/expired');
     }
  
        if (isValidPassword(newPassword, user.password )) {
            return res.status(400).json({ error: 'La nueva contraseña no puede ser la misma que la actual. Vuelva a la pagina anterior.' });
        }        

        const result = await userController.updatePassword(user._id, newPassword);

        if (result) {
            res.send('Contraseña restablecida con éxito');
        } else {
            res.status(500).send('Error al restablecer la contraseña');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor');
    }
});
changePasswordRouter.get('/expired', (req, res) => {
    res.render('expired-token', {
        title: 'Token Expirado',
        style: 'expiredToken.css',
    });
});


export default changePasswordRouter;

