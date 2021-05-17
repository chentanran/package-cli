const request = require('@package-cli-dev/request')

module.exports = function(params) {
  return request({
    url: '/project/template'
  })
}