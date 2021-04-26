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

program.parse(process.argv)
