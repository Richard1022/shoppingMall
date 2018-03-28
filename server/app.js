const express = require('express');
const app = express();
const router = require('./routers/goods');

app.get('/goods', router.showGoods);

app.listen(3000);

