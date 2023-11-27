import { productModel } from "../models/productModel.js";

export default class Products {

    createProduct = async (product, user) => {
        if (!user || (user.role !== 'premium' && user.role !== 'admin')) {
            throw new Error('Solo los usuarios premium o admin pueden crear productos');
        }
        product.owner = user.email;
        let result = await productModel.create(product);
        return result;
    };
    paginateProducts = async (filter, options) => {
        let result = await productModel.paginate(filter, options);
        return result;
    };
    getProdById = async (_id) => {
        let result = await productModel.find(_id).lean()
        return result;
    };
    updateProduct = async (_id, update) => {
        let result = await productModel.updateOne({ _id }, update)
        return result;
    };
    deleteProduct = async (_id) => {
        let result = await productModel.deleteOne(_id);
        return result;
    };
}