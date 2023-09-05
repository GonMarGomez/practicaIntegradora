import { productModel } from "../modules/productModel";
import { cartModel } from "../modules/cartModel";

class CartManager {

    async createCart() {
        const cart = {
            products: [],
        };
        
        try {
            const createCart = await cartModel.create(cart);
            return createCart;
            } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
            }
    }

    async getCartById(_id) {
        try {
            const cart = await cartModel.find({_id});

            if (cart) {
                return cart;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
        const cart = await cartModel.find({_id:cartId});
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }

        const product = await productModel.find({_id:productId});
        const productToAdd = product[0]._id.toString();

        cart[0].products.push({product:productToAdd});

        await cartModel.updateOne({ _id: cartId },{ $push: { products: { product: productToAdd } } });
        
        } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
        }
    }
}

    export default CartManager;