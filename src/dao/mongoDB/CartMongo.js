import { cartModel } from "../models/cartModel.js";

export default class Carts {

    createCart = async (cart) => {
        let result = await cartModel.create(cart);
        return result
    };
    getCartById = async (_id) => {
        let result = await cartModel.find({_id}).populate('products.product')
        return result;
    };
    updateExistingProduct = async (cartId, product, existingProduct) => {
        const result = await cartModel.updateOne(
            { _id: cartId, 'products.product': product[0]._id },
            { $set: { 'products.$.quantity': existingProduct.quantity + 1 } }
        );
        return result;
    }
    findCart = async (_id) => {
        let result = await cartModel.findById(_id);
        return result;
    }
    updateNewProduct = async (cartId, product, quantity) => {
        const result = await cartModel.updateOne(
            { _id: cartId },
            { $push: { products: { product: product[0], quantity: quantity } } }
        );
        return result;
    }

    updateCart = async (cartId, newCart) => {
        const result = await cartModel.updateOne(
            { _id: cartId },
            { $set: { products: newCart.products } }
        );
        return result;
    }

    updateQuantity = async (cartId, productId, newQuantity) => {
        const result = await cartModel.updateOne(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': newQuantity } }
        );
        return result;
    };

      removeOneProduct = async (cartId, productId) => {
        const result = await cartModel.updateOne(
            { _id: cartId },
            { $pull: { products: { product: productId } } }
        );
        return result;
    }

    removeAllProducts = async (cartId) => {
        const result = await cartModel.updateOne(
            { _id: cartId },
            { $set: { products: [] } }
        );
        return result;
    }
    populateCart = async (_id) => {
        let result = await cartModel.find(_id).populate('products.product');
        return result;
    }
}