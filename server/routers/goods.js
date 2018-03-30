const mongoose = require('mongoose');
// 引入商品模型
const Goods = require('../models/goods');
// 引入用户模型
const Customers = require('../models/customer');
// 引入加密
const md5 = require('../models/md5');

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

exports.doLogin = (req, res, next) => {
    Customers.findOne({
        userName: req.body.name,
        userPwd: md5(req.body.pwd)
    }, (err, result) => {
        if (err) throw err;
        if (result) {
            req.session.user = result.userName;
            res.status(200).json(result);
        } else {
            res.status(402).json('用户名活密码错误');
        }
    })
}

exports.doRegister = (req, res, next) => {
    //1.判断用户名是否已经注册
    Customers.find({ userName: req.body.name }, (err, result) => {
        if (err) {
            res.status(502).end('数据库错误')
        } else {
            if (result.length) {
                res.status(202).json('当前用户名重复')
            } else {
                Customers.create({
                    userName: req.body.name,
                    userPwd: md5(req.body.pwd)
                }, (err, result) => {
                    if (err) throw err;
                    res.status(200).json(result);
                })
            }
        }
    })
}

exports.doKeepLogin = (req, res, next) => {
    // console.log(req.session);
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(201).json('当前未登录');
    }
}

exports.doLogoOut = (req, res, next) => {
    req.session.user = "";
    res.status(200).end();
}