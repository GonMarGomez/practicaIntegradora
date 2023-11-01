import { Router } from 'express';
import UserDTO from '../dao/DTOs/userDTO.js';
import passport from 'passport';
import local from 'passport-local'
import UserController from '../dao/controllers/UserController.js';

const userRouter = Router();
const localStratergy = local.Strategy;
const userController = new UserController()

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

export default userRouter;
