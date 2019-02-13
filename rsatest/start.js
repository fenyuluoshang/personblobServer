var fs = require('fs')
var NodeRSA = require('node-rsa')
var key = new NodeRSA(fs.readFileSync('./key/admin.pub'))

console.log(key.isPublic())
var data = fs.readFileSync('./rsatest/data.md')

console.log(data)
var newdata = key.encrypt(data, 'base64')
fs.writeFileSync('./rsatest/test.data', newdata)
// var key2 = new NodeRSA(fs.readFileSync('./key/admin'))
// console.log(key2.decrypt(newdata, 'utf8'))