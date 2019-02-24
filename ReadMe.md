# Person Blob Website Server with Git

use git server to save data for your website

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

#### 用于github的钩子

```
POST {{server_name}}/webhook
```

request:
Any

response:
200 OK


#### 用于主页显示

```
GET {{server_name}}/indexpage
```

response：

| 字段 | 类型 | 描述
|------|------|------
| success | int | 成功返回码
| data | Array\<Object\> | 博客信息
| - blobId | int | 博客id
| - blobName | String | 博客名
| - blobItem | String | 博客简介
| - blobTypeId | int | 博客分类id
| - blobTypeName | String | 博客分类名
| - createdAt | Date | 创建时间
| - updatedAt | Date | 最后修改时间

#### 用于列表页加载

```
GET {{server_name}}/list
```

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| page | int | 页码（从0开始） | query param

示例
```
http://localhost:3000/list?page=0
```

response：

| 字段 | 类型 | 描述
|------|------|------
| success | int | 成功返回码
| data | Array\<Object\> | 博客信息
| - blobId | int | 博客id
| - blobName | String | 博客名
| - blobItem | String | 博客简介
| - blobTypeId | int | 博客分类id
| - blobTypeName | String | 博客分类名
| - createdAt | Date | 创建时间
| - updatedAt | Date | 最后修改时间


#### 类型列表

```
GET {{server_name}}/type
```

response：

| 字段 | 类型 | 描述
|------|------|------
| success | int | 成功返回码
| data | Array\<Object\> | 博客类别信息
| - blobTypeId | int | 分类的id
| - blobTypeName | String | 分类名

#### 博文数据

```
GET {{server_name}}/blobtext
```

request-query:

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| id | int | 博客id | query param

response：

| 字段 | 类型 | 描述
|------|------|------
| success | int | 成功返回码
| data | Object | 博客信息
| - blobId | int | 博客id
| - blobName | String | 博客名
| - blobItem | String | 博客简介
| - blobTypeId | int | 博客分类id
| - blobTypeName | String | 博客分类名
| - createdAt | Date | 创建时间
| - updatedAt | Date | 最后修改时间
| - blobText | HTML String | DOM文本

#### 创建博文

```
POST {{server_name}}/admin/createBlob
```

post bodytype:application/json

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| tittle | String | 标题 | body
| blobType | int | 博客类型 | body
| text | RSA MarkDown String | 对MarkDown博客文本 采用RSA加密后的结果 | body

***这里注意，createBlob以及后面的updateBlob接口，需要使用服务生成的RSA密钥公钥（路径为./key/admin.pub）对上传的MarkDown文档进行加密，用于认证服务器主人的访问***

response:

| success{Interger} | data | msg{String} |
|----------|--------|--------|
| 成功返回码 | 博客内容 | 异常代码 |

#### 更新修改博文

```
POST {{server_name}}/admin/updateBlob
```

post bodytype:application/json

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| blobId | int | 博客id | body
| tittle | String | 标题 | body
| blobType | int | 博客类型 | body
| text | RSA MarkDown String | 对MarkDown博客文本 采用RSA加密后的结果 | body

***这里注意，createBlob以及后面的updateBlob接口，需要使用服务生成的RSA密钥公钥（路径为./key/admin.pub）对上传的MarkDown文档进行加密，用于认证服务器主人的访问***

response:

| success{Interger} | data | msg{String} |
|----------|--------|--------|
| 成功返回码 | 博客内容 | 异常代码 |

#### 创建博客分类

```
POST {{server_name}}/admin/createBlobType
```

post bodytype:application/json

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| typeName | RSA String | 对分类名 采用RSA加密后的结果 | body

response:

| success{Interger} | data | msg{String} |
|----------|--------|--------|
| 成功返回码 | 博客内容 | 异常代码 |

#### 修改博客分类名

```
POST {{server_name}}/admin/updateBlobType
```

post bodytype:application/json

| 字段 | 类型 | 描述 | 传输类型
|------|------|-----|---------
| typeId | int | 分类id | body
| typeName | RSA String | 对分类名 采用RSA加密后的结果 | body

response:

| success{Interger} | data | msg{String} |
|----------|--------|--------|
| 成功返回码 | 博客内容 | 异常代码 |