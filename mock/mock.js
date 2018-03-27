const express = require('express');

const app = express();

app.get('/goods', (req, res, next) => {
    res.json(require('./goods.json'))
})

app.listen(8787);


