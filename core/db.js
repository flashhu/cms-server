const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
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
        underscored: true,        // 自动将驼峰转下划线
        // 排除返回结果中的某些字段的方法：
        // 1. 返回结果后，删除字段
        // 2. 查询时去除部分字段  => 此处使用scope
        // 3. JSON序列化时，部分字段不序列化 => 见comment中的toJSON, 下文的toJSON
        scopes: {                 // 全局预先定义
            hideTime: {           // 查询结果去除三个操作时间的字段
                attributes: {
                    exclude: ['updated_at', 'deleted_at', 'created_at']
                }
            }
        }
    }
})

// Sync all defined models to the DB.
sequelize.sync({ force: false })

Model.prototype.toJSON = function () {
    let data = clone(this.dataValues)
    unset(data, 'updated_at')
    unset(data, 'deleted_at')
    unset(data, 'created_at')

    if(isArray(this.exclude)) {
        this.exclude.forEach((value)=>{
            unset(data, value)
        })
    }

    return data
}

module.exports = {
    sequelize
}