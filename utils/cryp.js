/* 
    使用md5进行加密
*/
const crypto = require('crypto')

// 设置密匙
const SECRET_KEY = 'QWas$_1912#'

// 定义加密函数         将传入的参数加密进行md5加密，将加密好的数据进行返回
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')    
}

//  获取密码，将密码进行加密
function genPassword(password) {
    const str = `password=${password}&&key=${SECRET_KEY}`
    return md5(str)
}

module.exports= {
    genPassword
}