'use strict';

const { rejects } = require('assert');
const cp = require('child_process');
const { resolve } = require('path');

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}

function spinnerStart(msg, spinnerString = '|/-\\') {
    const Spinner = require('cli-spinner').Spinner;
    const spinner = new Spinner(msg + ' %s');
    spinner.setSpinnerString(spinnerString);
    spinner.start();
    return spinner;
}

function sleep(timeout = 1000) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// 开启子进程，执行 node 命令
function spawn(command, args, options) {
    const win32 = process.platform === 'win32'
    const cmd = win32 ? 'cmd' : command
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args
    return cp.spawn(cmd, cmdArgs, options || {})
}

// 异步命令
function spawnAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const p = spawn(command, args, options)
        p.on('error', e => {
            reject(e)
        })
        p.on('exit', c => {
            resolve(c)
        })
    })
}

module.exports = {
    isObject,
    spinnerStart,
    sleep,
    spawn,
    spawnAsync
}