var express = require('express')
var userRouter = express.Router()
const { loginCheck } = require('../controller/user')
const { SuccessModel,ErrorModel } = require('../model/resModel')

// 这么凶？
userRouter.post('/login',function(req,res,next) {
    const { username,password } = req.body   //   这么秀?    post请求的其他 方式都可以进行解析
    
    const loginCheckResult = loginCheck(username,password)
    loginCheckResult.then(
        data=> {
            if(data.username) {
                req.session.username = data.username
                req.session.realname = data.realname
                res.json(
                    new SuccessModel(data,"登陆成功")
                )
            } else {
                res.json(
                    new ErrorModel(data,"登陆失败")
                )
            }
        }
    )
})
userRouter.get('/login-test', (req,res,next) => {
    if(req.session.username) {
        res.json({
            error: 0,
            msg: '登录成功'
        })
    } else {
        res.json({
            error: -1,
            msg:"登录失败"
        })
    }
})

// userRouter.get('/session-test',function(req,res,next) {
// console.log(req.session)

//     const session = req.session
//     if(session.ivew == null) {
//         session.ivew = 0
//     }

//     session.ivew++
//     res.json({
//         ivew: session.ivew
//     })
// })

module.exports = {
    userRouter
}