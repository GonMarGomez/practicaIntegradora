import { userModel } from "../models/userModel.js";
import { createHash } from "../../utils/funcionUtil.js";

export default class Users {

    getAllUsers = async () => {
        const result = await userModel.find({});
        return result;
    }
    findByEmail = async (email) => {
        const normalizedEmail = String(email).toLowerCase();
        const result = await userModel.findOne({ email: normalizedEmail }).populate({
            path: 'cart.cartInfo',
            populate: {
                path: 'products.product'
            }
        }).populate({
            path: 'ticket.ticketInfo', 
            model: 'tickets' 
        });
        return result;
    }
    
    findUserById = async (_id) => {
        const result = await userModel.findOne({_id});
        return result;
    }

    findUserByQuery = async (query) => {
        const result = await userModel.findOne(query);
        return result;
    }
    addTicket = async (userId, ticketId) => {
        let result = await userModel.updateOne(
            { _id: userId},
            { $set: { ticket: { ticketInfo: ticketId } } },
        );
        return result;
    }
    removeTicket = async (userId) => {
        let result = await userModel.updateOne(
            { _id: userId },
            { $set: { ticket: [] } },
        );
        return result;
    }
    updatePassword = async (userId, newPassword) =>{
        let hashedPassword = createHash(newPassword)
        let result = await userModel.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword}},
        );
        return result;
    } 
    updateUser = async (userId, field, newUpdate) => {
        let updateObject = {};
        updateObject[field] = newUpdate;
      
        let result = await userModel.updateOne(
          { _id: userId },
          { $set: updateObject }
        );
      
        return result;
      };
       updateDocuments = async (userId, document) => {
          const result = await userModel.updateOne(
            { _id: userId },
            { $push: { documents: document } }
          );
      
          return result;
      };
       

    updateRole = async (userId, newRole) =>{
        let result = await userModel.updateOne(
            { _id: userId },
            { $set: { role:newRole}},
        );
        return result;
    } 
    findInactiveUsers = async (lastConnectionThreshold) => {
        const result = await userModel.find({ last_connection: { $lt: lastConnectionThreshold } });
        return result;
    }

    deleteInactiveUsers = async () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
        const result = await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        return result.deletedCount;
    };
    deleteUser = async (userId) => {
        try {
            const result = await userModel.deleteOne({ _id: userId });
            return result;
        } catch (error) {
            throw error;
        }
    };
    
}
