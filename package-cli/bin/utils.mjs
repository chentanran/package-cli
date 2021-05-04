// module.exports = function() {
//     console.log('hello world')
// }

import pathExists from 'path-exists'

export function exists(p) {
    return pathExists.sync(p)
}