const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    username: {
        type: String, ref:'User', required: true, 
    },
    title: {
        type: String, required: true, minlength: 3
    },
    description: {
        type: String, required: true,
    },
    category: {
        type: String, required: true, 
    },
    shipping: {
        type: String, required: true, 
    },
    city: {
        type: String, required: true, 
    },
    district: {
        type: String,  required: true, 
    },
    productPicture: {
        type: String,  
    },

}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;