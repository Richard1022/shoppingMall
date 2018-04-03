
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

exports.doAdd = (req, res, next) => {
    Customers.findOne({ userName: req.session.user }, (err, result) => {
        if (err) throw err;
        let addItem = req.body.params
        if (result) {
            if (result.carList.length) {
                let includeCar = false;
                for (let [index, item] of result.carList.entries()) {
                    if (item.productId === addItem.productId) {
                        result.carList[index].productNum++;
                        includeCar = true;
                        break;
                    }
                }
                if (!includeCar) {
                    result.carList.push(addItem);
                }
            } else {
                result.carList.push(addItem);
            }
            result.save((err, cb) => {
                if (err) throw err;
                res.status(200).json(result.carList);
            })
        } else {
            res.status(202).json('当前用户不存在')
        }
    })
}

// 获取用户购物车列表
exports.showCartList = (req, res, next) => {
    if (req.session.user || req.query.name) {
        Customers.findOne({ userName: req.query.name }, (err, result) => {
            if (result) {
                res.status(200).json(result.carList);
            } else {
                res.json(`当前用户${req.query.name}不存在`);
            }
        })
    }
}
// 修改数量
// methods:puts
// params: {
//     productId: 商品ID
//     type: 'plus'/'subtract' (加/减)
// }
exports.modifyNum = (req, res, next) => {
    if (req.session.user || req.query.name) {
        let params = req.body;
        Customers.findOne({ userName: req.query.name }, (err, result) => {
            let arr = [];
            let saveSign = result.carList.some((item) => {
                return item.productId === params.productId;
            });
            if (saveSign) {
                result.carList.forEach((item, index, self) => {
                    if (item.productId === params.productId) {
                        params.type === 'plus' ? item.productNum++ : item.productNum--;
                        if (item.productNum <= 0) {
                            self.splice(index, 1);
                        }
                    }
                })
                result.save((err, cb) => {
                    if (err) throw err;
                    res.json(result);
                })
            } else {
                res.json(`当前商品不存在${params.productId}`)
            }
        })
    }
}

exports.removeProduct = (req, res, next) => {
    let productId = req.params.productId;
    if (req.session.user || req.query.name) {
        Customers.findOne({ userName: req.query.name }, (err, result) => {
            if (result) {
                if (result.carList.some(item => item.productId === productId)) {
                    result.carList.map((item, index, self) => {
                        if (item.productId === productId) {
                            self.splice(index, 1);
                        }
                    })
                    result.save((err, cb) => {
                        res.json(result);
                    })
                } else {
                    res.json(`当前商品${productId}不在购物车里`)
                }
            }
        })
    }
}