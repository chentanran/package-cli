'use strict';

const { isObject } = require('@package-cli-dev/utils')

class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package类的options参数不能为空！')
        }
        if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象！')
        }
        // package得路径
        this.targetPath = options.targetPath
        // package的存储路径
        this.storePath = options.storePath
        // package 的 name
        this.packageName = options.name
        // package 的 version
        this.packageVersion = options.version
    }

    // 判断当前 Package 是否存在
    exists() {}

    // 安装 Package
    install() {}

    // 更新 Package
    update() {}

    // 获取入口文件得路径
    getRootFilePath() {}
}

module.exports = Package;
 