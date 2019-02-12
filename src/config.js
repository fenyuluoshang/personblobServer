module.exports = {
    gitpath: 'git@github.com:fenyuluoshang/personblob.git', //请使用ssh方式的git，并将服务器的git密钥添加至github仓库 Pleause use ssh git, and add the server's ssh key to github
    autoupdate: true, //自动刷新
    usewebhoock: true, //利用webhoock更新（如果不使用webhoock，请设置updatetime
    // updattime: 5, //git更新时间单位为分钟
    pagesize: 15, //列表页提供的每次刷新显示长度
    indexpageBlobSize: 5, //提供首页BLOB API 的最大显示条目
    author: '纷羽', //用于部分签名
    admin: {
        user: 'admin',
        password: 'admin'
    }
}