import UserDTO from "../DTOs/userDTO.js";

export default class UserRepository {
    constructor (dao){
        this.dao = dao;
    };
    getAllUsers = async () => {
        const users = await this.dao.getAllUsers();
        return users;
    };
    getUser = async (data) => {
        let result = await this.dao.findByEmail(data);
        return result
    };

    createNewUser = async (data) => {
        let result = await this.dao.createUserDB(data);
        return result
    };

    searchUser = async (query) => {
        let result = await this.dao.findUserByQuery(query);
        return result
    };

    showUser = async (data) => {
        let result = new UserDTO(data);
        return result
    };
    getById = async(data)=>{
        let result = this.dao.findUserById(data);
        return result
    };
    addTicketToUser = async (userId, ticket) => {
        let result = await this.dao.addTicket(userId, ticket);
        return result
    };
    removeTicketFromUser = async (userId) => {
        let result = await this.dao.removeTicket(userId);
        return result
    };
    updatePassword = async (userId, password) => {
        let result = await this.dao.updatePassword(userId, password);
        return result
    };
    updateUserRole = async (userId, newRole) => {
        let result = await this.dao.updateRole(userId, newRole);
        return result
    };
    updateUser = async (userId, field, newUpdate) =>{
        let result = await this.dao.updateUser(userId, field, newUpdate);
        return result
    };
    updateDocument = async (userId, document) =>{
        let result = await this.dao.updateDocuments(userId, document);
        return result
    };
    findInactiveUsers = async () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const inactiveUsers = await this.dao.findInactiveUsers(twoDaysAgo);
        return inactiveUsers;
    };
    
    deleteUser = async (userId) => {
        try {
            const result = await this.dao.deleteUser(userId);
            return result;
        } catch (error) {
            console.error('Error al eliminar usuario desde el repositorio:', error);
            throw error;
        }
    };

    deleteInactiveUsers = async () => {
        const deletedCount = await this.dao.deleteInactiveUsers();
        return deletedCount;
    };
}

