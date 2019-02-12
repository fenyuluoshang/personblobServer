const db = require('./db')
const config = require('./config')
const gitdeal = require('./git/gitdeal')
const router = require('express').Router()
const fs = require('fs')
const marked = require('marked')
var NodeRSA = require('node-rsa')
var key = new NodeRSA(fs.readFileSync('./key/admin'))

router.post('/create', async function (req, res, next) {
    var tittle = req.body.blobName
    var text
    try {
        text = key.decrypt(req.body.text, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    var blobtext = marked(text)
    var item = blobtext.replace(/<[^>]+>/g, "").substring(0, 30);
    var blob = await db.bloblist.create({
        blobName: tittle,
        blobItem: item
    })
    fs.writeFileSync(`./data/markdown/${blob.blobId}.md`, text)
    fs.writeFileSync(`./data/templement/${blob.blobId}.temp`, blobtext)
    gitdeal.updateSync()
    res.json({
        success: 1,
        data: blob
    })
})

router.post('/update', async function (req, res, next) {
    var tittle = req.body.blobName
    var blobId = req.body.blobId
    var text
    try {
        text = key.decrypt(req.body.text, 'utf8');
    } catch (error) {
        res.json({
            success: 0,
            msg: 'Access Error'
        })
        return
    }
    if (await db.bloblist.findByPk(blobId) == null) {
        res.json({
            success: 0,
            msg: 'Aim Exit'
        })
        return
    }
    var blobtext = marked(text)
    var item = blobtext.replace(/<[^>]+>/g, "").substring(0, 30);
    var blob = await db.bloblist.update({
        blobName: tittle,
        blobItem: item
    }, {
        where: {
            blobId: blobId
        }
    })
    fs.writeFileSync(`./data/markdown/${blob.blobId}.md`, text)
    fs.writeFileSync(`./data/templement/${blob.blobId}.temp`, blobtext)
    gitdeal.updateSync()
    res.json({
        success: 1,
        data: blob
    })
})

module.exports = router