const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Flow extends Model {
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