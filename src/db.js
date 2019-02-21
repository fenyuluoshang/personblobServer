const Sequelize = require('sequelize')
// const config = require('./config')
const gitdeal = require('./git/gitdeal')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/pathdata.sqlite',
})

var bloblist = sequelize.define('blob_list', {
    blobId: {
        type: Sequelize.INTEGER(128),
        autoIncrement: true,
        primaryKey: true
    },
    blobName: Sequelize.STRING,
    blobItem: Sequelize.TEXT,
    blobType: Sequelize.INTEGER(128)
})

var blobType = sequelize.define('blob_type', {
    blobTypeId: {
        type: Sequelize.INTEGER(128),
        autoIncrement: true,
        primaryKey: true
    },
    typeName: Sequelize.STRING
})

blobType.hasMany(bloblist, {
    targetKey: "blobTypeId",
    foreignKey: "blobType"
})

bloblist.belongsTo(blobType, {
    targetKey: "blobTypeId",
    foreignKey: "blobType"
})

init()
async function init() {
    await sequelize.sync()
    if (await blobType.count() < 1) {
        blobType.create({
            blobTypeId: 1,
            typeName: '默认分类'
        })
    }
    await gitdeal.updateSync()
}

module.exports = {
    bloblist,
    blobType
}