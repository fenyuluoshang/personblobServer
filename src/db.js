const Sequelize = require('sequelize')
const config = require('./config')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/pathdata.sqlite',
})

var bloblist = sequelize.define('bloblist', {
    blobId: {
        type: Sequelize.INTEGER,
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
    sys.create({
        key: 'adminuser',
        value: config.admin.user
    })
    sys.create({
        key: 'adminpass',
        value: config.admin.password
    })
}

module.exports = {
    bloblist,
    sys
}