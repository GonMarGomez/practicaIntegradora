import { ticketsService, productService, cartsService, userService } from "../repository/index.js";

class TicketController {

    async getTicketById(_id) {
        try{
            const ticket = await ticketsService.getTicketOneId(_id)

            if (ticket) {
                return ticket;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        } catch (err) {
            console.error('Error al leer el archivo de tickets:', err);
            return null;
        }        
    }

    async generateTicket(_id, email, userId) {
        try {
          const cart = await cartsService.findCartById(_id);
      
          if (!cart) {
            throw new Error('Carrito no encontrado');
          }
      
          const {
            productsAvailable,
            productsNotAvailable,
            ticketDataArray
          } = await productService.processProducts(cart);
      
          if (productsNotAvailable.length > 0) {
            console.error(`No hay stock para estos productos: ${productsNotAvailable}`);
          }
      
          if (productsAvailable.length > 0) {
            const ticket = await ticketsService.saveTicket(ticketDataArray, email);
      
            // Ahora, agregamos el ticket al usuario
            await userService.addTicketToUser(userId, ticket._id);
      
            for (const product of productsAvailable) {
              await cartsService.deleteOneProduct(cart, product.productId);
            }
          } else {
            console.error(`No hay productos para facturar`);
          }
        } catch (error) {
          console.error('Error al generar el ticket:', error);
          throw error; // Propagar el error para que pueda ser manejado en el nivel superior si es necesario.
        }
      }
      

    async deleteTicketFromUser (userId){
        await userService.removeTicketFromUser(userId);
    }
}

    export default TicketController;