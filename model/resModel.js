/* 
    一个数据模型   相当于返回给前台的一种标准数据模板

    所有的数据处理好之后，然后通过这一层将数据进行最后一次的格式化的组装。

    0209这里有问题，请解决
        已解决
*/

class BaseModel {
    // 正确的参数格式 data是一个对象，message是字符串信息
    constructor(data,message) {
        // 做一个兼容性处理，如果我这个数据中没有对象，只有字符串描述信息的话，也是可以的
        if(typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }

        if(data) {
            this.data = data
        }

        if(message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data,message) {
        super(data,message)
        this.error = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data,message) {
        super(data,message)
        this.error = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}