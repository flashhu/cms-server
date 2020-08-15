const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { NotFound } = require('../../core/httpException')

class Flow extends Model {
    // 得到某期的期刊详情
    static async getFlow(index) {
        const flow = await Flow.findOne({
            where: {
                index: index
            }
        })

        if(!flow) {
            throw new NotFound()
        }

        return flow
    }
}

Flow.init({
    index: Sequelize.INTEGER, // 期刊编号
    art_id: Sequelize.INTEGER,
    // type: 100, Movie; 200, Music; 300, Sentence
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'flow'
})

module.exports = {
    Flow
}