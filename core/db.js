const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host, 
    port,
    logging: true,                // 打印具体sql
    timezone: '+08:00',
    define: {
        timestamps: true,
        paranoid: true,           // 调用destroy不会删除模型, 除非deletedAt为true
        createdAt: 'created_at',  // 更名为符合Mysql的命名规则
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true         //  自动将驼峰转下划线
    }
})

// Sync all defined models to the DB.
sequelize.sync({ force: false })

module.exports = {
    sequelize
}