import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const productCollection = 'products';
const productSchema = new mongoose.Schema({
title: {
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},
code: {
    type: String,
    required: true
},
price: {
    type: Number,
    required: true
},
status: {
    type: Boolean,
    required: true
},
stock: {
    type: Number,
    required: true
},
category: {
    type: String,
    required: true
},
thumbnails: {
    type: Array,
}, owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: 'admin'
},
},{ toObject: { getters: true, virtuals: true }, versionKey: false, minimize: false, lean: true });
productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productCollection, productSchema);