const express = require('express');
const app = express();
const router = require('./routers/goods');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.json());
// app.use(cookieParser());
// 使用session
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 } }))

app.get('/goods', router.showGoods);
app.post('/login', router.doLogin);
app.post('/register', router.doRegister);
app.get('/keepLogin', router.doKeepLogin);
app.get('/logoout', router.doLogoOut);
app.listen(3000);

