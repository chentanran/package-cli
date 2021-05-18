'use strict';

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const semver = require('semver')
const userHome = require('user-home')
const Command = require('@package-cli-dev/command')
const log = require('@package-cli-dev/log')
const Package = require('@package-cli-dev/package')
const { spinnerStart, sleep } = require('@package-cli-dev/utils')

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
               await this.downloadTemplate()
           }
            // 3. 安装模板
        } catch(e) {
            log.error(e.message)
        }
    }

    async downloadTemplate() {
        // 拿到模板名称
        const { projectTemplate } = this.projectInfo
        // 和已有模板做对比， 拿到这条模板的数据信息
        const templateInfo = this.template.find(item => item.npmName === projectTemplate)
        // 获取存放模板的基础路径
        const targetPath = path.resolve(userHome, '.package-cli-dev', 'template')
        // 获取存放依赖报的路径
        const storeDir = path.resolve(userHome, '.package-cli-dev', 'template', 'node_modules')
        const { npmName, version } = templateInfo
        // 初始化
        const templateNpm = new Package({
            targetPath,
            storeDir,
            packageName: npmName,
            packageVersion: version
        })
        // 判断路径下有没有此依赖， 没有就下载， 有就更新 
        if (!await templateNpm.exists()) {
            const spinner = spinnerStart('正在下载模板...')
            await sleep()
            try {
                await templateNpm.install()
                log.success('下载模板成功')
            } catch(e) {
                throw e
            } finally {
                spinner.stop(true)
            }
        } else {
            const spinner = spinnerStart('正在更新模板...')
            await sleep()
            try {
                await templateNpm.update()
                log.success('更新模板成功')
            } catch(e) {
                throw e
            } finally {
                spinner.stop(true)
            }
        }
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