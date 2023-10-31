export default class TicketRepository {
    constructor (dao){
        this.dao = dao;
    }

    getTicketOneId = async (_id) => {
        let result = await this.dao.getTicket(_id);
        return result
    }
    
    saveTicket = async (ticketDataArray, email, userId) => {
        let data = {
            code: await this.dao.generateUniqueTicketCode(),
            amount: ticketDataArray.reduce((total, productData) => total + productData.amount, 0),
            purchaser: email,
        };
        let ticketData = await this.dao.createTicket(data);
        return ticketData;
    }

}
