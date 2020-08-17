const { sequelize } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Favor } = require('./favor')
const favor = require('./favor')

class HotBook extends Model {
    static async getAll() {
        const books = await HotBook.findAll({
            order: [
                'index'
            ]
        })

        // 查询每本书的点赞查询
        let ids = []
        books.forEach(book => {
            ids.push(book.id)
        })

        // 点赞信息 [{art_id: 1120, count: 1}]
        const favors = await Favor.findAll({
            where: {
                art_id: {
                    [Op.in]: ids
                },
                type: 400
            },
            group: ['art_id'],
            attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
        })

        books.forEach(book => {
            HotBook._getEachBookStatus(book, favors)
        })

        return books

    }

    // 传入book, 根据数组favors, 添加点赞信息
    static _getEachBookStatus(book, favors) {
        // 默认值，可能没有点赞信息
        let count = 0 
        favors.forEach(favor => {
            if(book.id === favor.art_id) {
                count = favor.get('count')
            }
        })
        book.setDataValue('fav_nums', count)
        return book
    }
}

HotBook.init({
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING
}, {
    sequelize,
    tableName: 'hot_book'
})

module.exports = {
    HotBook
}