const { HttpException } = require('../core/http-exception')

// 全局异常处理函数
const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        if (error instanceof HttpException) {
            // 已知错误
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.code
        }
    }
}

module.exports = catchError