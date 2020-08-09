module.exports = {
    env: 'dev',
    // env: 'prod',
    database: {
        dbName: 'cms_db',
        host: 'localhost',
        port: 3306,
        user: 'cms_user',
        password: '2wsxcde3'
    },
    security: {
        secretKey: "abcdefg", // 最好用随机字符串
        expiresIn: 60*60*24*30 // 令牌过期时间
    }
}