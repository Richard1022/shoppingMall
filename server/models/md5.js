const crypto = require('crypto');
module.exports = function (pwd) {
    let md5 = crypto.createHash('md5');
    let password = md5.update(pwd).digest('base64');
    return password;
}