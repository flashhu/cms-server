const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { NotFound, AuthFailed } = require('../../core/httpException')

class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new NotFound('账号不存在')
        }
        // 解码
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if(!correct) {
            throw new AuthFailed('密码不正确')
        }

        return user
    }

    static async getUserByOpenid(openid) {
        const user = User.findOne({
            where: {
                openid
            }
        })
        return user
    }

    static async registerByOpenid(openid) {
        return await User.create({
            openid
        })
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        // 观察者模式
        type: Sequelize.STRING,
        set(val) {
            // 生成盐
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { 
    sequelize, 
    tableName: 'user' 
})

module.exports = {
    User
}