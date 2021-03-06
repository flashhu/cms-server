const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const { LoginType, ArtType  } = require('../lib/enum')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要正整数', { min: 1 })
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.password1 = [
            // 限定长度 包含特殊字符
            new Rule('isLength', '密码长度需为6~32位', { min: 6, max: 32 }),
            new Rule('matches', '密码必需包含大小写字母和数字', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,32}$/)
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称长度需为4~32位', { min: 4, max: 32 })
        ]
    }

    // 校验密码一致
    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if(psw1 !== psw2) {
            throw new Error('两次密码不一致')
        }
    }

    // 校验邮箱唯一
    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if(user) {
            throw new Error('email已存在')
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super()
        // web => 账号 + 密码
        // 小程序 => 账号
        this.account = [
            new Rule('isLength', '账号长度不符规则', { min: 4, max: 32 })
        ]
        this.secret = [
            // 可为空
            new Rule('isOptional'),
            new Rule('isLength', '至少6位', { min: 6 })
        ]
    }

    validateLoginType(vals) {
        if(!vals.body.type) {
            throw new Error('type必须为参数')
        }
        if (!LoginType.isThisType(vals.body.type)) {
            throw new Error('type参数不合法')
        }
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', { min: 1 })
        ]
    }
}

function checkLoginType(vals) {
    let type = vals.body.type || parseInt(vals.path.type)
    if (!type) {
        throw new Error('loginType必须为参数')
    }
    // parsed 保存转型后变量
    if (!LoginType.isThisType(type)) {
        throw new Error('loginType参数不合法')
    }
}

function checkArtType(vals) {
    let type = vals.body.type || parseInt(vals.path.type)
    if (!type) {
        throw new Error('artType必须为参数')
    }
    // parsed 保存转型后变量
    if (!ArtType.isThisType(type)) {
        throw new Error('artType参数不合法')
    }
}

class Checker {
    constructor(type) {
        this.enumType = type
    }

    check(vals) {
        let type = vals.body.type || parseInt(vals.path.type)
        if (!type) {
            throw new Error('type必须为参数')
        }
        // parsed 保存转型后变量
        if (!this.enumType.isThisType(type)) {
            throw new Error('type参数不合法')
        }
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.validateType = checkArtType
        // const checker = new Checker(ArtType)
        // 改变checker.check中的this指向，从LinValidator指向checker
        // this.validateType = checker.check.bind(checker)
    }
}

class ClassicValidator extends LikeValidator {
}

class SearchValidator extends LinValidator {
    constructor() {
        super()
        // 关键字
        this.q = [
            new Rule('isLength', '搜索关键词不能为空', {min:1, max:16})
        ]
        // 老：pageNum, perPage
        // 新：start, count
        // 可能传值，可能不传值
        this.start = [
            new Rule('isInt', '不符合规范', {min: 0, max: 50000}),
            new Rule('isOptional', '', 0)
        ]
        this.count = [
            new Rule('isInt', '不符合规范', { min: 1, max: 20 }),
            new Rule('isOptional', '', 20)
        ]
    }
}

class AddCommentValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.content = [new Rule('isLength', '评论长度需为1~15位', { min: 1, max: 15 })]
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator,
    ClassicValidator,
    SearchValidator,
    AddCommentValidator
}