import { productModel } from "../models/productModel.js";
import UserDTO from "../DTOs/userDTO.js";
import mongoose from 'mongoose';

export default class Products {

    createProduct = async (product, user) => {
        product.owner = user._id
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