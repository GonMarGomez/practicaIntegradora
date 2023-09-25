import { Router } from 'express';
import passport from 'passport';
import local from 'passport-local'

const userRouter = Router();
const localStratergy = local.Strategy;

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

  req.session.user = {
    first_name: req.user.first_name,
    last_name:req.user.last_name,
     email: req.user.email,
     age: req.user.age,
    }

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

export default userRouter;
