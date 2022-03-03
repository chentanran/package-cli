const jwtKoa = require('koa-jwt')
const { JWT_SECRET, JWT_LGNORE_PATH } = require('../config/constant')

module.exports = jwtKoa({
  secret: JWT_SECRET,
  cookie: 'jwt_token', // 使用 cookie 存档 token
}).unless({
  // 定义那些路由忽略 jwt 验证
  path: JWT_LGNORE_PATH,
})
