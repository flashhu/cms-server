const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Comment extends Model {
    static async getComment(bookID) {
        const comments = await Comment.findAll({
            where: {
                book_id: bookID
            }
        })
        return comments
    } 

    static async addComment(bookID, content) {
        const comment = await Comment.findOne({
            where: {
                book_id: bookID,
                content
            }
        })
        if(!comment) {
            // 新增评论
            return await Comment.create({
                book_id: bookID,
                content,
                nums: 1
            })
        } else {
            // +1
            return await comment.increment('nums', {
                by: 1
            })
        }
    }
}

Comment.init({
    content: Sequelize.STRING(15),
    nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    book_id: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'comment'
})

module.exports = {
    Comment
}