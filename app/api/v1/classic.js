const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')
const { Favor } = require('../../models/favor')
const { PositiveIntegerValidator, ClassicValidator } = require('../../validators/validator')
const { NotFound } = require('../../../core/httpException')

const router = new Router({
    prefix: '/v1/classic'
})

/**
 * 根据已知flow得到返回数据art
 * @param {number} art_id
 * @param {number} type
 * @param {number} uid
 * @param {number} flow_index 期刊号
 */
async function flowToArt(art_id, type, uid, flow_index) {
    const userLikeIt = await Favor.uerLikeIt(art_id, type, uid)
    const art = await Art.getData(art_id, type)
    // 序列化：对象 -> json
    // art 为对象
    art.setDataValue('index', flow_index)
    art.setDataValue('likeStatus', userLikeIt)
    return art
}

// 获取最新期刊 - 所有用户
router.get('/latest', new Auth().m, async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })
    ctx.body = await flowToArt(flow.art_id, flow.type, ctx.auth.uid, flow.index)
})

// 获取下一期期刊信息 - 所有用户
router.get('/:index/next', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.getFlow(index + 1)
    if(!flow) {
        throw new NotFound()
    }
    ctx.body = await flowToArt(flow.art_id, flow.type, ctx.auth.uid, flow.index)
})

// 获取上一期期刊信息 - 所有用户
router.get('/:index/prev', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.getFlow(index - 1)
    if (!flow) {
        throw new NotFound()
    }
    ctx.body = await flowToArt(flow.art_id, flow.type, ctx.auth.uid, flow.index)
})

// 获得点赞信息 - 所有用户
router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))
    const art = await Art.getData(id, type)
    if (!art) {
        throw new NotFound()
    }
    const like = await Favor.uerLikeIt(id, type, ctx.auth.uid)
    ctx.body = {
        fav_nums: art.fav_nums,
        like_status: like
    }
})

// 获取用户喜欢的期刊
router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid
    const arts = await Favor.getMyClassicFavors(uid)
    ctx.body = arts
})

module.exports = router