var express = require('express')
var blogRouter = express.Router()

// 接收controller返回的数据
const { getList,getDetail,createNewBlog,updateBlog,delBlog } = require('../controller/blog')
const { SuccessModel,ErrorModel } = require('../model/resModel')

// 引入判断是否登陆的中间件
const isLogin = require('../middleware/isLogin')

blogRouter.get('/get/list',function(req,res,next) {

    // 判断是否登录，如果登录了则强制只能只能查询自己的博客。
    // 通过query中是否isadmin参数判断是否是进入管理员页面,因为进入管理员页面要发送请求进行渲染博客数据
    // 如果进入了管理员页面，则判断是否登录，如果req.session_data中没有username，则没有登录。

    if(req.query.isadmin) {
        // 自定义日志
        console.log("is admin  gogogo")
        if(!req.session.username) {
            console.log("is admin but no login")
            res.json(
                new ErrorModel('未登陆')
            )
            return
        } 

        author = req.session.username
    }
    const keyWords = req.query.keyWords || ''
    const getListResult = getList(keyWords,author)
    getListResult.then(
        data => {
            res.json(
                new SuccessModel(data,"获取博客列表成功")
            )
        }
    )
})

blogRouter.get('/detail',(req,res,next) => {
    const id = req.query.id
    if(id) {
        const getDetailResult = getDetail(id)

        getDetailResult.then(
            data => {
                res.json(
                    new SuccessModel(data,"获取单个列表成功")
                )
            }
        )
    } else {
        res.json({
            errno: 404,
            msg: "请求错误"
        })
    }
    
})

blogRouter.post('/new',isLogin,(req,res,next) => {

    const author = req.session.username
    const createNewBlogResult = createNewBlog(author,req.body)

    createNewBlogResult.then(
        data => {
            let id = data.insertId
            if(id>0) {
                res.json(
                    new SuccessModel(data,'新增成功,id为'+id)
                )
                return
            }
            res.json(
                new ErrorModel(data,"新增失败")
            )
        }
    )
})

blogRouter.post('/update',isLogin,(req,res,next) => {
    let id = req.query.id

    const updateBlogResult = updateBlog(id,req.body)
    updateBlogResult.then(
        data => {
            if(data.affectedRows) {
                res.json(
                    new SuccessModel(data,"修改成功")
                )
                return 
            }

            res.json(
                new ErrorModel(data,"更新成功")
            )
        }
    )
})

blogRouter.post('/del',isLogin,(req,res,next) => {
    let id = req.query.id
    let author = req.session.username
    if(!id) {
        res.json(
            new ErrorModel("没有id，删除失败")
        )
        return
    }

    const delBlogResult = delBlog(id,author)
    delBlogResult.then(
        data => {
            if(data.affectedRows > 0) {
                res.json(
                    new SuccessModel(data,"删除成功")
                )
            } else {
                res.json(
                    new ErrorModel(data,"删除失败")
                )
            }
        }
    )
})

module.exports = {
    blogRouter
}
