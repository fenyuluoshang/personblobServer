const db = require('./db')
const config = require('./config')
const gitdeal = require('./git/gitdeal')
const router = require('express').Router()
const fs = require('fs')

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
        limit: config.indexpageBlobSize
    })
    res.json({
        success: 1,
        data: list
    })
})

router.get('/list', async function (req, res, next) {
    var page = parseInt(req.query.page)
    var list = await db.bloblist.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: config.pagesize,
        offset: config.pagesize * page
    })
    res.json({
        success: 1,
        data: list,
        page: page
    })
})

router.get('/blobtext', async function (req, res, next) {
    var blob = await db.bloblist.findByPk(req.query.id)
    if (blob == null || !fs.existsSync(`./data/templement/${blob.blobId}.temp`)) {
        res.json({
            success: 0,
            msg: 'Error Not Found'
        })
        return
    }
    blob.text = fs.readFileSync(`./data/templement/${blob.blobId}.temp`, {
        encoding: 'utf-8'
    })
    res.json({
        success: 1,
        data: blob
    })
})

router.use('/admin', require('./AdminRouter'))

module.exports = router