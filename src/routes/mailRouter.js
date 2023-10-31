import { Router } from 'express';
import nodemailer from 'nodemailer'
const mailRouter = Router();


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

mailRouter.get('/mail', async (req, res) => {

    try {
        const result = await transport.sendMail({
            from: 'Gon Gomez <gonzalomgomez5@gmail.com>',
            to: 'gonzygomez_cat@hotmail.com',
            subject: 'Correo de prueba',
            html: ` <div>
                        <h1>Esto es un test!</h1>
                        <p>Hola mundo</p>
                        <img src="cid:cheems"/>
                    </div>`,
            attachments: []
        });
    
        res.send({status: 'success', result});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({status: 'error', message: 'Error in send email!'});
    }
});

export default mailRouter;