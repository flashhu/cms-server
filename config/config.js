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
    },
    wx: {
        appId: 'wx393f310fe418e8c4',
        appSecret: '56d30f114368cbae57af0b4cd7003a17',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    yushu:{
        detailUrl: 'http://t.yushu.im/v2/book/id/%s',
        keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    }
}