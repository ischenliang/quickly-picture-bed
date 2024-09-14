## koa-ts-controllers-base
该项目是针对 koa + typescript的一个base版本，以后就可以在这个基础上创建项目，就不需要每次都去反复搭建项目。

### 依赖
主要使用了`koa` + `koa-router` + `koa-ts-controllers`来实现restful API接口的编写。
数据库以及数据库连接工具主要是使用了`mysql` + `sequelize`来操作。
更多`koa-ts-controllers`操作，请查看[koa-ts-controllers](https://www.npmjs.com/package/koa-ts-controllers)
具体案例参考：[注册登录与鉴权](https://blog.csdn.net/weixin_44145258/article/details/106983952)

### 如何使用
1. 首先使用`git clone`命令将代码克隆到本地
2. 修改`src/utils/seq.ts`里面的数据库相关配置
3. 然后使用`npm install`进行依赖的安装
4. 全局安装热加载工具`ts-node-dev`
```shell
npm install ts-node-dev -g
```
5. 启动项目
```shell
ts-node-dev src/app.ts
```
等到终端出现如下效果，则表示项目启动成功
![](https://gitee.com/itchenliang/img/raw/master/img/20210806094250.png)
6. 在浏览器输入`localhost:3001/api/v1/role/list`，访问成功会出现如下如所示
![](https://gitee.com/itchenliang/img/raw/master/img/20210806094646.png)