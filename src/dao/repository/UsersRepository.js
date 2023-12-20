import UserDTO from "../DTOs/userDTO.js";

export default class UserRepository {
    constructor (dao){
        this.dao = dao;
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
}

