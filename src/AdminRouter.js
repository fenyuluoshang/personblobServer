const db = require('./db')
const config = require('./config')
const gitdeal = require('./git/gitdeal')
const router = require('express').Router()
const fs = require('fs')
const marked = require('marked')
var NodeRSA = require('node-rsa')
var key = new NodeRSA(fs.readFileSync('./key/admin'))

router.post('/createBlob', async function (req, res, next) {
    var tittle = req.body.blobName
    var blobType = req.body.blobType || 1
    var text
    try {
        if (req.body.text == null)
            throw new Error()
        text = key.decrypt(req.body.text, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    var blobtext = marked(text).replace(/\x0a+/g, ' ')
    var item = blobtext.replace(/<[^>]+>/g, "").substring(0, 30);
    var blob = await db.bloblist.create({
        blobName: tittle,
        blobItem: item,
        blobType: blobType
    })
    fs.writeFileSync(`./data/markdown/${blob.blobId}.md`, text)
    fs.writeFileSync(`./data/templement/${blob.blobId}.temp`, blobtext)
    gitdeal.updateSync()
    res.json({
        success: 1,
        data: blob
    })
})

router.post('/updateBlob', async function (req, res, next) {
    var tittle = req.body.blobName
    var blobType = req.body.blobType
    var blobId = req.body.blobId
    var text
    try {
        if (req.body.text == null)
            throw new Error()
        text = key.decrypt(req.body.text, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    var blob = await db.bloblist.findByPk(blobId)
    if (blob == null || (blobType != null && await db.blobType.findByPk(blobType) == null)) {
        res.json({
            success: 0,
            msg: 'Aim Exit'
        })
        return
    }
    var blobtext = marked(text).replace(/\x0a+/g, ' ')
    var item = blobtext.replace(/<[^>]+>/g, "").substring(0, 30);
    if (tittle != null)
        blob.blobName = tittle
    if (blobType != null)
        blob.blobType = blobType
    blob.blobItem = item
    blob.save()
    fs.writeFileSync(`./data/markdown/${blobId}.md`, text)
    fs.writeFileSync(`./data/templement/${blobId}.temp`, blobtext)
    gitdeal.updateSync()
    res.json({
        success: 1,
        data: blob
    })
})

router.post('/createBlobType', async function (req, res, next) {
    var typeName
    try {
        if (req.body.typeName == null)
            throw new Error()
        typeName = key.decrypt(req.body.typeName, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    var type = await db.blobType.create({
        typeName: typeName
    })
    res.json({
        success: 1,
        data: type
    })
})

router.post('/updateBlobType', async function (req, res, next) {
    var typeId = req.body.typeId
    var typeName
    try {
        if (req.body.typeName == null)
            throw new Error()
        typeName = key.decrypt(req.body.typeName, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    var type = await db.blobType.findByPk(typeId)
    if (type == null) {
        res.json({
            success: 0,
            msg: 'Aim Exit'
        })
        return
    }
    type.typeName = typeName
    type.save()
    res.json({
        success: 1,
        data: type
    })
})

module.exports = router