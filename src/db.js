const Sequelize = require('sequelize')
// const config = require('./config')
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
    blobItem: Sequelize.TEXT
})

init()
async function init() {
    await sequelize.sync()
    await gitdeal.updateSync()
}

module.exports = {
    bloblist
}