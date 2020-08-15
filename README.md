### 洋葱模型

* 方便对后续中间件返回结果进行处理

<img src="https://image-static.segmentfault.com/289/215/2892151181-5ab48de7b5013_articlex" alt="图示" style="zoom:50%;" />



### 中间件为什么加`async`

* next() 本身返回的即为`Promise`
* 中间件内部使用`await`，如不写`async`会报错

* 加`async`, `await`保证洋葱模型，除最后一中间件外，`next()`前必须加`await`

### 常见的四种传参方式

1. header --> `ctx.request.header`
2. body --> 使用`koa-bodyparser`，`ctx.request.body`
3. url路径内 --> `ctx.params`
4. url问号后 --> `ctx.request.query`

### ORM

> Object/Relational Mapping  **对象-关系映射**
>
> [Sequelize ORM](https://sequelize.org/)

- 数据库的表（table） --> 类（class）
- 记录（record，行数据）--> 对象（object）
- 字段（field）--> 对象的属性（attribute）

### 以中间件的形式调用校验器（类）

* 仅在项目启动时，实例化1次 --> 全局只有1个
*  各请求间不独立，易造成变量错乱

### `uid`通过`body`传递给服务端

* 客户端可通过篡改`uid`获取别的用户数据，安全性低
* 非权限问题

### 缓存

* 前端缓存解决性能最有效，存在条件限制

### 易错

* 漏加`await`， 导致部分操作异常

  