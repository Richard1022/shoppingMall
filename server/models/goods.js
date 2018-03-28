const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    "productId": {
        type: String
    },
    "productName": {
        type: String
    },
    "salePrice": {
        type: Number
    },
    "productImage": {
        type: String
    },
    "productUrl": {
        type: String
    }
})

module.exports = mongoose.model('Goods', productSchema)