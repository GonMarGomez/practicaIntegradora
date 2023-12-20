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
    async updatePassword(userId, newPassword) {
        try{
            const user = await userService.updatePassword(userId, newPassword);
            return user;
        }catch (err) {
            console.error('Error al cambiar el password', err);
            return null;
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const updateResult = await userService.updateUserRole(userId, newRole);
        } catch (err) {
            console.error('Error al cambiar el rol del usuario', err);
            return null;
        }
    }
    async updateUser(userId, field, newUpdate){
        try{ let result = await userService.updateUser(userId, field, newUpdate);
            return result}
        catch(error){
            console.error('No se puede actualizar el usuario', error)
            return null
        }
       
    };
 async updateDocuments (userId, documents){
    try{
        const updateResult = await userService.updateDocument(userId,documents);
    }
    catch(err){
        console.error('Error al agregar los documentos', err)
        return null;
    }
 }
}
export default UserController;