const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Art } = require('./art')
const { LikeError, DislikeError, NotFound } = require('../../core/httpException') 

class Favor extends Model {
    // 业务表
    
    // 点赞
    static async like(art_id, type, uid) {
        // * 保证数据一致性 => 事务
        // 0. 记录是否已存在
        // 1. favor表 添加记录
        // 2. classic fav_nums + 1

        const favor = await Favor.findOne({
            where: {
                art_id, 
                type, 
                uid
            } 
        })
        if (favor) {
            throw new LikeError()
        }

        // todo 点赞书籍：
        // console.log('-------------', art_id, type, uid);
        // INSERT INTO `favor` (`id`,`uid`,`art_id`,`type`,`created_at`,`updated_at`) VALUES (DEFAULT,?,?,?,?,?); 

        // * sequelize.transaction + 回调函数
        // * {transaction: t}
        sequelize.transaction(async t => {
            await Favor.create({ 
                art_id, 
                type, 
                uid 
            }, {transaction: t})
            const art = await Art.getData(art_id, type, false)
            // 注意此处 {transaction: t} 的位置
            await art.increment('fav_nums', { by: 1, transaction: t })
        })
    }

    // 取消点赞
    static async dislike(art_id, type, uid) {
        // Favor 表； favor 记录
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (!favor) {
            throw new DislikeError()
        }

        // * sequelize.transaction + 回调函数
        // * {transaction: t}
        sequelize.transaction(async t => {
            // * 注意此处为 favor（前文查询出的记录）
            await favor.destroy({
                // force: false 软删除，插入时间戳标记
                // force: true  物理删除
                force: false,
                transaction: t 
            })
            const art = await Art.getData(art_id, type, false)
            // 注意此处 {transaction: t} 的位置
            await art.decrement('fav_nums', { by: 1, transaction: t })
        })
    }

    // 用户是否已点赞
    static async uerLikeIt(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })

        return favor ? true : false
    }

    // 某用户点赞了哪些期刊
    static async getMyClassicFavors(uid) {
        const arts = await Favor.findAll({
            where: {
                uid: uid,
                // type != 400
                type: {
                    // key 为字符串
                    // [] 中可以为表达式
                    [Op.not]: 400
                }
            }
        })

        if(!arts) {
            throw new NotFound()
        }

        return await Art.getList(arts)
    }

    static async getBookFavor(uid, bookID) {
        const favorNums = await Favor.count({
            where: {
                art_id: bookID,
                type: 400
            }
        })
        const myFavor = await Favor.findOne({
            where: {
                art_id: bookID,
                type: 400,
                uid
            }
        })
        return {
            fav_nums: favorNums,
            like_status: myFavor ? 1 : 0
        }
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'favor'
})

module.exports = {
    Favor
}