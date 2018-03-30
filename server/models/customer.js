const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    userName: {
        type: String
    },
    userPwd: {
        type: String
    }
})

module.exports = mongoose.model('Customers', customerSchema);