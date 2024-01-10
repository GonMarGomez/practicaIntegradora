import nodemailer from 'nodemailer';
import { userService } from '../repository/index.js';
import UserDTO from '../DTOs/userDTO.js'

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
    mapUsersToDTO = (users) => {
        return users.map(user => new UserDTO(user));
    }
    async getAllUsers() {
        try {
            const users = await userService.getAllUsers();
            const usersWithMainData = this.mapUsersToDTO(users);
            return usersWithMainData;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
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
 
 async deleteInactiveUsers() {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const inactiveUsers = await userService.findInactiveUsers();

        const emailPromises = inactiveUsers.map(async (user) => {
            await transport.sendMail({
                from: 'Gon Gomez <gonzalomgomez5@gmail.com>',
                to: user.email,
                subject: 'Cuenta Eliminada por Inactividad',
                html: `
                    <div>
                        <h1>Cuenta Eliminada por Inactividad</h1>
                        <p>Tu cuenta ha sido eliminada debido a la inactividad.</p>
                    </div>`,
            });
        });
        await Promise.all(emailPromises);
        const deletedCount = await userService.deleteInactiveUsers();
        return {
            deletedCount,
            inactiveUsers,
        };
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        throw error;
    }
}
async deleteUser(userId) {
    try {
        const result = await userService.deleteUser(userId);
        return result;
    } catch (error) {
        console.error('Error al eliminar usuario desde el controlador:', error);
        throw error;
    }
}
}
export default UserController;