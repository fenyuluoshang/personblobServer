const sg = require('simple-git')('./data')
const config = require('../config')

module.exports = {
    updateSync: function () {
        return new Promise((res, rej) => {
            sg.pull(config.remotename, config.branchname, () => {
                sg.add('.', () => {
                    var logs = `update at ${new Date().toTimeString()}`
                    sg.commit(logs, () => {
                        sg.push(config.remotename, config.branchname, () => {
                            console.log(logs)
                            res()
                        })
                    })
                })
            })
        })
    },
    pullSync: function () {
        return new Promise((res, rej) => {
            sg.pull(config.remotename, config.branchname, () => {
                res()
            })
        })
    }
}