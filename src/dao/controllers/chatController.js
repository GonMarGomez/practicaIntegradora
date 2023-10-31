import { chatsService } from "../repository/index.js";
class ChatController {

    async getChats() {
        const chats = await chatsService.getAllChats();
        
        if (chats.length < 1) {
            return [];
        }else{
            try {
            return chats;
            } catch (err) {
            console.error('Error al leer el archivo de mensajes:', err);
            return [];
            }}
        }

    async saveChat(data){
        const chats = await chatsService.saveChat(data);

        return chats;
    }
}

    export default ChatController;