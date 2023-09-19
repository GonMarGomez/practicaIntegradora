import { Router } from 'express';
import UserService from '../dao/userService.js';

const US = new UserService();
const userRouter = Router();

userRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isAdmin = email === 'adminCoder@acoder.com' && password === 'adminCod3r123';
    const role = isAdmin ? 'Admin' : 'Usuario';
    await US.createUser({ ...req.body, role });
    req.session.registerSuccess = true;
    res.redirect('/login');
  } catch (error) {
    req.session.registerFailed = true;
    res.redirect('/register');
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminCredentials = {
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
    };
    if (email === adminCredentials.email && password === adminCredentials.password) {
        req.session.user = {
            first_name: 'Admin', 
            last_name: 'Coder',
            email: adminCredentials.email,
            age: 0,             
            role: 'admin',      
        };
        req.session.loginFailed = false;
        res.redirect("/products");  
    }else{
        const { first_name, last_name, age, role } = await US.login(email, password);

        req.session.user = { first_name, last_name, email, age, role };
        req.session.loginFailed = false;
        res.redirect("/products");
    }
} catch (error) {
    req.session.loginFailed = true;
    req.session.registerSuccess = false;
    res.redirect("/login");
}
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
  
export default userRouter;
