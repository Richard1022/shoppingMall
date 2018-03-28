const mongoose = require('mongoose');
const Goods = require('../models/goods');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');
// 监听数据库链接
mongoose.connection.on('connected', () => {
    console.log('MongoDb connected success');
})
mongoose.connection.on('error', () => {
    console.log('MongoDb connected error');
})
mongoose.connection.on('disconnected', () => {
    console.log('MongoDb connected disconnected');
})

exports.showGoods = (req, res, next) => {
    let { page, pagesize, sort, priceGt, priceIt } = req.query
    let skip = (page - 1) * pagesize;
    let query = req.query;
    let params;
    if (priceGt && priceIt) {
        params = {
            salePrice: {
                $gte: priceGt,
                $lte: priceIt
            }
        }
    } else {
        params = {}
    }
    let goodsModel = Goods.find(params).skip(skip).limit(parseInt(pagesize));
    sort && goodsModel.sort({ 'salePrice': sort });
    goodsModel.exec((err, result) => {
        if (err) {
            res.status(501).json({
                msg: err.message
            })
        } else {
            res.status(200).json({
                msg: '',
                count: result.length,
                data: result
            })
        }
    })
}