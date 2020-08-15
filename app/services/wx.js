const util = require('util')
const axios = require('axios')
const { AuthFailed } = require('../../core/httpException')
const { User } = require('../models/user')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')

class WXManager {
    static async codeToToken(code) {
        // 1. 拿 openid (机密 偏长 不做主键)
        const url = util.format(
            global.config.wx.loginUrl,
            global.config.wx.appId,
            global.config.wx.appSecret,
            code
        )

        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new AuthFailed('openid获取失败')
        }
        const errcode = result.data.errcode
        if (errcode) {
            throw new AuthFailed(`openid获取失败: ${errcode}`)
        }

        // 2. 判断有无注册 -> 注册
        const openid = result.data.openid
        let user = await  User.getUserByOpenid(openid)
        if(!user) {
            user = await User.registerByOpenid(openid)
        }

        // 3. 返回token
        return generateToken(user.id, Auth.USER)
    }
}

module.exports = {
    WXManager
}