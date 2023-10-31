import passport from 'passport';
import local from 'passport-local'
import {userModel} from "../dao/models/userModel.js";
import GitHubStrategy from 'passport-github2'
import dotenv from 'dotenv'

import cartDBController from '../dao/controllers/CartController.js';
import { createHash, isValidPassword } from "../utils/funcionUtil.js";

dotenv.config()


const localStratergy = local.Strategy;
const initializatePassport = () => {
  passport.use('register', new localStratergy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
      try {
        const cartManager = new cartDBController();
        const cart = await cartManager.createCart();
        let user = await userModel.findOne({ email: username })
        if (user) {
          console.log('User alredy exists');
          return done(null, false);
        }

        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password), role: 'user',
          cart: [cart._id]
        };
        let result = await userModel.create(newUser)
        return done(null, result)
      }
      catch(error) {
        return done('Error al registrar usuario:' + error)
      }
    }
  ))

  passport.use('login', new localStratergy({ usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.log('User does not exist');
          return (null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user)
      }
      catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  })

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'

  },
    async (accessToken, refreshToken, profile, done) => {
      try {
      
        let user = await userModel.findOne({ username: profile._json.login })
        if (!user) {
          let nombreCompleto = profile._json.name;
          let nombreSeparado = nombreCompleto.split(' ')
          let newUser = {
            first_name: nombreSeparado[0],
            last_name: nombreSeparado[1],
            email: profile._json.email,
            password: '',
            role: 'user'
          }
          let result = await userModel.create(newUser);
          done(null, result)
        }
        else {
          done(null, user);
        }
      }
      catch (error) {
        return done(error)
      }
    }))
}
export default initializatePassport;