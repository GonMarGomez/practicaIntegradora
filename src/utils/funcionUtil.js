import bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (inputPassword, hashedPassword) => {
    return bcrypt.compareSync(inputPassword, hashedPassword);
}
export const canDeleteProduct = (userRole, userEmail, ownerProduct) => {
    if (userRole === 'admin' || userRole === 'premium') {
      return userEmail === ownerProduct.email;
    }
  return false;
};