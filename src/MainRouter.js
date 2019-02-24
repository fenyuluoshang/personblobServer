const db = require('./db')
const config = require('./config')
const gitdeal = require('./git/gitdeal')
const router = require('express').Router()
const fs = require('fs')

class blobDataSimple {
    constructor(blobId, blobName, blobItem, blobTypeId, blobTypeName, createdAt, updatedAt) {
        this.blobId = blobId
        this.blobName = blobName
        this.blobItem = blobItem
        this.blobTypeId = blobTypeId
        this.blobTypeName = blobTypeName
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

class blobData {
    constructor(blobId, blobName, blobItem, blobTypeId, blobTypeName, createdAt, updatedAt, blobText) {
        this.blobId = blobId
        this.blobName = blobName
        this.blobItem = blobItem
        this.blobTypeId = blobTypeId
        this.blobTypeName = blobTypeName
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.blobText = blobText
    }
}

router.post('/webhook', (req, res, next) => {
    // console.log(req.body)
    gitdeal.pullSync().then((value) => {
        console.log('file has update')
    })
    res.json({
        success: 1,
        msg: 'thanks'
    })
})

router.get('/indexpage', async function (req, res, next) {
    var list = await db.bloblist.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [db.blobType],
        limit: config.indexpageBlobSize
    })

    var data = []

    list.forEach((val) => {
        data.push(new blobDataSimple(val.blobId, val.blobName, val.blobItem,
            val.blob_type.blobTypeId, val.blob_type.typeName, val.createdAt, val.updatedAt))
    })

    res.json({
        success: 1,
        data: data
    })
})

router.get('/list', async function (req, res, next) {
    var type = req.query.type;
    var page = parseInt(req.query.page)
    var list = type == null ? await db.bloblist.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [db.blobType],
        limit: config.pagesize,
        offset: config.pagesize * page
    }) : await db.bloblist.findAll({
        where: {
            blobType: type
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [db.blobType],
        limit: config.pagesize,
        offset: config.pagesize * page
    })

    var data = []

    list.forEach((val) => {
        data.push(new blobDataSimple(val.blobId, val.blobName, val.blobItem,
            val.blob_type.blobTypeId, val.blob_type.typeName, val.createdAt, val.updatedAt))
    })

    res.json({
        success: 1,
        data: data,
        page: page
    })
})

router.get('/type', async function (req, res, next) {
    var list = await db.blobType.findAll()
    var data = []
    list.forEach((val) => {
        data.push({
            blobTypeId: val.blobTypeId,
            blobTypeName: val.typeName
        })
    })
    res.json({
        success: 1,
        data: data
    })
})

router.get('/blobtext', async function (req, res, next) {
    var blob = await db.bloblist.findByPk(req.query.id, {
        include: [db.blobType]
    })
    if (blob == null || !fs.existsSync(`./data/templement/${blob.blobId}.temp`)) {
        res.json({
            success: 0,
            msg: 'Error Not Found'
        })
        return
    }
    var text = fs.readFileSync(`./data/templement/${blob.blobId}.temp`)

    res.json({
        success: 1,
        data: new blobData(blob.blobId, blob.blobName, blob.blobItem,
            blob.blob_type.blobTypeId, blob.blob_type.typeName, blob.createdAt, blob.updatedAt, text.toString())
    })
})

router.use('/admin', require('./AdminRouter'))

module.exports = router