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

// 获取最新期刊 - 所有用户
router.get('/latest', new Auth().m, async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })

    const artDetail = await new Art(flow.art_id, flow.type).getDetail(ctx.auth.uid)

    artDetail.art.setDataValue('like_status', artDetail.like_status)
    artDetail.art.setDataValue('index', flow.index)
    ctx.body = artDetail.art
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

    const artDetail = await new Art(flow.art_id, flow.type).getDetail(ctx.auth.uid)

    artDetail.art.setDataValue('like_status', artDetail.like_status)
    artDetail.art.setDataValue('index', flow.index)
    ctx.body = artDetail.art
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
    const artDetail = await new Art(flow.art_id, flow.type).getDetail(ctx.auth.uid)

    artDetail.art.setDataValue('like_status', artDetail.like_status)
    artDetail.art.setDataValue('index', flow.index)
    ctx.body = artDetail.art
})

// 获得某期刊信息 - 所有用户
router.get('/:type/:id', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))
    
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
    const flow = await Flow.findOne({
        where: {
            art_id: id,
            type
        }
    })
    
    artDetail.art.setDataValue('like_status', artDetail.like_status)
    artDetail.art.setDataValue('index', flow.index)
    ctx.body = artDetail.art
})

// 获取某次期刊的点赞信息 - 所有用户
router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))

    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)

    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
})

// 获取用户喜欢的期刊
router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid
    const arts = await Favor.getMyClassicFavors(uid)
    ctx.body = arts
})

module.exports = router