const express = require('express');
const app = express();
const router = require('./routers/router');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.json());
// app.use(cookieParser());
// 使用session
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 } }))

// 登录拦截
// app.use((req, res, next) => {
//     if (req.session.user) {
//         next()
//     } else {
//         // console.log(`url:${req.originalUrl}`);
//         if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/keepLogin' || req.originalUrl.indexOf('/goods') !== -1) {
//             next()
//         } else {
//             res.status(403).json('请先登录');
//         }
//     }
// })

app.get('/goods', router.showGoods);
app.post('/login', router.doLogin);
app.post('/register', router.doRegister);
app.get('/keepLogin', router.doKeepLogin);
app.get('/logoout', router.doLogoOut);
app.post('/addShopCart', router.doAdd);
// 获取购物车列表
app.get('/getCartList', router.showCartList);
// 修改购物车数量
app.put('/modifyNum', router.modifyNum);

app.delete('/remove/:productId',router.removeProduct)

app.listen(3000);

