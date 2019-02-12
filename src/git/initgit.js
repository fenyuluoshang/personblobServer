const fs = require('fs')

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data')
}
const sg = require('simple-git')('./data')
const config = require('../config')

module.exports =
    async function init() {
        if (!fs.existsSync('./data/.git')) {
            await gitinitSync()
            if (!fs.existsSync('./data/pathdata.sqlite')) {
                await initDictionarySync()
            }
        }
    }

//init the dir for git data path
function gitinitSync() {
    return new Promise((res, rej) => {
        try {
            sg.init(false, () => {
                sg.addRemote('blobdata', config.gitpath, () => {
                    sg.pull('blobdata', 'master', () => {
                        res()
                    })
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
        fs.writeFileSync('./data/pathdata.sqlite', '')
        fs.mkdirSync('./data/markdown')
        fs.writeFileSync('./data/markdown/.gitkeep', '# Dir for markdown savepath\n\n用于存放md文件的文件夹')
        fs.mkdirSync('./data/templement')
        fs.writeFileSync('./data/templement/.gitkeep', '# Dir for templement savepath\n\n用于存放结构体的文件夹')
        fs.writeFileSync('./data/ReadMe.md', require('../autodata/readmefile'))
        sg.add('.', () => {
            sg.commit(`init at ${new Date().toUTCString()}`, () => {
                sg.push('blobdata', 'master', () => {
                    res()
                })
            })
        })
    })

}