# 基于git存储的个人博客服务

使用git仓库作为存储的个人博客服务器

## Get Start

创建一个git仓库作为项目的储存地址，并以其ssh的url替换 src/config.js 中的gitpath部分，并为服务器配置密钥

```
一定要注意设置github项目和服务器之间的密钥
一定要注意设置用户

git config --global user.name "username"
git config --global user.email "user@github.com"
```

酌情修改 src/config.js 的其他配置

```
npm install
npm start
```

在github上配置webhook，接受push推送

搭建自己的页面

## API DOC

#### POST {{server_name}}/webhook

用于github的钩子

#### GET {{server_name}}/indexpage

用于主页显示

response：
| success{Interger} | data[].blobId{Interger} | data[].blobName{String} | data[].blobItem{String} | data[].createdAt{JSONDate} | data[].updatedAt{JSONDate} |
|---|---|---|---|---|---|
| 成功返回码 | 博客id | 博客名 | 博客简介 | 创建时间 | 最后更新时间 |

#### GET {{server_name}}/list

用于列表页加载

request-query:
| page{Interger} |
|-----|
| 页码(从0开始) |

response:
| success{Interger} | data[].blobId{Interger} | data[].blobName{String} | data[].blobItem{String} | data[].createdAt{JSONDate} | data[].updatedAt{JSONDate} | page |
|---|---|---|---|---|---|---|
| 成功返回码 | 博客id | 博客名 | 博客简介 | 创建时间 | 最后更新时间 | 回传确认页码 |

#### GET {{server_name}}/blobtext

用于加载博客页

request-query:
| id{Interger} |
|-----|
| 博客id |

response:
| success{Interger} | data.blobId{Interger} | data.blobName{String} | data.text{HTML String}
|---|---|---|---|
| 成功返回码 | 博客id | 博客名 | HTML元素 |

#### POST {{server_name}}/admin/create

requestbody:

bodytype:application/json

| blobName | text |
|----------|------|
| 博文名 | 加密后的博文正文（RSA加密MarkDown文本） |

response:
| success{Interger} | data |
|---|---|---|
| 成功返回码 | 博客内容 | 异常代码 |

***这里注意，create以及后面的update接口，需要使用服务生成的RSA密钥公钥（路径为./key/admin.pub）对上传的MarkDown文档进行加密，用于认证服务器主人的访问***

#### POST {{server_name}}/admin/create

requestbody:

bodytype:application/json

| blobName | text | blobId |
|----------|------|--------|
| 博文名 | 加密后的博文正文（RSA加密MarkDown文本） | 博文id |

response:
| success{Interger} | data |
|---|---|---|
| 成功返回码 | 博客内容 | 异常代码 |

***这里注意，update以及前面的create接口，需要使用服务生成的RSA密钥公钥（路径为./key/admin.pub）对上传的MarkDown文档进行加密，用于认证服务器主人的访问***
