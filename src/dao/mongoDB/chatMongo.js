import { messageModel } from "../models/chatModel.js";

export default class Chat {
    getAllMessages = async () => {
        try {
            const result = await messageModel.find();
            return result;
        } catch (err) {
            console.error('Error al obtener mensajes:', err);
            return [];
        }
    }

    createChat = async (data) => {
        let result = await messageModel.create(data);
        return result;
    }
}