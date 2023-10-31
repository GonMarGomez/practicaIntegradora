export default class MessageRepository {
    constructor (dao){
        this.dao = dao;
    }

    getAllChats = async () => {
        let result = await this.dao.getAllMessages();
        return result
    }

    saveChat = async (data) => {
        let result = await this.dao.createChat(data);
        return result
    }
}