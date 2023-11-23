import { userModel } from "../models/userModel.js";
import { createHash } from "../../utils/funcionUtil.js";

export default class Users {

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

    updateRole = async (userId, newRole) =>{
        let result = await userModel.updateOne(
            { _id: userId },
            { $set: { role:newRole}},
        );
        console.log("Soy Update result:", result);
        return result;
    } 
}
