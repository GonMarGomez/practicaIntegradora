import { cartsService } from "../repository/index.js";

class CartController {

    async createCart() {
        const cart = {
            products: [],
        };
        
        try {
            const createCart = await cartsService.addCartToUser(cart);
            return createCart;
            } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
            }
    }
    async getCart(id) {
        try {
            const cart = await cartsService.findCartById({_id: id});

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

async getCartById(id) {
    try {
        const cart = await cartsService.popCartById(id);

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

    async addProductToCart(cartId, product, quantity) {
        try {
            const cart = await cartsService.findCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return;
            }
            const existingProduct = cart.products.find(item => item.product.toString() === product[0]._id.toString());
    
            if (existingProduct) {
                await cartsService.addExistingProduct(cartId, product, existingProduct);
            } else {
                await cartsService.addNewProduct(cartId, product, quantity);
            }
        } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
        }
    }

    async updateCart(cartId, newCart) {
        try {
            const cart = await cartsService.findCartById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            await cartsService.modifyCart(cartId, newCart);
    
            return { message: 'Carrito actualizado correctamente' };
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
        }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartsService.findCartById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            const productToUpdate = cart.products.find(item => item.product.toString() === productId);
            if (!productToUpdate) {
                return { error: 'Producto no encontrado en el carrito' };
            }
            await cartsService.modifyQuantity(cartId, productId, newQuantity);
    
            return { message: 'Cantidad de ejemplares actualizada correctamente' };
        } catch (error) {
            console.error('Error al actualizar la cantidad de ejemplares del producto en el carrito:', error);
        }
    }

    async deleteProductFromCart(cartId, productId){
        try {
            console.log('Cart ID in deleteProductFromCart:', cartId);
            console.log('Product ID in deleteProductFromCart:', productId);
            
            const cart = await cartsService.findCartById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
            
            const productToRemove = cart.products.find(item => item.product.toString() === productId);
            if (!productToRemove) {
                return { error: 'Producto no encontrado en el carrito' };
            }
    
            await cartsService.deleteOneProduct(cartId, productId);
    
            return { message: 'Producto eliminado del carrito correctamente' };
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await cartsService.findCartById(cartId)
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            if (cart.products.length === 0) {
                return { error: 'El carrito ya esta vacío' };
            }

            await cartsService.deleteAllProducts(cartId);
    
            return { message: 'Todos los productos han sido eliminados del carrito correctamente' };
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
        }
    }
}

    export default CartController;