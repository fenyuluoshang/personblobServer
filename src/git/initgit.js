const fs = require('fs')
const gitdeal = require('./gitdeal')
const sg = require('simple-git')('./data')
const config = require('../config')

module.exports =
    async function init() {
        //验证文件夹初始化
        if (!fs.existsSync('./data/.git')) {
            await gitinitSync()
        }
        //拉取测试
        await gitdeal.pullSync()
        //验证关键文件初始化
        if (!fs.existsSync('./data/pathdata.sqlite') || !fs.existsSync('./data/markdown') || !fs.existsSync('./data/templement')) {
            await initDictionarySync()
        }
    }

//init the dir for git data path
function gitinitSync() {
    return new Promise((res, rej) => {
        try {
            sg.init(false, () => {
                sg.addRemote(config.remotename, config.gitpath, () => {
                    res()
                })
            })
        } catch (error) {
            console.log(error)
            rej(error)
        }
    })
}

//init dictionary for git
//MarkDown file will save at ./data/markdown and html element will save at ./data/templement
function initDictionarySync() {
    return new Promise((res, rej) => {
        console.log('init start')
        if (!fs.existsSync('./data/pathdata.sqlite'))
            fs.writeFileSync('./data/pathdata.sqlite', '')
        if (!fs.existsSync('./data/markdown')) {
            fs.mkdirSync('./data/markdown')
            fs.writeFileSync('./data/markdown/.gitkeep', '# Dir for markdown savepath\n\n用于存放md文件的文件夹')
        }
        if (!fs.existsSync('./data/templement')) {
            fs.mkdirSync('./data/templement')
            fs.writeFileSync('./data/templement/.gitkeep', '# Dir for templement savepath\n\n用于存放结构体的文件夹')
        }
        if (!fs.existsSync('./data/ReadMe.md')) {
            fs.writeFileSync('./data/ReadMe.md', require('../autodata/readmefile'))
        }
        sg.add('.', () => {
            sg.commit(`init at ${new Date().toUTCString()}`, () => {
                sg.push('blobdata', 'master', () => {
                    res()
                })
            })
        })
    })
}

if (config.autoupdate && !config.usewebhoock) {
    setInterval(() => {
        autoupdate()
    }, config.updattime * 60000)
}

async function autoupdate() {
    await gitdeal.pullSync()
}