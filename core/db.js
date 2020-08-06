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
    logging: true, //打印具体sql
    timezone: '+08:00',
    define: {

    }
})

module.exports = {
    sequelize
}