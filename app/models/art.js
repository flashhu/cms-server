const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Music, Sentence } = require('./classic')

class Art {
    constructor(art_id, type) {
        // 决定对象特征的参数
        this.art_id = art_id
        this.type = type
    }

    // 属性操作 new Art.detail
    // get datail() {}

    // 实例方法 new Art.getDetail()
    // 较灵活的参数通过方法传递
    async getDetail(uid) { 
        const { Favor } = require('./favor')
        const art = await Art.getData(this.art_id, this.type)
        if (!art) {
            throw new NotFound()
        }
        const like = await Favor.uerLikeIt(this.art_id, this.type, uid)
        return {
            art, 
            like_status: like
        }
    }

    // 使用scope后, 对结果进行修改，会报错
    static async getData(art_id, type, useScope=true) {
        let art = null
        const finder = {
            where: {
                id: art_id
            }
        }
        const scope = useScope ? 'hideTime': null

        switch(type) {
            case 100:
                // movie
                art = await Movie.scope(scope).findOne(finder)
                break;
            case 200:
                // music
                art = await Music.scope(scope).findOne(finder)
                break;
            case 300:
                // sentence
                art = await Sentence.scope(scope).findOne(finder)
                break;
            case 400:
                break;
            default:
                break;
        }

        return art
    }

    // 已知一组art, 得到对应实体的信息
    static async getList(artInfoList) {
        // 3种类型 => 3次查询
        // 确定次数，循环查询未知次数
        const artInfoObj = {
            100: [],
            200: [],
            200: []
        }

        for (let artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }

        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue
            }
            arts.push(await Art._getListByType(ids, parseInt(key)))
        }
        // 此时arts为二维数组 [[], [], [] ...]
        return flatten(arts)
    }

    static async _getListByType(ids, type) {
        let arts = []
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }
        const scope = 'hideTime'

        switch (type) {
            case 100:
                // movie
                arts = await Movie.scope(scope).findAll(finder)
                break;
            case 200:
                // music
                arts = await Music.scope(scope).findAll(finder)
                break;
            case 300:
                // sentence
                arts = await Sentence.scope(scope).findAll(finder)
                break;
            case 400:
                break;
            default:
                break;
        }

        return arts
    }
}

module.exports = {
    Art
}