import mongoose from "mongoose";

const productCollection = 'products';
const productSchema = new mongoose.Schema({
title: {
    type: String,
    requierd: true
},
description: {
    type: String,
    requierd: true
},
code: {
    type: String,
    requierd: true
},
price: {
    type: Number,
    requierd: true
},
status: {
    type: Boolean,
    requierd: true
},
stock: {
    type: Number,
    requierd: true
},
category: {
    type: String,
    requierd: true
},
thumbnails: {
    type: Array,
}
});
export const productModel = mongoose.model(productCollection, productSchema);