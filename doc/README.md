# 轻快图片管理系统文档中心
## 使用教程



## 存储桶配置教程
存储桶整体创建流程
1. 注册账号：通过邮箱地址注册账号，或者使用系统提供的演示账号`guest@163.com`
2. 登录账号
3. 点击左侧菜单栏的“存储桶”
4. 点击新建存储桶
5. 选择对应的存储桶类别
6. 填写相关配置
<img src="https://imgs.itchenliang.club/picture-ped-img/202302231124037.png" alt="202302231124037.png">

### 本地存储桶
本系统为了方便用户使用，提供了`本地存储桶`，用户如果不想配置更多参数，则可以直接使用`本地存储桶`，创建存储桶时，只需要填写一个存储桶名称即可。
1. 在新建存储桶窗口中选择`本地存储桶`
![2023022311251810.png](https://imgs.itchenliang.club/picture-ped-img/2023022311251810.png)
2. 填写存储桶名称
![2023022311255010.png](https://imgs.itchenliang.club/picture-ped-img/2023022311255010.png)
3. 点击“确定”按钮，完成创建
![202302231126256.png](https://imgs.itchenliang.club/picture-ped-img/202302231126256.png)
4. 于此同时我们可以在“首页”上传区看到我们刚刚创建的存储桶
![202302231127284.png](https://imgs.itchenliang.club/picture-ped-img/202302231127284.png)
5. 点击选择我们创建的存储桶，上传图片必须选择一款“存储桶”，否则出现会提示信息
![2023022311292410.png](https://imgs.itchenliang.club/picture-ped-img/2023022311292410.png)
![202302231129565.png](https://imgs.itchenliang.club/picture-ped-img/202302231129565.png)



### 七牛云 KODO
**字段说明**
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
设定AccessKey: 七牛云AccessKey
设定SecretKey: 七牛云SecretKey
设定存储空间名: 七牛云存储空间名
设定自定义域名: 存储桶访问域名，如果绑定了域名则填写绑定的域名，以http://或https://开头，末尾无需斜杠，上传的图片都将以此域名作为主域
设定存储区域: 七牛云存储空间所在存储区域
指定存储路径: 七牛云存储路径，想要把图片存储在空间的什么位置，例如：img/
设定网址后缀: 七牛云图片处理的后缀，例如给图片添加水印
```
1. 注册七牛云账号<br>
  登录[七牛官网](https://www.qiniu.com/)，先注册一个七牛云的账号，这里注意，用户类型选择个人账号，然后进行实名认证。
2. 创建七牛云存储空间<br>
  进入[七牛云空间管理](https://portal.qiniu.com/kodo/bucket)，点击“新建空间”
![202302231205359.png](https://imgs.itchenliang.club/picture-ped-img/202302231205359.png)
3. 给自己的域名添加二级域名<br>
  > 因为我的域名是阿里云的，所以这里用阿里云的讲了

  进入[阿里云域名列表](https://dc.console.aliyun.com/next/index?#/domain-list/all)，选择解析
  ![202302231206412.png](https://imgs.itchenliang.club/picture-ped-img/202302231206412.png)
  然后添加一个二级域名，这个完了先不要关，等下还要改
  ![202302231206593.png](https://imgs.itchenliang.club/picture-ped-img/202302231206593.png)

4. 绑定二级域名
  进入[七牛云域名绑定页面](https://portal.qiniu.com/cdn/domain)，点击添加域名，然后下图只需要把刚刚配置的域名写上，然后其余默认就行，点击创建
  ![202302231207426.png](https://imgs.itchenliang.club/picture-ped-img/202302231207426.png)
  然后回到上一个页面，跟着下图操作
  ![202302231207588.png](https://imgs.itchenliang.club/picture-ped-img/202302231207588.png)
  ![202302231208113.png](https://imgs.itchenliang.club/picture-ped-img/202302231208113.png)
  ![202302231208179.png](https://imgs.itchenliang.club/picture-ped-img/202302231208179.png)
  然后回到刚刚添加域名的页面，点击刚刚添加的域名，把www.baidu.com改成刚刚复制的东西，配置完了之后等一会，系统审核完成后会发邮件，等状态变成成功说明配置完成了
  ![202302231208372.png](https://imgs.itchenliang.club/picture-ped-img/202302231208372.png)
  ![202302231208457.png](https://imgs.itchenliang.club/picture-ped-img/202302231208457.png)
5. 获取 AccessKey 和 SecretKey<br>
  进入[七牛云秘钥管理页面](https://portal.qiniu.com/user/key)，复制 AccessKey 和 SecretKey 
  ![202302231210566.png](https://imgs.itchenliang.club/picture-ped-img/202302231210566.png)
6. 配置存储桶<br>
  将上面几步获取到的数据填写到对应输入框中
  ![202302231216536.png](https://imgs.itchenliang.club/picture-ped-img/202302231216536.png)
7. 最后点击确定即可完成创建
  ![202302231217287.png](https://imgs.itchenliang.club/picture-ped-img/202302231217287.png)



### 阿里云 OSS
**字段说明**
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
设定KeyId: 阿里云KeyId
设定KeySecret: 阿里云KeySecret
设定存储空间名: 阿里云存储空间名
设定存储区域: 阿里云存储空间所在存储区域
设定自定义域名: 存储桶访问域名，默认格式`https://${config.bucket}.${config.area}.aliyuncs.com/`
指定存储路径: 阿里云存储路径，想要把图片存储在空间的什么位置，例如：img/
设定网址后缀: 阿里云图片处理的后缀，例如给图片添加水印
```
1. 购买对象存储OSS<br>
  使用阿里云OSS对象存储前需要注册阿里云账号登录官方阿里云，登录后在右上方或者中间搜索栏搜索：对象存储OSS，找到对象存储OSS，点击立即购买
  ![202302231220382.png](https://imgs.itchenliang.club/picture-ped-img/202302231220382.png)
  购买完成后，去[对象存储控制台](https://oss.console.aliyun.com/overview)
2. bucket 创建<br>
  在 [Bucket一栏](https://oss.console.aliyun.com/bucket) 点击“创建 Bucket”
  > 一般常规选择标准存储，公共读，一些推荐功能选不开通即可
  ![202302231223141.png](https://imgs.itchenliang.club/picture-ped-img/202302231223141.png)
3. 文件管理<br>
  创建完存储桶以后，点击文件管理，可以新建目录，在子目录中上传文件，多建各种目录可用于以后的文档归纳整理分类
  ![202302231223432.png](https://imgs.itchenliang.club/picture-ped-img/202302231223432.png)
  上传完毕后，查看文件内容，可以看到文件的一些元信息以及URL的分享连接，发送给他人时，浏览器打开直接可以下载文件
  ![202302231223556.png](https://imgs.itchenliang.club/picture-ped-img/202302231223556.png)
4. 获取 KeyId 和 KeySecret<br>
  进入[AccessKey管理页面](https://ram.console.aliyun.com/manage/ak)，点击“创建AccessKey”，创建完成后点击“查看Secret”，然后复制“AccessKey ID”和“AccessKey Secret”
  ![202302231226442.png](https://imgs.itchenliang.club/picture-ped-img/202302231226442.png)
5. 配置存储桶<br>
  ![202302231230236.png](https://imgs.itchenliang.club/picture-ped-img/202302231230236.png)
6. 最后点击确定即可完成创建
  ![2023022312314610.png](https://imgs.itchenliang.club/picture-ped-img/2023022312314610.png)


### 腾讯云 COS
**字段说明**
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
设定SecretId: 腾讯云SecretId
设定SecretKey: 腾讯云SecretKey
设定AppID: 腾讯云AppID
设定存储空间名: 腾讯云存储空间名
设定存储区域: 腾讯云存储空间所在存储区域
设定自定义域名: 存储桶访问域名，默认格式`https://${config.bucket}.cos.${config.area}.myqcloud.com/`
指定存储路径: 腾讯云存储路径，想要把图片存储在空间的什么位置，例如：img/
设定网址后缀: 腾讯云图片处理的后缀，例如给图片添加水印
```
1. 购买对象存储COS<br>
  使用腾讯云COS对象存储前需要注册腾讯云账号登录官方腾讯云，登录后在右上方或者中间搜索栏搜索：对象存储COS，找到对象存储COS，点击立即购买
  ![202302231234401.png](https://imgs.itchenliang.club/picture-ped-img/202302231234401.png)
  购买完成后，去[对象存储控制台](https://console.cloud.tencent.com/cos)
2. 存储桶创建<br>
  在 [存储桶列表一栏](https://console.cloud.tencent.com/cos/bucket) 点击“创建存储桶”
  > 按需要填写各项即可，需要注意的地方是访问权限的选择，默认是私有读写，适合存储隐私机密文件；本文选择了公有读私有写，是因为这个存储桶主要是做图床服务，用来存储图片，并能对外提供公开访问。
  ![202302231235524.png](https://imgs.itchenliang.club/picture-ped-img/202302231235524.png)
  创建成功后，来到存储桶列表，记录下存储桶的名称，和所属地域的代号，如图示例，也就是 ap-beijing。
3. 创建 API 秘钥<br>
  进入 [API 秘钥管理](https://console.cloud.tencent.com/cam/capi)，会提示是否使用子账号管理，可根据实际需要进行选择，这里我们直接使用主账号进行创建。直接点击“新建秘钥”等待创建完成，然后复制“APPID”、“SecretId”和“SecretKey”。
  ![202302231239335.png](https://imgs.itchenliang.club/picture-ped-img/202302231239335.png)
4. 配置存储桶<br>
  ![202302231242587.png](https://imgs.itchenliang.club/picture-ped-img/202302231242587.png)
5. 最后点击确定即可完成创建
  ![202302231244502.png](https://imgs.itchenliang.club/picture-ped-img/202302231244502.png)


### 又拍云USS
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
设定存储空间名: 又拍云存储空间名
设定操作员: 又拍云操作员账号
设定操作员密码: 又拍云操作员密码
设定加速域名: 存储桶访问域名，例如：http://xxx.test.upcdn.net
指定存储路径: 又拍云存储路径，想要把图片存储在空间的什么位置，例如：img/
设定网址后缀: 又拍云图片处理的后缀，例如给图片添加水印
```
1. 注册并完成实名<br>
  注册并实名认证[又拍云账号](https://www.upyun.com/)，然后进入[云存储USS](https://www.upyun.com/products/file-storage)开通对象存储服务。
2. 创建云存储服务<br>
  将操作员账号和密码保存下来,一会需要在存储桶配置需要用到!创建后会弹出服务创建成功并分配测试域名
  ![202302231249258.png](https://imgs.itchenliang.club/picture-ped-img/202302231249258.png)
3. 绑定域名<br>
  审核成功后右上角小铃铛处会有消息提醒,此时你的云储存服务就已经创建成功了,接下来开始配置图床.
  ![202302231250193.png](https://imgs.itchenliang.club/picture-ped-img/202302231250193.png)
  ![2023022312502510.png](https://imgs.itchenliang.club/picture-ped-img/2023022312502510.png)
4. 存储桶配置<br>
  ![202302231253208.png](https://imgs.itchenliang.club/picture-ped-img/202302231253208.png)
5. 最后点击确定即可完成创建
  ![202302231253395.png](https://imgs.itchenliang.club/picture-ped-img/202302231253395.png)


### Gitee
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
用户名: Gitee用户名
仓库名称: Gitee仓库名称
分支: Gitee仓库分支，默认为master
私人令牌: Gitee私人令牌
存储路径: Gitee存储路径，想要把图片存储在空间的什么位置，例如：img/
自定义路径: Gitee路径格式
```
1. 创建gitee仓库<br>
  首先，到[gitee官网](https://gitee.com/)注册一个账号。登录后，在右上角的+号处，点击“新建仓库”。
  ![202302231257226.png](https://imgs.itchenliang.club/picture-ped-img/202302231257226.png)
  按照下图所示，设置仓库信息。
  ![202302231257468.png](https://imgs.itchenliang.club/picture-ped-img/202302231257468.png)
2. 获取token（私人令牌）<br>
  在你的gitee头像处，进入设置。点击左侧的私人令牌，如下图。
  ![202302231258224.png](https://imgs.itchenliang.club/picture-ped-img/202302231258224.png)
  点击生成新令牌。先取消全选，再勾选projects，然后提交。
  ![202302231258437.png](https://imgs.itchenliang.club/picture-ped-img/202302231258437.png)
  复制生成的令牌并保存好，因为该窗口关闭后，将无法再查看该私人令牌。
  ![202302231259241.png](https://imgs.itchenliang.club/picture-ped-img/202302231259241.png)
3. 存储桶配置<br>
  ![202302231302311.png](https://imgs.itchenliang.club/picture-ped-img/202302231302311.png)
4. 最后点击确定即可完成创建
  ![202302231302563.png](https://imgs.itchenliang.club/picture-ped-img/202302231302563.png)


### Github + jsDelivr
```
存储桶名称: 此字段可自定义填写，仅用于页面上展示
用户名: Github用户名
仓库名称: Github仓库名称
分支: Github仓库分支，默认为main
私人令牌: Github私人令牌
存储路径: Github存储路径，想要把图片存储在空间的什么位置，例如：img/
提交说明: Github上传图片时的提交说明
```
1. 创建github仓库<br>
  首先，到[github官网](https://github.com/)注册一个账号。登录后，在右上角的+号处，点击“New Repository”。
  ![202302231307573.png](https://imgs.itchenliang.club/picture-ped-img/202302231307573.png)
  按照下图所示，设置仓库信息。
  ![202302231308223.png](https://imgs.itchenliang.club/picture-ped-img/202302231308223.png)
2. 获取token（私人令牌）<br>
  在主页依次选择【Settings】-【Developer settings】-【Personal access tokens】-【Generate new token】，填写好描述，勾选【repo】，然后点击【Generate token】生成一个Token，注意这个Token只会显示一次，自己先保存下来。
  ![202302231309012.png](https://imgs.itchenliang.club/picture-ped-img/202302231309012.png)
  ![202302231309091.png](https://imgs.itchenliang.club/picture-ped-img/202302231309091.png)
3. 存储桶配置<br>
  ![202302231311535.png](https://imgs.itchenliang.club/picture-ped-img/202302231311535.png)
  提交说明默认是`upload ${file.filename}`，例如上传图片`2022121013522710.png`，最终在github上看到的提交规范则是`upload 2022121013522710.png`，如下图
  ![202302231314276.png](https://imgs.itchenliang.club/picture-ped-img/202302231314276.png)
4. 最后点击确定即可完成创建
  ![202302231314453.png](https://imgs.itchenliang.club/picture-ped-img/202302231314453.png)


### 华为云OBS

### 青云qingstor

### 天翼云 OOS

### NextCloud网盘