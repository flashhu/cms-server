class HttpException extends Error {
    constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
        super()
        this.code = code
        this.errorCode = errorCode
        this.msg = msg
    }
}

class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 400
        this.errorCode = errorCode || 10000
        this.msg = msg || '参数错误'
    }
}

class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 201
        this.errorCode = errorCode || 0
        this.msg = msg || 'ok'
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success
}