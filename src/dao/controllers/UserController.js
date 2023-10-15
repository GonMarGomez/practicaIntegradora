import userModel from '../models/userModel.js';
import {createHash, isValidPassword} from '../../utils/funcionUtil.js'

class UserController {

    async createUser(user) {
        try {
            user.password = createHash(user.password);
           return await userModel.create(user);
        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

    async login(email, password) {
        try {
            const user = await userModel.find({email: email});

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
          const user = await userModel.find({ email }).populate('cart');
          return user;
        } catch (error) {
          throw error;
        }
      }

}
export default UserController;