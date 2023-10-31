import { userService } from '../repository/index.js';
import {createHash, isValidPassword} from '../../utils/funcionUtil.js'

class UserController {

    async createUser(user) {
        try {
            user.password = createHash(user.password);
           return await userService.createNewUser(user);
        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

    async login(email, password) {
        try {
            const user = await userService.getUser({email: email});

            if (user.length > 0 && isValidPassword(user[0], password)) {
                return user[0];
            }
            
            throw new Error('Login failed');

        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }
    async getUserByEmail(email) {
      try {
          const user = await userService.getUser(email);

          if (user) {
              return user;
          } else {
              console.error('Usuario no encontrado');
              return null;
          }
      } catch (err) {
          console.error('Error al leer el archivo de usuarios:', err);
          return null;
      }
  }
      async getUserById(_id) {
        try {
          const user = await userService.getById(_id );
          return user;
        } catch (error) {
          throw error;
        }
      }
      async getByQuery(query) {
        try {
          const user = await userService.searchUser( query);
          return user;
        } catch (error) {
          throw error;
        }
      }
      async showCurrentUser(data) {
        try {
            const user = await userService.showUser(data);
            return user;
        }catch (err) {
            console.error('Error al buscar usuario:', err);
            return null;
        }
    }

}
export default UserController;