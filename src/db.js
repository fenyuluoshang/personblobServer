const Sequelize = require('sequelize')
const config = require('./config')
const gitdeal = require('./git/gitdeal')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/pathdata.sqlite',
})

var bloblist = sequelize.define('bloblist', {
    blobId: {
        type: Sequelize.INTEGER(128),
        autoIncrement: true,
        primaryKey: true
    },
    blobName: Sequelize.STRING,
    blobItem: Sequelize.TEXT,
    lastEditTime: Sequelize.DATE
})

var sys = sequelize.define('sys', {
    key: {
        type: Sequelize.STRING(255),
        primaryKey: true
    },
    value: {
        type: Sequelize.STRING(255),
    }
})

init()
async function init() {
    await sequelize.sync()
    await sys.upsert({
        key: 'adminuser',
        value: config.admin.user
    })
    await sys.upsert({
        key: 'adminpass',
        value: config.admin.password
    })
    await gitdeal.updateSync()
}

module.exports = {
    bloblist,
    sys
}