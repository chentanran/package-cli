#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package.json')

// 获取 commander 的单例
// const { program } = commander

// 手动实例化一个 Commander
const program = new commander.Command()

program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-e, --envName <envName>', '获取环境变量名称')

// command 注册命令
const clone = program.command('clone <source> [destination]')
clone
    .description('clone a repository into a newly created directory')
    .option('-f, --fetch', '是否强制克隆')
    .action((source, destination) => {
        console.log('clone command called');
    })

// addCommand 注册子命令
const service = new commander.Command('service')
service
    .command('start [port]')
    .description('start service at some port')
    .action((port) => {
        console.log('do service start', port)
    })

program.addCommand(service)

// program
//     .command('install [name]', 'install package', {
//         executableFile: 'package-cli',
//         isDefault: true,
//         hidden: true
//     })
//     .alias('i')

// program
//     .arguments('<cmd> [options]')
//     .description('test commad', {
//         cmd: 'command to run',
//         options: 'options for command'
//     })
//     .action(function(cmd, option) {
//         console.log(cmd, option)
//     })

// 高级定制1： 自定义 help 信息
// program.helpInformation = function() {
//     return '哇哈哈真好喝'
// }

// program.on('--help', function() {
//     console.log('your help informater')
// })

// 高级定制2：实现 debug 模式
// program.on('option:debug', function() {
//     if (program.debug) {
//         process.env.LOG_LEVEL = 'verbose'
//     }
//     console.log(process.env.LOG_LEVEL)
// })

// 高级定制3：对未知命令监听
program.on('command:*', function(obj) {
    console.log(obj)
    console.error('未知命令:' + obj[0])
    const availableommands = program.commands.map(cmd => cmd.name())
    console.log(availableommands)
    console.log('可用命令：' + availableommands.join(','))
})

program.parse(process.argv)
