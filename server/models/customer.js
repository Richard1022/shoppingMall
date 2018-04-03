const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    userName: {
        type: String
    },
    userPwd: {
        type: String
    },
    carList: [
        {
            productId: String,
            productName: String,
            salePrice: String,
            productImage: String,
            checked: String,
            productNum: String
        }
    ]
})

module.exports = mongoose.model('Customers', customerSchema);