const Router = require('koa-router')
const { TokenValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { ParameterException } = require('../../../core/httpException')

const router = new Router({
    prefix: '/v1/token'
})

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)

}

/**
 * 用户登录
 * @param {string} account 登录账号，对应注册邮箱
 * @param {string} secret 可选项（验证方式不同）
 * @param {number} type 验证类型
 */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    // type
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            emailLogin(v.get('body.email'), v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:

            break;
        default:
            throw new ParameterException('没有相应的处理函数')
    }
})

module.exports = router