import { Router } from 'express';
import util from 'util'
import {format} from 'date-fns'
import UserDTO from '../dao/DTOs/userDTO.js';
import passport from 'passport';
import local from 'passport-local'
import {uploader} from '../utils/multerUtil.js'
import __dirname from '../utils/constantUtils.js';
import UserController from '../dao/controllers/UserController.js';
import { authorization } from '../utils/authorization.js';

const userRouter = Router();
const localStratergy = local.Strategy;
const userController = new UserController()

userRouter.post('/:uid/documents', uploader.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { uid } = req.params;
    const fileType = req.body.fileType;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const document = {
      name: file.originalname,
      reference: `${__dirname}/../public/img/${fileType}/${file.filename}`
    };
    await  userController.updateDocuments(uid, document);

    return res.status(201).json({
      status: 'success',
      message: 'User successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

userRouter.post('/register', passport.authenticate(
  'register', { failureRedirect: '/api/sessions/failRegister' }
), (req, res) => {
  res.redirect('/login');
}
);
userRouter.get("/failRegister", (req, res) => {
  console.log('Failded Stratergy');
  res.redirect('/register');
});
userRouter.post('/login', passport.authenticate(
  'login', { failureRedirect: '/api/sessions/failLogin' }
), async (req, res) => {
  if(!req.user){
    return res.status(400).send({status: 'error', error: 'Invalid Credentials'})
  }
  let userId = req.user._id
  const lastConnection = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  let toUpdate = 'last_connection'
  await userController.updateUser(userId,toUpdate, lastConnection)

  req.session.user = new UserDTO(req.user)
    res.redirect('/products');
}
);
userRouter.get("/failLogin", (req, res) => {
  console.log('Failded Stratergy');
  res.send({
      status: 'error',
      message: 'Failed Login'
  });
});

userRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});
userRouter.get('/github', passport.authenticate('github',{scope: ['user:email']}),(req,res)=>{
 res.send({
  status: 'success',
  message: 'success'
 });
});
userRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/api/sessions/login'}),(req,res)=>{
  req.session.user = req.user;
  res.redirect('/products')
 });

 userRouter.get('/current', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: 'error',
      message: 'No hay usuario autenticado',
    });
  }
  const usuarioAutenticado = req.user;

  const user = await userController.showCurrentUser(usuarioAutenticado)

  return res.json({
    status: 'success',
    payload: user,
  });
});

userRouter.put('/premium/:uid', async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userController.getUserById(userId);

    if (!user) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    if (!user.documents || user.documents.length < 3) {
      return res.status(400).send({ error: 'El usuario debe cargar los documentos necesarios antes de cambiar a premium' });
    }

    const newRole = user.role === 'user' ? 'premium' : 'user';
    await userController.updateUserRole(userId, newRole);

    res.send({ message: `Rol del usuario ${userId} cambiado a ${newRole}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});


export default userRouter;
