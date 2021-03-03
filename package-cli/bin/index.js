#!/usr/bin/env node

const lib = require('package-cli-lib')

const common = require('process').argv

if (common[2].startsWith('--') || common[2].startsWith('-')) {
    const option = common[2].replace(/--|-/g, '')
    if (option === 'version' || option === 'v') {
        console.log('1.0.0')
    }
}

// console.log(common)

// if (common[2]) {
//     if (lib[common[2]]) {
//         lib[common[2]]()
//     } else {
//         console.log('没有此命令')
//     }
// } else {
//     console.log('请输入命令')
// }