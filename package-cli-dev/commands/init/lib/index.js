'use strict';

const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const semver = require('semver')
const Command = require('@package-cli-dev/command')
const log = require('@package-cli-dev/log')

const getProjectTemplate = require('./getProjectTemplate')

const TYPE_PROJECT = 'project'
const TYPE_COMPONENT = 'component'

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || ''
        this.force = !!this._cmd._optionValues.force
        log.verbose('projectName', this.projectName)
        log.verbose('force', this.force)
    }

    async exec() {
        try {
            // 1. 准备阶段
           const projectInfo = await this.prepare()
           if (projectInfo) {
               // 2. 下载模板
               this.projectInfo = projectInfo
               this.downloadTemplate()
           }
            // 3. 安装模板
        } catch(e) {
            log.error(e.message)
        }
    }

    downloadTemplate() {
        // log.verbose('projectInfo', this.projectInfo)
        // log.verbose('template', this.template)
    }

    async prepare() {
        // 0. 判断项目模板是否存在
        const template = await getProjectTemplate()
        if (!template || template.length === 0) {
            throw new Error('项目模板不存在')
        }
        this.template = template
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
                    // fse.emptyDirSync(localPath)
                }
                
            }
        }
        // 2. 是否启动强制更新
        const projectInfo = await this.getProjectInfo()
        return projectInfo
    }

    async getProjectInfo() {
        let projectInfo = {}
        // 选择创建项目或组件
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [
                {
                    name: '项目',
                    value: TYPE_PROJECT
                },
                {
                    name: '组件',
                    value: TYPE_COMPONENT
                }
            ]
        })
        log.verbose('type', type)
        // 获取项目的基本信息
        if (type === TYPE_PROJECT) {
            const project = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称',
                    default: 'package-cli-dev',
                    validate: function(v) {
                        // 首字母必须为英文
                        // 尾字母必须为英文或数组， 不能为字符
                        // 字符仅允许“-_”
                        const done = this.async()
                        const valid = /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
                        setTimeout(() => {
                            if (!valid) {
                                done('请输入合法项目名称(a, a-b, a_b)')
                                return
                            }
                            done(null, true)
                        }, 0)
                    },
                    filter: (v) => {
                        return v
                    }
                },
                {
                    type: 'input',
                    name: 'projectVersion',
                    message: '请输入项目版本号',
                    default: '1.0.0',
                    validate: function(v) {
                        const done = this.async()
                        const valid = !!semver.valid(v)
                        setTimeout(() => {
                            if (!valid) {
                                done('请输入合法版本号(1.0.0)')
                                return
                            }
                            done(null, true)
                        }, 0)
                    },
                    filter: (v) => {
                        if (!!semver.valid(v)) {
                            return semver.valid(v)
                        } else {
                            return v
                        }                        
                    }
                },
                {
                    type: 'list',
                    name: 'projectTemplate',
                    message: '请选中项目模板',
                    choices: this.createTemplateChoice()
                }
            ])

            projectInfo = {
                type,
                ...project
            }
        } else if (type === TYPE_COMPONENT) {
            projectInfo = {
                type
            }
        }
        return projectInfo
    }

    createTemplateChoice() {
        return this.template.map((item) => {
            return {
                value: item.npmName,
                name: item.name
            }
        })
    }

    isCwdEmpty(localPath) {
        let fileList = fs.readdirSync(localPath)
        fileList = fileList.filter(file => {
            return !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        })
        return fileList && fileList.length <= 0 
    }
}

function init(argv) {
    return new InitCommand(argv)
}


module.exports = init
module.exports.InitCommand = InitCommand;