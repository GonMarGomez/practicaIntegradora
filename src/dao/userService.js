import userModel from '../modules/userModel.js';
import CartManager from './cartDBService.js';
import {createHash, isValidPassword} from '../utils/funcionUtil.js'

class UserService {

    async createUser(user) {
        try {
            const cartManager = new CartManager();
            const cart = await cartManager.createCart();
            user.cart = cart._id;
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
export default UserService;