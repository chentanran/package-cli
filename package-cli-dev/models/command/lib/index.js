'use strict';

const semver = require('semver')
const colors = require('colors/safe')
const log = require('@package-cli-dev/log')

const LOWEST_NODE_VERSION = '12.0.0'

class Command {
    constructor(argv) {
        // console.log(argv, 'argv')
        if (!argv) {
            throw new Error('参数不能为空！')
        }
        if (!Array.isArray(argv)) {
            throw new Error('参数必须为数组！')
        }
        if (argv.length < 1) {
            throw new Error('参数列表为空！')
        }

        this._argv = argv
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve()
            // 检查版本
            chain = chain.then(() => this.checkNodeVersion())
            chain = chain.then(() => this.initArgs())
            chain = chain.then(() => this.init())
            chain = chain.then(() => this.exec())
            // 监听异常
            chain.catch(err => {
                console.log(err.message)
            })
        })
    }

    initArgs() {
        this._cmd = this._argv[this._argv.length - 1]
        this._argv = this._argv.slice(0, this._argv.length - 1)
    }

    checkNodeVersion() {
        const currentVersion = process.version
        const lowestVersion = LOWEST_NODE_VERSION
        if (!semver.gte(currentVersion, lowestVersion)) {
            throw new Error(colors.red(`package-cli 需要安装 v${lowestVersion}以上版本`))
        }
    }

    init() {
        throw new Error('init必须实现')
    }

    exec() {
        throw new Error('exec必须实现')
    }
}

module.exports = Command;