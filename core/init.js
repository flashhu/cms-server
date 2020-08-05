const Router = require('koa-router')
const requireDirectory = require('require-directory')

// 初始化管理器
class InitManager {
    static initCore(app) {
        // 入口方法
        InitManager.app = app
        InitManager.initLoadRouters()
    }

    static initLoadRouters() {
        // path config
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }
}

module.exports = InitManager