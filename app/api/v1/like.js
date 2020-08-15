const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { LikeValidator } = require('../../validators/validator')
const { Favor } = require('../../models/favor')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/like'
})

/**
 * 点赞
 * @param {number} art_id 对应某一实体的编号 flow表
 * @param {string} type 实体类型 flow表
 */
router.post('/', new Auth().m, async (ctx) => {
    // LikeValidator => alias (L63) 别名 将id的值设成art_id的值
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id'
    })
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success() 
})

// 取消点赞
router.post('/cancel', new Auth().m, async (ctx) => {
    // LikeValidator => alias (L63) 别名 将id的值设成art_id的值
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id'
    })
    await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success()
})

module.exports = router