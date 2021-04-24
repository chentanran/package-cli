'use strict';

// module.exports = index;

const log = require('npmlog');

log.level = process.env.LOG_LEVER ? process.env.LOG_LEVER : 'info'; // 判断 debug 模式

log.heading = 'package' // 修改前缀
log.addLevel('success', 2000, { fg: 'green', bold: true }) // 添加自定义命令

module.exports = log
