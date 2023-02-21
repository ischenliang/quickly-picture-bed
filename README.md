<div align="center">
    <img src="http://imgs.itchenliang.club/img/202211101734215.png"/>
    <div align="center">
      基于Koa2 + Vue3.x + Vite3.x + typescript开发的轻量级快捷图片管理系统、图床系统
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
    </span>
</div>

## 简介
程序员日常就是写博客，当然写博客时就会涉及到在博文中插入图片，所以往往会使用图床来进行图片资源管理，市面上较流行的图床系统是`PicGo`，是使用`electron-vue`开发的桌面应用程序，每次换电脑或者重装系统后都需要重新下载安装并配置图床，比较麻烦。所以开发了这款**轻快图片管理系统**，是基于vue3.x + typescript + vite + koa + mysql开发的前后端分离图床系统，使用该系统可以不需要每次都配置图床。
前端使用 Vue3.x + Vite3.x + typescript + Element-plus, 后端使用 Koa2 + typescript + mysql 进行开发，使用 Jwt + koa-ts-controllers 做登录验证和权限校验。


## 内置功能
**图片上传**<br/>
支持图片多图上传、拖拽上传、粘贴上传、一键复制多种格式的图片外链。

**图片管理**<br/>
多上传的图片进行管理，支持文件重命名、移入指定相册、删除图片、预览图片等。

**存储桶管理**<br/>
支持多桶储存，可同时添加多个对象存储桶管理，上不封顶，例如：七牛云对象存储、阿里云对象存储、腾讯云对象存储等等，系统会统计出每个存储桶下的图片数量以及已使用存储量。同时也支持控制存储桶是否显示在上传区。

**相册管理**<br/>
支持相册管理，可以对图片进行分组分类管理，便于用户将不同的图片进行分类挂办理，同时也支持直接将图片上传到相册中。

**操作日志管理**<br/>
完整的可视化日志功能，记录用户所有操作，方便事件溯源。普通用户只能查看自己的操作记录，管理员则能查看所有人员的操作记录，于此同时数据统计中的贡献图的数据来源也是从操作记录中提取。

**个人信息维护**<br/>
用户可以对自己的信息管理，如头像(系统内置4组不同维度的头像供选择)、昵称、职业、性别、个人简介以及个人登录密码进行维护管理。

**数据统计**<br/>
系统提供了数据统计功能，统计用户的图片数量、存储桶数量、总占用存储量、相册数量以及系统贡献度数据进行统计。

**使用习惯配置**<br/>
考虑到每个用户的使用习惯不同，系统提供了使用习惯配置中心，可以对默认复制的图片链接格式、自定义链接格式、常用快捷键配置以及是否开启上传成功提示、复制链接成功提示等配置。

**用户管理**<br/>
多用户管理，根据不同的角色可以管理不同的数据，同时用户可以通过自主注册或者管理员在管理页面直接创建。

**存储桶插件管理**<br/>
存储桶管理，是由管理员进行在线开发的插件，用于管理员对存储桶插件的相关配置，需要做什么前置处理或者后置处理等进行管理，例如七牛云对象存储，需要用户在界面上感知出需要填写哪些数据、哪些数据时必填项、有哪些数据的智能提示，需要前置操作则是获取上传认证，其实就是对存储桶拥有哪些元数据进行配置，于此同时还提供了是否启用或者禁用的功能，比如某一个对象存储已经从市面上out，则管理员可以进行禁用操作，这样用户就不能创建该类型的存储桶。

**字典管理**<br/>
对系统中经常使用的一些较为固定的数据进行维护，例如个人中心的职业、用户性别、存储桶页面不同的存储桶类别展示不同的图标等数据维护。

**系统设置**<br/>
对系统中一些常用的数据进行维护，包括系统名称、系统logo、备案信息、更新日志、系统上所使用的的图标的来源进行配置。

**权限控制**<br/>
完整的权限控制功能，不同的角色可分配不同的操作权限，控制对应的删除及查看。

## 在线体验
**在线演示**<br/>
地址：[http://picture.itchenliang.club/#/](http://picture.itchenliang.club/#/)<br/>
账号：guest@163.com<br/>
密码：000000

## 待办功能 TODO
后期待开发的功能列表/优化部分展示
1. 数据迁移/数据备份<br>
  考虑到有的用户原先使用的是其他图床系统，需要将数据迁移到本系统中；或者需要将本系统中的图片迁移到其他图床系统中。
    - 存储桶支持一键导出所有图片(即将该存储桶中的图片一键批量导出到zip包中)
    - 存储桶支持一键导入所有图片(即将zip包中的图片一键批量导入到该存储桶中)
  <br>考虑到有的用户需要将相册中的图片导入或者导出做备份工作
    - 相册支持一键导出所有图片(即将该相册中的图片一键批量导出到zip包中)
    - 相册支持一键导入所有图片(即将zip包中的图片一键批量导入到该相册中)
2. 新增存储桶插件<br>
  考虑到很多用户在使用“哔哩哔哩图床”和“csdn图床”，为了方便用户的使用，管理员需新增如下两个存储桶插件：
    - bilibili存储桶
    - csdn存储桶
3. 首页上传区<br>
  目前首页上传区存在的问题，如果用户上传的图片多且超清，会导致上传时间比较长，如果此时用户切换菜单到其他页面，会导致图片上传不成功问题，为了解决该问题需要配置一个“全局任务中心”，用户图片上传进度检测，由于是全局的，所以用户切换页面不会造成上传失败问题。
4. 快捷键绑定实际事件<br>
  目前只完成了快捷键绑定设置功能，还需完善到实际的事件绑定，例如：快捷上传快捷键`Ctrl + Shift + P`，需要自动进入到个人中心页面。
5. 提示功能<br>
  根据用户的习惯配置是否开启上传成功等相关的消息提示。
6. 鉴黄能力<br>
  有的用户在本系统上上传【颜色图片】，属于不合法行为，故需接入鉴黄能力，若用户上传的图片是【有颜色图片】则上传失败。


## 环境
- Node版本 >= 14.17.6
- Mysql版本 >= 5.7
- typescript版本 >= 4.8.4


## 安装
### 安装步骤
**1. 安装node**<br/>
前往[node官网](https://nodejs.org/zh-cn/)下载`node.exe`并安装或者使用`nrm`进行安装。

**2. 安装git**<br/>
前往[Git官网](https://git-scm.com/)下载`git`并安装，此步可忽略。

**3. 安装typescript、nodemon、ts-node**<br/>
使用下面的命令全局安装`typescript`
```shell
npm install typescript -g
npm install nodemon -g
npm install ts-node -g
```

**4. 克隆代码**<br/>
使用`git clone`命令将代码克隆到本地，或者直接下载压缩包到本地并解压

**5. 依赖安装**
```shell
# 前端依赖安装
cd client
npm install

# 服务端依赖安装
cd server
npm install
```

**6. 项目启动**
```shell
# 前端项目启动
cd client
npm run dev

# 服务端启动
cd server
npm run start
```
控制台出现如下如所示即代表启动成功
![202211101711526.png](https://imgs.itchenliang.club/img/202211101711526.png)<br/>
![202211101712519.png](https://imgs.itchenliang.club/img/202211101712519.png)

**7. 项目打包部署**<br/>
koa项目可以不用打包部署，直接将`server`目录下的内容所有内容拷贝到服务器上然后执行上述的安装步骤。
```shell
# 前端项目打包部署
cd client
npm run build
```
将打包后生成的`dist`目录下的所有内容拷贝到web服务器上。

## 预览
### 登录
![202211101727165.png](https://imgs.itchenliang.club/img/202211101727165.png)

### 注册
![2022111017274810.png](https://imgs.itchenliang.club/img/2022111017274810.png)

### 忘记密码
![202211101728063.png](https://imgs.itchenliang.club/img/202211101728063.png)

### 上传区
![202211101718307.png](https://imgs.itchenliang.club/img/202211101718307.png)

### 图片管理
![202211101719274.png](https://imgs.itchenliang.club/img/202211101719274.png)

### 存储桶管理
![202211101719413.png](https://imgs.itchenliang.club/img/202211101719413.png)

### 相册管理
![202211101720094.png](https://imgs.itchenliang.club/img/202211101720094.png)

### 操作日志
![202211101720309.png](https://imgs.itchenliang.club/img/202211101720309.png)

### 个人中心
![202211101721163.png](https://imgs.itchenliang.club/img/202211101721163.png)
![202211101721385.png](https://imgs.itchenliang.club/img/202211101721385.png)

### 使用习惯配置
![202211101723388.png](https://imgs.itchenliang.club/img/202211101723388.png)

### 数据统计
![202211101724094.png](https://imgs.itchenliang.club/img/202211101724094.png)

### 用户管理
![202211101724463.png](https://imgs.itchenliang.club/img/202302201017207.png)

### 存储桶插件管理
为了方便拓展，存储桶以插件的形式开发，由管理员直接在系统上进行在线开发，并且支持插件版本管理(版本回退、版本对比)。

**存储桶插件列表**
![202211101725136.png](https://imgs.itchenliang.club/img/202302201018349.png)

**存储桶插件开发**
![202302201023375.png](https://imgs.itchenliang.club/img/202302201023375.png)

**存储桶插件开发预览**
![202302201024225.png](https://imgs.itchenliang.club/img/202302201024225.png)

**存储桶插件版本管理**
![202302201024461.png](https://imgs.itchenliang.club/img/202302201024461.png)

**存储桶插件版本对比**
![202302201025202.png](https://imgs.itchenliang.club/img/202302201025202.png)


### 字典管理
![202211101725334.png](https://imgs.itchenliang.club/img/202211101725334.png)

### 系统设置
![2022111017260710.png](https://imgs.itchenliang.club/img/2022111017260710.png)

### 更新日志
![202211101726356.png](https://imgs.itchenliang.club/img/202211101726356.png)

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