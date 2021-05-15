'use strict';
​
const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const Command = require('@package-cli-dev/command')
const log = require('@package-cli-dev/log')
​
class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || ''
        this.force = !!this._cmd._optionValues.force
        log.verbose('projectName', this.projectName)
        log.verbose('force', this.force)
    }
​
    async exec() {
        console.log('exec的业务逻辑')
        try {
            // 1. 准备阶段
           await this.prepare()
            // 2. 下载模板
            // 3. 安装模板
        } catch(e) {
            log.error(e.message)
        }
    }
​
    async prepare() {
        // 1. 判断当前目录是否为空
        const localPath = process.cwd()
        let ifContinues = this.force ? true : false
        if (!this.isCwdEmpty(localPath)) {
            // 询问是否继续创建
            // 如果带了 force 就代表强制执行， 省去第一步询问的逻辑, 但是删除文件还是需要慎重， 所以下面会再设一道询问，以防止误删除
            if (!this.force) {
                const { ifContinue } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifContinue',
                    message: '当前文件夹不为空， 是否继续创建项目？',
                    default: false
                })
                ifContinues = ifContinue
            }
            // 选择了 false ， 就不往下执行了。
            if (!ifContinues) {
                return
            }
​
            if (ifContinues) {
                // 用户做二次确认
                const { confirmDelete } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    message: '是否确认清空当前目录下的文件？',
                    default: false
                })
                if (confirmDelete) {
                    // 清空当前目录
                    fse.emptyDirSync(localPath)
                }
                
            }
        }
        // 2. 是否启动强制更新
        // 3. 选择创建项目或组件
    }
​
    isCwdEmpty(localPath) {
        let fileList = fs.readdirSync(localPath)
        fileList = fileList.filter(file => {
            return !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        })
        return fileList && fileList.length <= 0 
    }
}
​
function init(argv) {
    return new InitCommand(argv)
}
​
​
module.exports = init
module.exports.InitCommand = InitCommand;