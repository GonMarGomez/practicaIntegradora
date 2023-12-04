export default class CartRepository {
    constructor (dao){
        this.dao = dao;
    }

    addCartToUser = async (data) => {
        let result = await this.dao.createCart(data);
        return result
    }

    findCartById = async (_id) => {
        let result = await this.dao.findCart(_id);
        return result
    }

    addExistingProduct = async (cartId, product, existingProduct) => {
        let result = await this.dao.updateExistingProduct(cartId, product, existingProduct);
        return result
    }

    addNewProduct = async (cartId, product, quantity) => {
        let result = await this.dao.updateNewProduct(cartId, product, quantity);
        return result
    }

    modifyCart = async (cartId, newCart) => {
        let result = await this.dao.updateCart(cartId, newCart);
        return result
    }

    modifyQuantity = async (cartId, productId, newQuantity) => {
        let result = await this.dao.updateQuantity(cartId, productId, newQuantity);
        return result
    }

    deleteOneProduct = async (cartId, productId) => {
        let result = await this.dao.removeOneProduct(cartId, productId);
        return result
    }

    deleteAllProducts = async (cartId) => {
        let result = await this.dao.removeAllProducts(cartId);
        return result
    }
// En tu cartsService
async popCartById(id) {
    try {
        const cart = await this.dao.findCart(id);
        return cart;
    } catch (error) {
        console.error('Error al buscar el carrito:', error);
        return null;
    }
}

}