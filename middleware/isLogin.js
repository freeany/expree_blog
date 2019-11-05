const { ErrorModel } = require('../model/resModel')

// 写一个登录验证的中间件
// 中间件 的 基本形态
module.exports = (req,res,next) => {
    if(req.session.username) {
        
        next()
        return
    }
    res.json(
        new ErrorModel("尚未登陆")
    )
}

/* 
    中间件要使用在处理    路由的        参数中
*/
