const db = require('./db')
const router = require('express').Router()

router.post('/webhook', (req, res, next) => {
    console.log(req.body)
    res.json({
        success: 1,
        msg: 'thanks'
    })
})

module.exports = router