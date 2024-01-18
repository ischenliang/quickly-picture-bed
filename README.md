<div align="center">
    <img src="http://imgs.itchenliang.club/img/202211101734215.png"/>
    <div align="center">
      基于Nestjs + Express + Vue3.x + Vite3.x + typescript + Rollup + Monorepo开发的轻量级快捷图片管理系统、图床系统
    </div>
    <span align="center">
        <img src="https://img.shields.io/badge/vuejs-3.2.40-brightgreen" />
        <img src="https://img.shields.io/badge/vite-3.1.4-brightgreen" />
        <img src="https://img.shields.io/badge/vuerouter-4.1.5-brightgreen" />
        <img src="https://img.shields.io/badge/element--plus-2.2.17-brightgreen" />
        <img src="https://img.shields.io/badge/pinia-2.0.22-brightgreen" />
        <img src="https://img.shields.io/badge/typescript-4.8.4-brightgreen" />
        <img src="https://img.shields.io/badge/koa-2.x-brightgreen" />
        <img src="https://img.shields.io/badge/koa--ts--controllers-3.x-brightgreen" />
        <img src="https://img.shields.io/badge/sequelize-6.x-brightgreen" />
        <img src="https://img.shields.io/badge/mysql-brightgreen" />
        <img src="https://img.shields.io/badge/jsonwebtoken-brightgreen" />
        <img src="https://img.shields.io/badge/rollup-brightgreen" />
    </span>
</div>

## 简介
程序员日常就是写博客，在撰写博文时常常需要插入一些图片来丰富内容，为了更好地管理这些图片资源，我选择使用了图床系统，在众多的图床工具中，PicGo成为了我的首选，但由于它是一个基于`electron-vue`开发的桌面应用程序，为用户提供了便捷的图片上传和管理功能。然而每次当我更换电脑或重新安装操作系统时，都需要重新下载和配置PicGo，这无疑增加了我的工作负担。为了减少麻烦，故开发了这款**轻快图片管理系统**。

**轻快图片管理系统**顾名思义是一个做图片管理的系统，和现在市面上很火的Picgo类似，但是由于Picgo是本地版的，即需要自己安装桌面端应用后才能使用，每次换一台电脑都需要重新安装一次，然后再安装指定的图床插件并配置插件，十分麻烦。为了解决上面问题的问题，故诞生了这个轻快图片管理系统，这个是一个在线版的BS系统，只需要安装部署一次后就可以反复使用，只需要你使用浏览器访问安装部署地址即可，如果你不想安装部署也可以直接在演示环境上操作。
> 通过本系统，在安装部署完成后，同样需要安装指定的【图床插件】后才能创建存储桶，和picgo的差异在于，picgo安装图床插件后，每个插件只能配置一个存储桶，当想要配置多个时也无法实现，但在本系统上是可以同一个存储桶插件配置多个存储桶，然后将图片上传到指定的存储桶中，同时本系统也新增了相册管理功能，你可以将不同类别的图片进行分组管理。

## 在线体验
**在线演示(新版本)**
```yaml
地址：http://v2.picture.itchenliang.club/
账号：guest@163.com
密码：000000
仓库地址: 
- Gitee: https://gitee.com/itchenliang/quickly-picture-bed
- Github: https://github.com/ischenliang/quickly-picture-bed
文档: https://ejq9qy8emd.feishu.cn/docx/Eo1HdFD7noXoSlxfRfWcYyzJnpf
```

**在线演示(老版本)**
```yaml
地址：http://picture.itchenliang.club/
账号：guest@163.com
密码：000000
仓库地址: 
- Gitee: https://gitee.com/itchenliang/quickly-picture-bed/tree/koa-controller
- Github: https://github.com/ischenliang/quickly-picture-bed/tree/koa-controller
文档: https://gitee.com/itchenliang/quickly-picture-bed/tree/koa-controller/doc
```

## 内置插件
目前插件功能是采用拔插式的方式实现，完全脱离于本系统的，我们在新增插件时不会影响系统的使用，这种方式也方便了后续扩展新的插件。

此外本系统除了【上传插件】外，还额外新增了【主题插件】和【工具箱插件】: 
- 【上传插件】简单来说就是对常见的第三方对象存储集成，目前支持数十种内置插件，其中包括: 阿里云OSS、腾讯云COS、七牛云Kodo、又拍云USS、青云qingstor等；而且还在不断开发新的插件。
- 【工具箱插件】可以看做是对一些常用的工具封装，例如：uuid生成器、图片裁剪、代码转图片、图片base64编码等。
- 【主题插件】为了实现主题切换功能，系统则内置了主题插件功能，和vscode类似可以通过安装指定的主题插件来达到想要的配色方案，例如：monokai主题、暗黑主题、OneDarkPro主题等，此外系统内部还默认了一套亮色主题。

目前内置的插件如下: 
- **【上传插件】**
- 阿里云对象存储OSS
- 腾讯云对象存储COS
- 七牛云对象存储Kodo
- 又拍云对象存储USS
- 华为云对象存储OBS
- 青云对象存储qingstor
- Minio对象存储
- 有图床存储
- 哔哩哔哩存储
- 墨滴社区存储
- 思否社区存储
- CSDN社区存储
- Gitee存储
- Github存储
- Coding存储
- Githlab存储
- AzureRepo存储
- Cloudflare存储
- Nextcloud存储
- Postimage存储
- Alist存储
- 本地存储
- ....
- **【主题插件】**
- VScode暗黑主题
- VScode Monokai主题
- VScode OnDarkPro主题
- ...
- **【工具插件】**
- uuid生成器
- 代码转精美图片
- 图片base64编码
- 在线裁剪图片


## 内置功能
**图片上传**
- 目前支持多种图片上传方式: 选择上传、拖拽上传、粘贴复制上传、URL网络图上传、Base64上传；
- 支持多图上传；
- 支持一键复制多种链接图片外链格式：
  - 链接格式: URL、HTML、CSS、Markdown、超链接、论坛代码、UBB、自定义；
  - 也支持一键复制多图的链接格式；
- 支持上传预览并可以拖拽排序进而实现链接复制的顺序；

**图片管理**
- 图片管理就是对在该系统上上传过的图片记录进行管理；
- 该功能支持: 复制图片链接格式、删除图片、图片重命名、拖拽排序、移入指定相册等功能；

**存储桶管理**
- 存储桶管理即是对第三方对象存储的配置进行管理；
- 支持多桶储存，可同时添加多个对象存储桶管理；
- 该功能支持: 新建存储桶、更新存储桶、禁用存储桶、删除存储桶、存储桶数据迁移、拖拽排序等功能；

**相册管理**
- 相册管理即是对相册进行分组管理，便于用户将不同的图片进行分类管理，同时也支持直接将图片上传到相册中；
- 相册管理中也可以对图片进行标签配置，对不同的图片配置指定的标签便于二级分组；
- 该功能支持: 新建相册、编辑相册、删除相册、拖拽排序、图片直接上传到相册、模板标签管理、设定相册封面等功能；

**插件市场**<br/>
为了解决老版本系统的图片上传跨域、无法进行主题切换等问题，本次则是直接重构了插件系统。
- 插件市场是系统的核心功能，目前支持三大类插件：上传插件、主题插件、工具箱插件。
  - 【上传插件】简单来说就是对常见的第三方对象存储集成，目前支持数十种内置插件，其中包括: 阿里云OSS、腾讯云COS、七牛云Kodo、又拍云USS、青云qingstor等；而且还在不断开发新的插件。
  - 【工具箱插件】可以看做是对一些常用的工具封装，例如：uuid生成器、图片裁剪、代码转图片、图片base64编码等。
  - 【主题插件】为了实现主题切换功能，系统则内置了主题插件功能，和vscode类似可以通过安装指定的主题插件来达到想要的配色方案，例如：monokai主题、暗黑主题、OneDarkPro主题等，此外系统内部还默认了一套亮色主题。
- 想要使用存储桶功能的前提就是需要安装指定的插件后才能创建存储桶；
- 该功能支持: 插件安装、插件更新、卸载插件、启用/禁用插件等功能；

**数据统计**
- 仪表盘是对当前用户在系统上的一些使用数据进行数据统计分析，例如：有多少张图片、多少个存储桶、安装了多少个插件、多少个相册等。
- 同时为了便于分析也提供了贡献图、近一年内的所有数据进行统计分析

**知识库管理**
- 考虑到目前大多数人使用图床系统都是结合着文档一起在使用，故开发了知识库管理功能，知识库管理和其他大多数平台的功能相似。
- 该功能支持: 创建知识库、更新知识库、复制知识库、删除知识库、一键导出知识库下的所有文档等功能；
- 文档管理: 知识库下有文档管理功能，可以在该知识库下创建多个文章和目录，同时还可以进行拖拽调整文档的目录顺序。

**操作日志**
- 完整的可视化日志功能，记录用户所有操作，方便事件溯源。
- 目前支持图片操作日志、存储桶操作日志、相册操作日志、插件操作日志等；

**偏好设置**
- 考虑到每个用户的使用习惯不同，系统提供了偏好配置中心，可以对默认复制的图片链接格式、自定义链接格式、常用快捷键配置、图片显示名称类型、主题配置、以及各种图片的层现方式。

**用户管理**
- 多用户管理，根据不同的角色可以管理不同的数据，同时用户可以通过自主注册或者管理员在管理页面直接创建。
- 该功能支持: 新建用户、删除用户、更新用户、禁用/启用用户、删除用户等功能；

**插件管理**
- 插件管理是对本系统中支持哪些内置插件进行管理，目前支持的插件类别有文件上传插件、主题插件、工具箱插件等；
- 目前系统上所有的插件都是通过rollup/vite + pnpm + monorepo模式进行开发的，然后打包后发布到npm上，然后代码中通过指定的手段来加载该插件。
- 该功能支持: 新增插件、更新插件、启用|禁用插件、删除插件、拖拽排序等功能。

**字典管理**
- 对系统中经常使用的一些较为固定的数据进行维护，例如个人中心的职业、用户性别、存储桶页面不同的存储桶展示不同的图标等数据维护。
- 该功能支持: 新建字典、删除字典、更新字典、删除字典等功能；

**系统设置**
- 对系统中一些常用的数据进行维护，包括系统名称、系统logo、备案信息、更新日志、系统上所使用的的图标的来源进行配置。

**权限控制**
- 完整的权限控制功能，基于RABC进行权限控制，即针对不同的角色可分配不同的操作权限，控制对应的增删改查的能力。

## 环境
- Node版本 >= 18.16.0
- Mysql版本 >= 5.7
- typescript版本 >= 4.8.4

**代码仓库地址**:<br/> 
如果你觉得项目不错，还望动动你的手指给点点star，让更多人看到优秀的项目！！！
- Github: https://github.com/ischenliang/quickly-picture-bed
- Gitee: https://gitee.com/itchenliang/quickly-picture-bed


## 安装
### 从零开始安装
1. **安装node**

前往[node官网](https://nodejs.org/zh-cn/)下载`node.exe`并安装或者使用`nrm`进行安装。
> 请确保安装的node版本为: 18.16.0

2. **安装git**

前往[Git官网](https://git-scm.com/)下载`git`并安装，此步可忽略。

3. **克隆代码**

使用`git clone`命令将代码克隆到本地，或者直接下载压缩包到本地并解压。

4. **执行sql文件**

系统提供默认初始化数据库sql文件，首先拿到服务端代码，然后打开复制`sql/init.sql`，在`navicat`或者其他工具中执行该sql文件。该sql文件中默认提供了一个管理员账号，方便用户初次使用时登录。
```js
管理员账号: admin@163.com
管理员密码: 000000
```

5. **修改数据库连接**

首先获取到服务端代码，然后打开`/src/.env`文件，将数据库连接服务修改成自己的数据库ip、用户名、密码等。
```yml
# mysql用户名，默认是root
DB_USERNAME=xxx
# mysql密码
DB_PASSWORD=xxx
# 数据库ip，不要使用localhost和127.0.0.1
DB_HOST=xxx.xxx.xxx.xxx
# 数据库端口，默认3306
DB_PORT=3306
# 数据库
DB_DATABASE=xxx

# 程序占用端口
APP_PORT=4000

# npm镜像源仓库，末尾不要加斜杆/，常见的是npm官方镜像源，淘宝镜像源
# unpkg: https://unpkg.com/@itchenliang/picture-rollup-mdnice-plugin@1.0.2/dist/index.umd.js
# 淘宝: https://registry.npmmirror.com/@itchenliang/picture-rollup-oss-plugin/1.0.12/files/dist/index.js
NPM_REGISTRY=https://registry.npmmirror.com
```

6. **依赖安装**
```shell
# 前端依赖安装
cd client
npm install

# 服务端依赖安装: 需要获取到后端代码
cd server
npm install
```

7. **项目启动**

首先拿到服务端代码然后打开命令行将后端服务启动
```shell
# 服务端项目启动: 需要获取到后端代码
cd server
npm run start:dev
```
在运行前端代码前还需要做一步操作，打开`client/public/global.config.js`文件，修改`window.uploader_ip`，将下面的`http://locahost:3002`改成你本地启动的`server`的ip和端口(如果是部署上线时需进行此步，本地调试可跳过)。
```ts
window.uploader_ip = 'http://localhost:3002'
```
然后执行下面命令运行前端代码
```shell
# 前端项目启动
cd client
npm run dev
```
控制台出现如下如所示即代表启动成功
![202401181708175946.png](https://imgs.itchenliang.club/img/202401181708175946.png)<br/>
![202401181708309363.png](https://imgs.itchenliang.club/img/202401181708309363.png)

8. **打包部署**
- **服务端打包部署**
  - 在命令行执行如下命令即可
```shell
# 服务端构建: 需要获取到后端代码
cd server
npm run build
```
- **前端打包部署**
  - 在命令行执行如下命令即可
```shell
# 前端构建
cd client
npm run build
```
将打包后生成的`dist`目录下的所有内容拷贝到web服务器上。


### docker打包部署
在linux环境，可以使用`Docker`进行部署，本系统内提供了`docker`部署方式，尽管使用`docker`部署，上面的修改数据库配置，修改接口地址等操作依然需要操作，在控制台执行
```shell
# 前端docker镜像构建并部署
cd client
docker build -t pic-bed-client .
docker run -d -p 80:80 pic-bed-client

# 服务端docker构建并部署: 需要获取到后端代码
cd server
docker build -t pic-bed-server .
docker run -d -p 4000:4000 pic-bed-server
```
上面的命令，会自动制作`pic-bed-client`和`pic-bed-server`两个`docker`镜像，并且自动启动镜像，等待执行完毕就可以在浏览器输入`http://localhost:80/`和`http://localhost:4000`进行验证是否部署成功，如果出现登录页面，即代表部署成功。


### 安装包安装
下载版本后解压。


## 预览
接口文档：接口文档是采用swagger自动生成的，目前是通过后端访问`http://ip:端口/swagger`访问，其效果如下: 
![202401181708537770.png](https://imgs.itchenliang.club/img/202401181708537770.png)


### 登录、注册、忘记密码
- 登录
![202211101727165.png](https://imgs.itchenliang.club/img/202211101727165.png)
- 注册
![2022111017274810.png](https://imgs.itchenliang.club/img/2022111017274810.png)
- 忘记密码
![202211101728063.png](https://imgs.itchenliang.club/img/202211101728063.png)


### 上传区
![202401181709271669.png](https://imgs.itchenliang.club/img/202401181709271669.png)

### 图片管理
- 图片列表
![202401181709402274.png](https://imgs.itchenliang.club/img/202401181709402274.png)
- 拖拽排序
![202401181709483901.png](https://imgs.itchenliang.club/img/202401181709483901.png)
- 图片详情
![202401181709571411.png](https://imgs.itchenliang.club/img/202401181709571411.png)

### 存储桶管理
- 存储桶列表
![202401181710055738.png](https://imgs.itchenliang.club/img/202401181710055738.png)
- 新增存储桶
![202401181710145189.png](https://imgs.itchenliang.club/img/202401181710145189.png)
- 存储桶数据迁移
![202401181710433634.png](https://imgs.itchenliang.club/img/202401181710433634.png)

### 相册管理
- 相册列表
![202401181710519238.png](https://imgs.itchenliang.club/img/202401181710519238.png)
- 新增相册
![202401181711026454.png](https://imgs.itchenliang.club/img/202401181711026454.png)
- 相册图片
![202401181711118179.png](https://imgs.itchenliang.club/img/202401181711118179.png)

### 插件市场
- 插件列表
![202401181711209937.png](https://imgs.itchenliang.club/img/202401181711209937.png)
- 插件详情
![202401181711275608.png](https://imgs.itchenliang.club/img/202401181711275608.png)

### 知识库管理
- 知识库列表
![202401181711429709.png](https://imgs.itchenliang.club/img/202401181711429709.png)
- 新建知识库
![202401181711498923.png](https://imgs.itchenliang.club/img/202401181711498923.png)
- 知识库文章
![202401181711584463.png](https://imgs.itchenliang.club/img/202401181711584463.png)

### 数据统计
![202401181712067624.png](https://imgs.itchenliang.club/img/202401181712067624.png)
![202401181712148601.png](https://imgs.itchenliang.club/img/202401181712148601.png)

### 操作日志
![202401181712231885.png](https://imgs.itchenliang.club/img/202401181712231885.png)

### 用户管理
- 用户列表
![202401181712302276.png](https://imgs.itchenliang.club/img/202401181712302276.png)
- 新增用户
![202401181712372436.png](https://imgs.itchenliang.club/img/202401181712372436.png)
- 用户详情
![202401181712444098.png](https://imgs.itchenliang.club/img/202401181712444098.png)

### 插件管理
- 插件列表
![202401181712522717.png](https://imgs.itchenliang.club/img/202401181712522717.png)
- 新增插件
![202401181713003180.png](https://imgs.itchenliang.club/img/202401181713003180.png)
- 插件详情
![202401181713106236.png](https://imgs.itchenliang.club/img/202401181713106236.png)


### 字典管理
![202401181713217045.png](https://imgs.itchenliang.club/img/202401181713217045.png)

### 系统设置
![202401181713284518.png](https://imgs.itchenliang.club/img/202401181713284518.png)

### 偏好设置
![202401181713568298.png](https://imgs.itchenliang.club/img/202401181713568298.png)

### 个人中心
![202401181714046931.png](https://imgs.itchenliang.club/img/202401181714046931.png)

### 更新日志
![202401181713399802.png](https://imgs.itchenliang.club/img/202401181713399802.png)

### 关于系统
![202401181713477302.png](https://imgs.itchenliang.club/img/202401181713477302.png)


## 待办功能 TODO
后期待开发的功能列表/优化部分展示
- 开发更多的插件：包括图片上传插件、主题插件以及其他工具箱插件。
- 开发图片鉴黄功能
  - 有的用户在本系统上上传【颜色图片】，属于不合法行为，故需接入鉴黄能力，若用户上传的图片是【有颜色图片】则上传失败。
- 数据迁移/数据备份
  - 考虑到有的用户原先使用的是其他图床系统，需要将数据迁移到本系统中；或者需要将本系统中的图片迁移到其他图床系统中。
    - 相册支持一键导出所有图片(即将该相册中的图片一键批量导出到zip包中)
    - 相册支持一键导入所有图片(即将zip包中的图片一键批量导入到该相册中)
- 有的用户建议使用支持匿名上传并以api的形式使用：简单来说就是是否可以在不登录系统的情况下直接通过api集成到第三方编辑器中，直接匿名上传文件到指定文件夹中，并且以年份-月份进行来开存储图片。


## 联系我
Email: <a href="mailto:itchenliang@163.com">itchenliang@163.com</a>


## 捐赠/打赏
如果您认可我的作品，并且觉得对你有所帮助我愿意接受来自各方面的捐赠。
<table style="border: 1px solid hsla(210,18%,87%,1);border-collapse: collapse;width: 100%;">
  <tbody>
    <tr>
      <td>支付宝</td>
      <td>微信</td>
    </tr>
    <tr style="background: #f6f8fa;">
      <td style="width: 50%;">
        <img src="http://lc-dzncsgi3.cn-n1.lcfile.com/FnXBNkKfhnOYoLppJGSWQY6dUh1rnMHA/reward_alipay.jpg" />
      </td>
      <td style="width: 50%;">
        <img src="http://lc-dzncsgi3.cn-n1.lcfile.com/PAMB9Ah4luFLiVvwp6oVh6pelyPudsNK/reward_weixin.jpg" />
      </td>
    </tr>
  </tbody>
</table>