import { ticketModel } from "../models/ticketsModel.js";

export default class Message {
    getTicket = async (_id) => {
        let result = await ticketModel.find(_id);
        return result;
    }

    createTicket = async (data) => {
        let result = await ticketModel.create(data);
        return result;
    }

    deleteTIcket = async (data) => {
        let result = await ticketModel.delete(data);
        return result;
    }

    generateUniqueTicketCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueCode = '';
    
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueCode += characters.charAt(randomIndex);
        }
    
        return uniqueCode;
    }
}