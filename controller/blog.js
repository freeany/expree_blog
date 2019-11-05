
const {exec,escape } = require('../db/mysql')

// 使用了xss包防止xss攻击 
const xss = require('xss')

// 定义处理获取所有的博客列表数据的函数
const getList = (keyWords,author) => {
    let sql = "select * from blogs where 1=1 "
    if(keyWords && keyWords != ' ') {
        sql += ` and title like '%${keyWords}%' `
    } 
    if(author) {
        sql += ` and author='${author}'`
    }
    return exec(sql)
}

// 定义处理获取指定id博客列表的数据的函数
const getDetail = (id) => {
    id = escape(id)
    let sql = `select * from blogs where id=${id}`
    return exec(sql)
}

// 定义处理添加博客的函数
// 防止博客标题与博客内容被xss攻击.
const createNewBlog = (author='',body = {}) => {
    // 做一些操作。。。将数据插入到数据库中
    
    let title = xss(body.title)
    let content = xss(body.content)
    let createtime = Date.now()

    title = escape(title)
    content = escape(content)
    author = escape(author)

    let sql = `insert into blogs(title,content,createtime,author) 
                    values(${title},${content},'${createtime}',${author})`
    return exec(sql)
}

// 定义处理更新博客的函数
const updateBlog = (id,body = {}) => {

    let title = body.title
    let content = body.content
    let createtime = Date.now()
    // let author = body.author    //更新的时候就不用传入作者属性值了。不可以更改作者了
    title = escape(title)
    content = escape(content)

    const sql = ` update blogs set title=${title}, content=${content}, 
                     createtime='${createtime}'  where id=${id} `

    // 做一些操作，将数据插入到数据库中
    return exec(sql)
}

// 定义删除博客的数据
// 传入两个数据，一个是要删除的博客的id，一个是作者。
// 为什么要传入作者呢？  因为作者是登录之后从session里面获取的。用户不可以输入，
// 如果有恶意用户使用接口删除数据的话，既要保证id，and 又要保证作者的信息。
const delBlog  = (id,author = '') => {
    author = escape(author)
        
    // 使用假数据   
    // author = 'lhr'
    const sql = ` delete from  blogs where id = ${id} and author = ${author}`
    return exec(sql)

}

// 因为要返回很多的数据，所以要用对象的形式去返回
module.exports = {
    getList,
    getDetail,
    createNewBlog,
    updateBlog,
    delBlog
}
