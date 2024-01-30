/*
 Navicat Premium Data Transfer

 Source Server         : tengxun
 Source Server Type    : MySQL
 Source Server Version : 50715
 Source Host           : 124.222.54.192:3306
 Source Schema         : nest-picture-docker

 Target Server Type    : MySQL
 Target Server Version : 50715
 File Encoding         : 65001

 Date: 30/01/2024 11:28:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for album
-- ----------------------------
DROP TABLE IF EXISTS `album`;
CREATE TABLE `album`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '相册名称',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '相册描述',
  `access_type` int(11) NOT NULL COMMENT '访问权限',
  `access_pass` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '访问密码',
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '相册封面',
  `background` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '相册背景颜色',
  `sort` int(11) NOT NULL DEFAULT 1 COMMENT '相册排序，值越大越靠前',
  `view_num` int(11) NOT NULL DEFAULT 0 COMMENT '相册浏览量',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of album
-- ----------------------------

-- ----------------------------
-- Table structure for album_tag
-- ----------------------------
DROP TABLE IF EXISTS `album_tag`;
CREATE TABLE `album_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `album_id` int(11) NOT NULL COMMENT '相册id',
  `tags` json NOT NULL COMMENT '相册标签tags',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `album_id`(`album_id`) USING BTREE,
  CONSTRAINT `album_tag_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of album_tag
-- ----------------------------

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章标题',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章类型，可选file|folder|mind',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章存储位置',
  `public` tinyint(1) NOT NULL DEFAULT 0 COMMENT '文章状态，true-发布，false-草稿',
  `weight` int(11) NOT NULL DEFAULT 1 COMMENT '文章权重，值越大越靠前',
  `sha` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章sha，存储git的sha值',
  `theme` json NOT NULL COMMENT '文章所使用主题，由系统内置几套主题选择',
  `publishedAt` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章发布时间',
  `pid` int(11) NULL DEFAULT NULL COMMENT '上级id',
  `wid` int(11) NOT NULL COMMENT '关联知识库id',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid`) USING BTREE,
  INDEX `wid`(`wid`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  CONSTRAINT `article_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `article_ibfk_2` FOREIGN KEY (`wid`) REFERENCES `wiki` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_ibfk_3` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article
-- ----------------------------

-- ----------------------------
-- Table structure for bucket
-- ----------------------------
DROP TABLE IF EXISTS `bucket`;
CREATE TABLE `bucket`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '存储桶名称',
  `config` json NOT NULL COMMENT '存储桶配置',
  `weight` int(11) NOT NULL DEFAULT 1 COMMENT '排序权重',
  `visible` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否在上传区域显示',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `user_plugin_id` int(11) NOT NULL COMMENT '用户安装插件id',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  INDEX `user_plugin_id`(`user_plugin_id`) USING BTREE,
  CONSTRAINT `bucket_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `bucket_ibfk_2` FOREIGN KEY (`user_plugin_id`) REFERENCES `user_plugin` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bucket
-- ----------------------------

-- ----------------------------
-- Table structure for dict
-- ----------------------------
DROP TABLE IF EXISTS `dict`;
CREATE TABLE `dict`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '字典名称',
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '字典编码-唯一',
  `values` json NOT NULL COMMENT '字典名称',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dict
-- ----------------------------
INSERT INTO `dict` VALUES (1, '角色', 'user_role', '[{\"label\": \"管理员\", \"value\": 10}, {\"label\": \"普通用户\", \"value\": 1}]', '2023-08-24 07:31:35', '2023-08-30 05:11:33');
INSERT INTO `dict` VALUES (4, ' 用户性别', 'user_gender', '[{\"label\": \"男\", \"value\": \"男\"}, {\"label\": \"女\", \"value\": \"女\"}, {\"label\": \"阴阳人\", \"value\": \"阴阳人\"}, {\"label\": \"保密\", \"value\": \"保密\"}]', '2023-08-30 05:10:51', '2023-08-30 05:10:51');
INSERT INTO `dict` VALUES (5, '显示状态', 'show_status', '[{\"label\": \"显示\", \"value\": true}, {\"label\": \"不显示\", \"value\": false}]', '2023-08-30 05:11:05', '2023-08-30 05:11:05');
INSERT INTO `dict` VALUES (6, '用户职业', 'user_major', '[{\"label\": \"程序猿\", \"value\": \"程序猿\"}, {\"label\": \"程序媛\", \"value\": \"程序媛\"}, {\"label\": \"设计师\", \"value\": \"设计师\"}, {\"label\": \"开发者\", \"value\": \"开发者\"}, {\"label\": \"学生\", \"value\": \"学生\"}, {\"label\": \"其他\", \"value\": \"其他\"}]', '2023-08-30 05:11:17', '2023-08-30 05:11:17');
INSERT INTO `dict` VALUES (8, '插件所有类型', 'plugin_type', '[{\"label\": \"上传插件\", \"value\": \"uploader\"}, {\"label\": \"主题插件\", \"value\": \"themer\"}, {\"label\": \"全局插件\", \"value\": \"commander\"}, {\"label\": \"工具箱插件\", \"value\": \"tooler\"}]', '2023-08-30 08:20:14', '2024-01-29 09:33:41');
INSERT INTO `dict` VALUES (9, '插件运行环境', 'plugin_env', '[{\"label\": \"Nodejs\", \"value\": \"Node\"}, {\"label\": \"浏览器\", \"value\": \"Browser\"}]', '2023-08-30 08:29:38', '2023-10-07 06:40:59');

-- ----------------------------
-- Table structure for habits
-- ----------------------------
DROP TABLE IF EXISTS `habits`;
CREATE TABLE `habits`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户id',
  `shortKey` json NOT NULL COMMENT '快捷键设置',
  `showTip` json NOT NULL COMMENT '提示功能',
  `pasteStyle` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'url' COMMENT '上传后自动复制图片地址类型，支持：url、markdown',
  `autoPaste` tinyint(1) NOT NULL DEFAULT 0 COMMENT '上传后自动复制图片地址',
  `current_bucket` int(11) NULL DEFAULT NULL COMMENT '当前使用存储桶',
  `current_album` int(11) NULL DEFAULT NULL COMMENT '当前使用相册',
  `current_theme` json NULL COMMENT '当前使用主题',
  `link_format` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '![]($url)' COMMENT '链接格式，默认是 ![]($url)',
  `gallery_img_fit` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'none' COMMENT '图片层现方式',
  `gallery_img_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'origin_name' COMMENT '图片显示名称',
  `album_cover_fit` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'none' COMMENT '相册封面层现方式',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  CONSTRAINT `habits_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of habits
-- ----------------------------
INSERT INTO `habits` VALUES (22, 1, '[{\"id\": 1, \"key\": \"快捷上传\", \"label\": \"点击快捷键自动上传粘贴板中的图片\", \"value\": \"Command + K\"}, {\"id\": 2, \"key\": \"帮助中心\", \"label\": \"点击快捷键自动打开帮助中心窗口\", \"value\": \"Command + H\"}, {\"id\": 3, \"key\": \"个人中心\", \"label\": \"点击快捷键自动进入个人中心\", \"value\": \"Control + Shift + F\"}, {\"id\": 4, \"key\": \"上传网络图片\", \"label\": \"点击快捷键自动上传粘贴板中的网络图片\", \"value\": \"Command + P + C\"}, {\"id\": 5, \"key\": \"快捷退出\", \"label\": \"点击快捷键自动退出登录\", \"value\": \"Control + Shift + D\"}]', '{\"copy\": true, \"delete\": true, \"update\": true, \"upload\": true}', 'markdown', 0, 6, 0, '{\"id\": 0, \"plugin_id\": 0}', '[${filename}](${url})', 'cover', 'name', 'cover', '2023-08-25 04:25:11', '2024-01-30 02:05:29');

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片id',
  `bucket_id` int(11) NOT NULL COMMENT '存储桶id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片名称，自动生成的名称(可修改)',
  `origin_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片原名称',
  `width` int(11) NOT NULL COMMENT '图片宽度',
  `height` int(11) NOT NULL COMMENT '图片高度',
  `mime_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片媒体类型，如: image/png',
  `url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片存储相对路径，如: img/202304071707109.png',
  `size` int(11) NOT NULL COMMENT '图片大小，单位byte',
  `hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片sha',
  `weight` int(11) NOT NULL DEFAULT 1 COMMENT '图片权重，排序值',
  `baseurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图片基地址，存储存储桶的访问前缀',
  `config` json NOT NULL COMMENT '图片基地址',
  `tags` json NOT NULL COMMENT '图片基地址',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `album_id` int(11) NULL DEFAULT NULL COMMENT '相册id',
  `add_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '添加相册时间',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 681 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of image
-- ----------------------------

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL COMMENT '日志类型',
  `operate_id` int(11) NOT NULL COMMENT '操作记录id',
  `operate_cont` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '操作记录内容',
  `client_info` json NOT NULL COMMENT '操作记录id',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户邮箱',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1011 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of log
-- ----------------------------
INSERT INTO `log` VALUES (1010, 64, 19, '安装了插件[本地存储上传插件]', '{\"ip\": \"172.20.0.3\", \"city\": \"未知\", \"type\": \"baidu\", \"adcode\": \"\", \"district\": \"未知\", \"province\": \"未知\", \"rectangle\": {\"x\": \"\", \"y\": \"\"}}', 1, '2024-01-30 03:26:27', '2024-01-30 03:26:27', 'admin@163.com');

-- ----------------------------
-- Table structure for plugin
-- ----------------------------
DROP TABLE IF EXISTS `plugin`;
CREATE TABLE `plugin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '插件id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件名称，对应npm包名称',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件描述，自动从npm包package.json中获取',
  `version` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件版本号，从所有版本中选择，默认取最新版本',
  `logo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件logo，自动从npm包package.json中获取',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件别名，页面上所显示的插件名称',
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件作者，自动从npm包package.json中获取',
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件类别，目前支持themer|uploader|transformer|handler|commander',
  `platform` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '插件运行环境，Node|Browser',
  `downloadCounts` int(11) NOT NULL DEFAULT 0 COMMENT '插件安装次数，安装一次累加一次',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '插件状态，是否用户可见',
  `weight` int(11) NOT NULL DEFAULT 1 COMMENT '插件权重，权重越大越靠前',
  `payment` tinyint(1) NOT NULL DEFAULT 0 COMMENT '插件是否需要付费',
  `payment_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'free' COMMENT '插件付费版本',
  `price` float NOT NULL DEFAULT 0 COMMENT '插件付费需设置价格',
  `tags` json NOT NULL COMMENT '插件标签',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of plugin
-- ----------------------------
INSERT INTO `plugin` VALUES (5, '@itchenliang/picture-rollup-oss-plugin', '轻快图片管理系统的插件：使用rollup开发的阿里云对象存储(oss)插件', '1.0.13', 'https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico', '阿里云OSS存储上传插件', 'itchenliang', 'uploader', 'Node', 2, 1, 5, 0, 'free', 0, '[]', '2023-09-01 07:37:01', '2024-01-29 05:50:52');
INSERT INTO `plugin` VALUES (6, '@itchenliang/picture-rollup-qiniu-plugin', '轻快图片管理系统的插件：使用rollup开发的七牛云对象存储(kodo)插件', '1.1.6', 'https://qiniu.staticfile.org/favicon.ico', '七牛云Kodo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 6, 0, 'free', 0, '[]', '2023-09-15 07:19:10', '2023-09-18 09:36:10');
INSERT INTO `plugin` VALUES (7, '@itchenliang/picture-rollup-bilibili-plugin', '轻快图片管理系统的插件：使用rollup开发的哔哩哔哩图片上传插件', '1.0.11', 'https://www.bilibili.com/favicon.ico', '哔哩哔哩存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 7, 0, 'free', 0, '[]', '2023-09-18 02:16:19', '2023-09-18 05:45:30');
INSERT INTO `plugin` VALUES (9, '@itchenliang/picture-rollup-yopngs-plugin', '轻快图片管理系统的插件：使用rollup开发的有图床图片上传插件', '1.0.3', 'https://www.yopngs.com/favicon.png', '有图床存储上传插件', 'itchenliang', 'uploader', 'Node', 3, 1, 8, 0, 'free', 0, '[]', '2023-09-18 05:32:35', '2024-01-27 06:29:48');
INSERT INTO `plugin` VALUES (10, '@itchenliang/picture-rollup-cos-plugin', '轻快图片管理系统的插件：使用rollup开发的腾讯云对象存储COS图片上传插件', '1.0.3', 'https://cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/shareicons/cloud.png', '腾讯云COS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 9, 0, 'free', 0, '[]', '2023-09-18 06:19:39', '2024-01-29 05:50:45');
INSERT INTO `plugin` VALUES (11, '@itchenliang/picture-rollup-uss-plugin', '轻快图片管理系统的插件：使用rollup开发的又拍云对象存储USS图片上传插件', '1.0.1', 'https://www.upyun.com/static/favicon-64x64.png', '又拍云USS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 10, 0, 'free', 0, '[]', '2023-09-18 06:45:12', '2024-01-29 05:50:41');
INSERT INTO `plugin` VALUES (12, '@itchenliang/picture-rollup-mdnice-plugin', '轻快图片管理系统的插件：使用rollup开发的墨滴社区图片上传插件', '1.0.2', 'https://mdnice.com/favicon.svg', '墨滴社区存储上传插件', 'itchenliang', 'uploader', 'Node', 2, 1, 11, 0, 'free', 0, '[]', '2023-09-18 07:09:17', '2023-12-08 09:50:23');
INSERT INTO `plugin` VALUES (13, '@itchenliang/picture-rollup-gitee-plugin', '轻快图片管理系统的插件：使用rollup开发的Gitee图片上传插件', '1.0.5', 'https://cn-assets.gitee.com/assets/favicon-9007bd527d8a7851c8330e783151df58.ico', 'Gitee存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 12, 0, 'free', 0, '[]', '2023-09-18 07:57:56', '2023-09-18 08:22:42');
INSERT INTO `plugin` VALUES (14, '@itchenliang/picture-rollup-github-plugin', '轻快图片管理系统的插件：使用rollup开发的Github图片上传插件', '1.0.2', 'https://github.com/favicon.ico', 'Github存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 13, 0, 'free', 0, '[]', '2023-09-18 08:40:37', '2024-01-29 05:50:30');
INSERT INTO `plugin` VALUES (15, '@itchenliang/picture-rollup-obs-plugin', '轻快图片管理系统的插件：使用rollup开发的华为云对象存储obs图片上传插件', '1.0.9', 'https://www.huaweicloud.com/favicon.ico', '华为云OBS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 14, 0, 'free', 0, '[]', '2023-09-18 09:35:56', '2023-09-19 02:56:44');
INSERT INTO `plugin` VALUES (16, '@itchenliang/picture-rollup-minio-plugin', '轻快图片管理系统的插件：使用rollup开发的Minio存储图片上传插件', '1.0.1', 'https://www.minio.org.cn/favicon.ico', 'Minio存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 15, 0, 'free', 0, '[]', '2023-09-19 03:13:44', '2024-01-29 05:50:20');
INSERT INTO `plugin` VALUES (17, '@itchenliang/picture-rollup-qingstor-plugin', '轻快图片管理系统的插件：使用rollup开发的青云对象存储qingstor图片上传插件', '1.0.0', 'https://s4.qingcloud.com/static/assets/images/favicon.ico', '青云qingstor存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 16, 0, 'free', 0, '[]', '2023-09-19 04:02:58', '2023-09-19 04:03:15');
INSERT INTO `plugin` VALUES (18, '@itchenliang/picture-rollup-alist-plugin', '轻快图片管理系统的插件：使用rollup开发的AList图片上传插件', '1.0.2', 'https://alist.nn.ci/favicon.ico', 'Alist存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 17, 0, 'free', 0, '[]', '2023-09-19 04:46:11', '2024-01-29 05:50:14');
INSERT INTO `plugin` VALUES (19, '@itchenliang/picture-rollup-local-plugin', '轻快图片管理系统的插件：使用rollup开发的本地存储图片上传插件', '1.0.10', 'https://files.mdnice.com/user/31298/1e995a4e-3423-4003-96a8-b1e64119c86f.png', '本地存储上传插件', 'itchenliang', 'uploader', 'Node', 4, 1, 18, 0, 'free', 0, '[]', '2023-09-19 05:32:38', '2024-01-30 03:26:26');
INSERT INTO `plugin` VALUES (21, '@itchenliang/picture-rollup-leancloud-plugin', '轻快图片管理系统的插件：使用rollup开发的leancloud存储图片上传插件', '1.0.13', 'https://www.leancloud.cn/favicon.ico', 'Leancloud存储上传插件', 'itchenliang', 'uploader', 'Node', 4, 0, 19, 0, 'free', 0, '[]', '2023-09-20 02:38:51', '2023-10-08 09:02:25');
INSERT INTO `plugin` VALUES (22, '@itchenliang/picture-rollup-csdn-plugin', '轻快图片管理系统的插件：使用rollup开发的csdn存储图片上传插件', '1.0.2', 'https://g.csdnimg.cn/static/logo/favicon32.ico', 'CSDN存储上传拆插件', 'itchenliang', 'uploader', 'Node', 2, 1, 20, 0, 'free', 0, '[\"uploader\", \"plugin\", \"csdn\", \"blog\", \"picture\"]', '2023-09-20 06:20:19', '2024-01-28 08:26:11');
INSERT INTO `plugin` VALUES (23, '@itchenliang/picture-rollup-ucloud-plugin', '轻快图片管理系统的插件：使用rollup开发的ucloud云对象存储US3图片上传插件', '1.0.0', 'https://www.ucloud.cn/favicon.ico?v=2023091301', 'Ucloud云对象存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 0, 21, 0, 'free', 0, '[\"uploader\", \"plugin\", \"ucloud\", \"US3\", \"picture\"]', '2023-09-20 08:25:35', '2024-01-29 05:07:39');
INSERT INTO `plugin` VALUES (24, '@itchenliang/picture-rollup-postimage-plugin', '轻快图片管理系统的插件：使用rollup开发的postimage存储图片上传插件，支持设定图片过期时间和是否缩放图片功能。', '1.0.7', 'https://postimgs.org/favicon.ico', 'Postimage存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 22, 0, 'free', 0, '[\"uploader\", \"plugin\", \"postimage\", \"storage\", \"picture\"]', '2023-09-21 05:02:18', '2023-09-21 10:02:22');
INSERT INTO `plugin` VALUES (25, '@itchenliang/picture-rollup-nextcloud-plugin', '轻快图片管理系统的插件：使用rollup开发的nextcloud存储图片上传插件。', '1.0.3', 'https://nextcloud.com/wp-content/uploads/2022/03/favicon.png', 'Nextcloud存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 23, 0, 'free', 0, '[\"uploader\", \"plugin\", \"nextcloud\", \"storage\", \"picture\"]', '2023-09-21 08:05:04', '2024-01-29 05:49:50');
INSERT INTO `plugin` VALUES (26, '@itchenliang/picture-rollup-cloudflare-plugin', '轻快图片管理系统的插件：使用rollup开发的cloudflare存储图片上传插件。', '1.0.1', 'https://www.cloudflare.com/favicon.ico', 'Cloudflare存储上传插件', 'itchenliang', 'uploader', 'Node', 0, 1, 24, 0, 'free', 0, '[\"uploader\", \"plugin\", \"cloudflare\", \"storage\", \"picture\"]', '2023-09-21 08:32:09', '2024-01-29 05:01:46');
INSERT INTO `plugin` VALUES (27, '@itchenliang/picture-rollup-coding-plugin', '轻快图片管理系统的插件：使用rollup开发的coding存储图片上传插件。', '1.0.7', 'https://help-assets.codehub.cn/enterprise/guanwang/favicon.ico', 'Coding存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 27, 0, 'free', 0, '[\"uploader\", \"plugin\", \"coding\", \"storage\", \"picture\"]', '2023-09-21 09:24:25', '2024-01-29 05:49:03');
INSERT INTO `plugin` VALUES (28, '@itchenliang/picture-rollup-azure-plugin', '轻快图片管理系统的插件：使用rollup开发的azure repo存储上传插件', '1.0.9', 'https://azure.microsoft.com/favicon.ico', 'AzureRepo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 25, 0, 'free', 0, '[\"uploader\", \"plugin\", \"azure\", \"storage\", \"repo\"]', '2023-09-22 06:55:05', '2024-01-29 06:07:23');
INSERT INTO `plugin` VALUES (29, '@itchenliang/picture-rollup-gitlab-plugin', '轻快图片管理系统的插件：使用rollup开发的gitlab repo存储上传插件', '1.0.3', 'https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png', 'GitlabRepo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 26, 0, 'free', 0, '[\"uploader\", \"plugin\", \"gitlab\", \"storage\", \"repo\"]', '2023-09-22 09:34:23', '2024-01-29 05:49:20');
INSERT INTO `plugin` VALUES (31, '@itchenliang/picture-rollup-segmentfault-plugin', '轻快图片管理系统的插件：使用rollup开发的思否存储图片上传插件。', '1.0.1', 'https://static.segmentfault.com/main_site_next/c395bbfb/favicon.ico', '思否社区存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 28, 0, 'free', 0, '[\"uploader\", \"plugin\", \"segmentfault\", \"思否\", \"picture\"]', '2023-09-27 09:47:42', '2024-01-29 04:09:21');
INSERT INTO `plugin` VALUES (32, '@itchenliang/picture-rollup-tencent-plugin', '轻快图片管理系统的插件：使用rollup开发的腾讯云开发者社区存储图片上传插件。', '1.0.0', 'https://cloud.tencent.com/favicon.ico', '腾讯开发者社区存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 0, 29, 0, 'free', 0, '[\"uploader\", \"plugin\", \"腾讯云\", \"开发者社区\", \"picture\"]', '2023-09-28 06:08:39', '2023-12-08 09:58:58');
INSERT INTO `plugin` VALUES (33, '@itchenliang/picture-plugin-uuid', 'UUID全称为通用唯一识别码（Universally Unique Identifier），是一种标准化的标识符，在计算机系统中广泛应用，用于唯一标识对象、实体或信息。UUID由128位数字组成，通常以32个十六进制数字的形式表示，中间使用连字符进行分隔。', '1.0.9', 'https://files.mdnice.com/user/31298/06f32ee8-5135-4149-8572-cefc7bfeeaa7.png', 'UUID生成器', 'itchenliang', 'tooler', 'Browser', 2, 1, 30, 0, 'free', 0, '[\"tooler\", \"plugin\", \"uuid\", \"UUID\"]', '2024-01-10 00:47:58', '2024-01-29 05:48:40');
INSERT INTO `plugin` VALUES (34, '@itchenliang/picture-plugin-img-cutter', '简单易用的在线裁剪图片工具，支持gif、png、jpg、jpeg等图片裁剪，同时也支持裁剪远程图片。', '1.0.3', 'https://files.mdnice.com/user/31298/a5b9e591-b9cb-4c2c-8a3e-f7a1650a8155.png', '在线图片裁剪', 'itchenliang', 'tooler', 'Browser', 1, 1, 31, 0, 'free', 0, '[\"tooler\", \"plugin\", \"image\", \"cutter\", \"工具\"]', '2024-01-11 04:38:26', '2024-01-29 03:27:27');
INSERT INTO `plugin` VALUES (35, '@itchenliang/picture-plugin-code2image', '简单易用的代码转图片的工具，快速将源代码转换成美丽图像的在线工具。', '1.0.3', 'https://files.mdnice.com/user/31298/05b6e50e-4bcf-4966-b73f-04ae528e8094.png', '代码转图片', 'itchenliang', 'tooler', 'Browser', 1, 1, 32, 1, 'limited_free', 24, '[\"tooler\", \"plugin\", \"image\", \"code\", \"工具\"]', '2024-01-12 11:18:26', '2024-01-16 01:51:51');
INSERT INTO `plugin` VALUES (37, '@itchenliang/picture-plugin-theme-dark', 'vscode暗黑主题', '1.0.3', 'https://files.mdnice.com/user/31298/8d1cbe32-6fa5-4f9f-bd15-e269d473bea0.png', '暗黑主题', 'itchenliang', 'themer', 'Browser', 5, 1, 34, 0, 'free', 0, '[\"tooler\", \"plugin\", \"theme\", \"dark\", \"主题\"]', '2024-01-17 02:00:01', '2024-01-29 03:25:45');
INSERT INTO `plugin` VALUES (38, '@itchenliang/picture-plugin-theme-monokai', 'vscode之Monokai主题', '1.0.2', 'https://files.mdnice.com/user/31298/df4c9089-fb8f-4b4f-86df-27856d0b203b.png', 'Monokai主题', 'itchenliang', 'themer', 'Browser', 3, 1, 35, 0, 'free', 0, '[\"themer\", \"plugin\", \"theme\", \"monokai\", \"主题\"]', '2024-01-17 08:43:34', '2024-01-29 03:26:25');
INSERT INTO `plugin` VALUES (39, '@itchenliang/picture-plugin-theme-onedark', 'vscode之one dark pro主题', '1.0.2', 'https://files.mdnice.com/user/31298/cf5969e9-e667-458e-8d7a-ba4ae5bdaaec.png', 'OneDarkPro主题', 'itchenliang', 'themer', 'Browser', 2, 1, 36, 0, 'free', 0, '[\"themer\", \"plugin\", \"theme\", \"one dark\", \"主题\"]', '2024-01-18 09:38:07', '2024-01-29 03:25:35');
INSERT INTO `plugin` VALUES (40, '@itchenliang/picture-plugin-image2base64', '一个生成图片的Base64编码数据的在线工具。', '1.0.4', 'https://files.mdnice.com/user/31298/b85be754-6f64-4666-99e7-459fda565bf2.png', '图片Base64编码', 'itchenliang', 'tooler', 'Browser', 4, 1, 37, 0, 'free', 0, '[\"tooler\", \"plugin\", \"image\", \"base64\", \"dataURI\"]', '2024-01-22 02:34:38', '2024-01-29 03:09:47');

-- ----------------------------
-- Table structure for setting
-- ----------------------------
DROP TABLE IF EXISTS `setting`;
CREATE TABLE `setting`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `website` json NOT NULL COMMENT '网站信息',
  `contact` json NOT NULL COMMENT '联系我们',
  `system` json NOT NULL COMMENT '系统配置',
  `uplog` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新日志',
  `bucket_service` json NOT NULL COMMENT '右上角菜单配置',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of setting
-- ----------------------------
INSERT INTO `setting` VALUES (1, '{\"ico\": \"https://cdn.yopngs.com/2023/10/12/594e5a00-b98b-49c9-bb68-d27a2e01efd2.png\", \"desc\": \"图片上传+管理新体验的轻量级图片管理系统、图床系统\", \"keys\": [\"图床\", \"图片管理\", \"插件管理\", \"图床系统\", \"知识库管理\", \"文档管理\"], \"logo\": \"https://cdn.yopngs.com/2023/10/12/594e5a00-b98b-49c9-bb68-d27a2e01efd2.png\", \"name\": \"轻快图片管理系统\", \"title\": \"\", \"author\": \"itchenliang\", \"domain\": \"\", \"baseUrl\": \"\", \"version\": \"1.0.0\", \"subtitle\": \"\", \"ico_preview\": \"\", \"logo_preview\": \"http://lc-DZNcsGI3.cn-n1.lcfile.com/e4TyxC3fN5Mxq2P8PxFHcCbllUPoLzhE/logo.png\", \"reward_alipay\": \"http://lc-dzncsgi3.cn-n1.lcfile.com/FnXBNkKfhnOYoLppJGSWQY6dUh1rnMHA/reward_alipay.jpg\", \"reward_weixin\": \"http://lc-dzncsgi3.cn-n1.lcfile.com/PAMB9Ah4luFLiVvwp6oVh6pelyPudsNK/reward_weixin.jpg\", \"reward_alipay_preview\": \"\", \"reward_weixin_preview\": \"\"}', '{\"qq\": \"1825956830\", \"about\": \"轻快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，支持在线存储桶插件开发，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、本地存储桶、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示.\\n\\n\\n快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，支持在线存储桶插件开发，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、**本地存储桶**、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示\\n\\n快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，**支持在线存储桶插件开发**，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、本地存储桶、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示\\n\", \"email\": \"\", \"gitee\": \"https://gitee.com/itchenliang\", \"github\": \"https://github.com/ischenliang\", \"weixin\": \"CL13281289371\", \"qq_group\": \"\"}', '{\"accept\": [\"jpeg\", \"jpg\", \"webp\", \"ico\", \"gif\", \"png\", \"svg\", \"svgz\"], \"map_key\": \"\", \"maxsize\": 20, \"icon_url\": \"\", \"map_type\": \"baidu\", \"maxcount\": 30, \"icon_font\": \"\", \"mail_pass\": \"stjflvegjjumbbfa\", \"mail_user\": \"itchenliang@163.com\", \"icon_prefix\": \"\", \"storage_size\": 1, \"storage_count\": 1, \"copyright_time\": \"上午9:00~下午18:00\", \"enable_chatgpt\": false, \"enable_register\": true, \"copyright_company\": \"itchenliang\", \"copyright_miiturl\": \"https://beian.miit.gov.cn/\", \"copyright_miitbeian\": \"蜀ICP备19023554号-2\"}', '## 2024-01-26\n- `U`知识库文档管理功能实现，支持在线markdown编辑(bytemd)和预览\n- `A`自定义bytemd编辑器主题切换插件功能，同时支持渲染与编辑时使用\n- `U`调整新增知识库时只能关联Gitee仓库(Github由于是国外镜像很多时候会出现无法访问问题)\n- `U`知识库交互优化，鼠标移入知识库项支持动画效果\n\n## 2024-01-08\n- `U`修复覆盖上传图片时无法预览\n  > 同时如果是覆盖上传则无需要再预览中新增记录，而是直接更新记录\n- `U`修改原始的认证失败后的操作策略\n- `U`修改退出登录后的操作策略\n- `U`修复创建存储桶时只能选择上传插件(uploader)\n- `U`获取用户已安装插件时新增`type`类型，用于区别获取什么类型的插件\n\n## 2023-12-21\n- `A`新增图库中的图片可以批量移入相册\n- `A`新增可以启用或关闭注册和chatgpt功能\n- `U`修复盖上传图片未生效问题\n- `U`修复存储桶数据迁移之导出excel错误问题\n- `A`操作日志新增按类别查询\n- `A`相册新增分类查询和分页查询\n- `U`调整全局样式统一，包括搜索条件、列表展现方式等\n- `A`新增用户偏好设置的图片名称显示规则(原名称|时间戳名称)、图库图片呈现方式(object-fit)、相册封面呈现方式(object-fit)\n\n', '[{\"link\": \"https://ejq9qy8emd.feishu.cn/docx/Eo1HdFD7noXoSlxfRfWcYyzJnpf\", \"label\": \"文档中心\", \"target\": \"_blank\"}, {\"link\": \"https://github.com/ischenliang/quickly-picture-bed\", \"label\": \"Github\", \"target\": \"_blank\"}, {\"link\": \"https://gitee.com/itchenliang/quickly-picture-bed\", \"label\": \"Gitee\", \"target\": \"_blank\"}]', '2023-08-25 06:06:59', '2024-01-30 03:28:30');

-- ----------------------------
-- Table structure for smscode
-- ----------------------------
DROP TABLE IF EXISTS `smscode`;
CREATE TABLE `smscode`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '账号，邮箱或者手机号',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类别，可选email|phone',
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '验证码内容',
  `expire_at` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '验证码有效期',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of smscode
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户邮箱',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '默认名称' COMMENT '用户昵称',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `role` int(11) NULL DEFAULT 1 COMMENT '角色',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '星座_白羊座' COMMENT '头像',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '自我描述',
  `major` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '职业',
  `address` json NULL COMMENT '地址',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '用户状态',
  `config` json NULL COMMENT '用户配置',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '性别',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE,
  UNIQUE INDEX `phone`(`phone`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin@163.com', '管理员', '132xxxx9371', '5a8366fc9da3ff99c9b5a21702664735', 10, '星座_白羊座', '这是我的个人简介哈........', '程序猿', '[\"11\", \"1101\", \"110101\"]', 1, '{\"chatgpt\": true}', '2023-08-19 09:13:16', '2024-01-30 03:26:00', '保密');

-- ----------------------------
-- Table structure for user_plugin
-- ----------------------------
DROP TABLE IF EXISTS `user_plugin`;
CREATE TABLE `user_plugin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '插件id，关联插件表',
  `uid` int(11) NOT NULL COMMENT '用户id，关联用户表',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '插件状态，停用还是启用',
  `version` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '当前安装的插件版本号',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  CONSTRAINT `user_plugin_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `plugin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_plugin_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 65 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_plugin
-- ----------------------------
INSERT INTO `user_plugin` VALUES (64, 19, 1, 1, '1.0.10', '2024-01-30 03:26:26', '2024-01-30 03:26:26');

-- ----------------------------
-- Table structure for verifycode
-- ----------------------------
DROP TABLE IF EXISTS `verifycode`;
CREATE TABLE `verifycode`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` blob NOT NULL COMMENT '验证码内容',
  `anser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '验证码答案',
  `expire_at` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '验证码有效期',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1398 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of verifycode
-- ----------------------------
INSERT INTO `verifycode` VALUES (1397, 0x646174613A696D6167652F7376672B786D6C3B6261736536342C50484E325A79423462577875637A30696148523063446F764C336433647935334D793576636D63764D6A41774D43397A646D6369494864705A48526F505349784D4441694947686C6157646F644430694E44416949485A705A58644362336739496A41734D4377784D4441734E444169506A78795A574E30494864705A48526F505349784D44416C4969426F5A576C6E61485139496A45774D43556949475A706247773949694E6C4D6D55355A6A45694C7A3438634746306143426D615778735053496A596D4D314F47526C4969426B50534A4E4E6A67754F4455674D6A55754D7A6C4D4E6A67754F4455674D6A55754D7A6C4D4E6A67754F5445674D6A55754E4452524E7A45754D4449674D6A55754D6A45674E7A4D754D546B674D6A55754D6A684D4E7A4D754D5451674D6A55754D6A4E4D4E7A4D754D4463674D6A55754D545A524E7A4D754D5467674D6A4D754E5463674E7A4D754D5467674D6A45754F54524D4E7A4D754D546B674D6A45754F54564D4E7A4D754D446B674D6A45754F4456524E7A4D754D5449674D6A41754D6A41674E7A4D754D6A55674D5467754E44644D4E7A4D754D546B674D5467754E44464D4E7A4D754D5455674D5467754D7A64524E7A49754E4467674D546B754E6A6B674E6A67754F5451674D6A55754E446461545463314C6A593149444D774C6A5131544463314C6A557849444D774C6A4D79544463314C6A557749444D774C6A4D78555463304C6A513049444D774C6A45334944637A4C6A497949444D774C6A45795444637A4C6A453349444D774C6A41335444637A4C6A453049444D774C6A41305554637A4C6A4130494449344C6A5132494463794C6A6B32494449324C6A63355444637A4C6A417A494449324C6A67315444637A4C6A4178494449324C6A677A555459354C6A5577494449324C6A6778494459324C6A4D77494449334C6A6333544459324C6A4D77494449334C6A6333544459324C6A4932494449334C6A637A555459324C6A4931494449334C6A4D78494459324C6A4D34494449324C6A5930544459324C6A4D31494449324C6A5978544459324C6A4D7A494449324C6A5534555459334C6A5933494449304C6A5533494463774C6A4577494449774C6A4D78544463774C6A4134494449774C6A4935544463774C6A4132494449774C6A4933555463794C6A4135494445334C6A4179494463304C6A5178494445304C6A4D35544463304C6A4D32494445304C6A4D30544463304C6A4D77494445304C6A4934555463304C6A6B35494445304C6A4931494463324C6A457A494445304C6A4133544463324C6A4578494445304C6A4131544463324C6A4531494445304C6A4134555463304C6A6734494445344C6A5133494463304C6A67344944497A4C6A4931544463304C6A63354944497A4C6A4533544463304C6A637A4944497A4C6A4577555463304C6A6378494449304C6A4135494463304C6A6332494449314C6A4577544463304C6A6330494449314C6A4133544463314C6A637A494449314C6A4933544463314C6A597A494449314C6A4532555463324C6A4530494449314C6A4934494463324C6A5531494449314C6A4D32544463324C6A5131494449314C6A4932544463324C6A557A494449314C6A4D30555463324C6A6378494449324C6A4578494463324C6A6735494449334C6A517A544463324C6A637A494449334C6A4934544463324C6A6377494449334C6A4930555463314C6A6B78494449334C6A4577494463304C6A6B78494449324C6A6B33544463304C6A6B31494449334C6A4179544463304C6A6B31494449334C6A4179555463314C6A4977494449344C6A5134494463314C6A593249444D774C6A5133576B30334E6934344D5341794E5334784F4577334E6934334D6941794E5334774F5577334E6934344D4341794E5334784F4645334E6934314E7941794E5334774D6941334E6934304E4341794E5334774D6B77334E6934304D7941794E5334774D5577334E6934794D6941794E5334774E6B77334E6934784D6941794E4334354E5645334E6934794D5341794E4334784D6941334E6934794D5341794D7934784E6B77334E6934774E4341794D6934354F5577334E6934774E6941794D7934774D5645334E6934774F4341784F4334324F5341334E7934304F4341784E4334324D5577334E7934314F5341784E4334334D6B77334E7934314D6941784E4334324E6C45334E7934774E5341784E4334344F4341334E6934774E7941784E5334784E4577334E6934774D6941784E5334774F5577334E5334354F5341784E5334774E6C45334E6934784F5341784E4334314F5341334E6934314D4341784D7934324E4577334E6934314E4341784D7934324E3077334E6934314F4341784D7934334D5645334E5334324F5341784D7934354E6941334E4334794F5341784E4334784D5577334E4334784E6941784D7934354F5577334E4334794D7941784E4334774E6C45334D5334314D5341784E6934354E4341324E7934354E7941794D79347A4D4577324F4334774D5341794D79347A4D3077324F53347A4E6941794D4334334F4577324F5334314D6941794D4334354E4645324F5334784D4341794D5334314D4341324F4334354D6941794D5334344F5577324F4334354E5341794D5334354D6B77324E5334344E6941794E7934354F4577324E5334354F5341794F4334784D4645324E6934304E6941794F4334774D7941324E7934794D7941794E7934334E3077324E7934794E5341794E7934334F5577324E7934774E4341794E7934344E4577324E7934784D4341794E7934354D4645324E6934354E4341794F4334794F4341324E6934334D7941794F5334784D3077324E6934334D7941794F5334784D3077324E6934324E7941794F5334774E3145324F5334314E5341794F4334794E6941334D6934344D7941794F43347A4F5577334D6934344D7941794F43347A4F4577334D6934344E6941794F4334304D5645334D6934344E4341794F5334774D5341334D6934354E79417A4D43347A4E6B77334D6934354E79417A4D43347A4E6B77334D6934354D69417A4D43347A4D5645334D7934334F53417A4D4334304E5341334E4334314D53417A4D4334314D3077334E4334314D79417A4D4334314E5577334E4334304F53417A4D4334314D5645334E4334304E79417A4D4334344E5341334E4334324E53417A4D5334334F4577334E4334344D53417A4D5334354E4577334E4334324F43417A4D5334344D5645334E6934774E53417A4D6934774E4341334F4334774F53417A4D6934324E6B77334F4334784D53417A4D6934324F4577334F4334784E43417A4D6934334D6C45334E7934304D53417A4D5334794D5341334E6934334F5341794F4334354F5577334E6934344D7941794F5334774D3077334E7934344E4341794F53347A4E3077334E7934334F5341794F53347A4D6C45334F4334784D7941794F53347A4E5341334F4334324D4341794F5334314F4577334F4334334E7941794F5334334E6B77334F4334334D6941794F5334334D4645334F4334784E7941794E7934354F5341334F4334774E7941794E6934344E6B77334F4334784D6941794E6934354D5577334E7934354F4341794E6934334E6C45334E7934314F4341794E6934324E5341334E6934344D4341794E6934304F5577334E6934344D5341794E6934314D4577334E6934354D7941794E6934324D6C45334E6934334E4341794E5334334D4341334E6934334E4341794E5334784D56704E4E7A45754D7A41674D6A55754D44424D4E7A45754D6A67674D6A51754F54644D4E7A45754D7A51674D6A55754D4452524E7A45754F4441674D6A51754D5441674E7A49754F4459674D6A49754D7A644D4E7A49754F544D674D6A49754E44524D4E7A49754E7A67674D6A49754D6A6C524E7A49754F5455674D6A4D754D5445674E7A49754F5449674D6A4D754E7A564D4E7A49754E7A55674D6A4D754E54684D4E7A49754F4455674D6A4D754E6A68524E7A49754F5449674D6A51754E4449674E7A49754F5455674D6A55754D44644D4E7A49754E7A63674D6A51754F446C4D4E7A49754F4459674D6A51754F5468524E7A49754E4455674D6A51754F544D674E7A49754D4459674D6A51754F544E4D4E7A49754D444D674D6A51754F446C4D4E7A49754D5445674D6A51754F5468524E7A45754E7A6B674D6A55754D4463674E7A45754D7A63674D6A55754D4464614969382B50484268644767675A6D6C7362443069497A5A6A4E324D345A4349675A443069545451344C6A4177494449354C6A6778544451344C6A4130494449354C6A6731544451334C6A6B78494449354C6A637A555451334C6A5979494449354C6A6733494451334C6A4532494449354C6A6B77544451334C6A4131494449354C6A6777544451334C6A4134494449354C6A6779555451324C6A5532494449354C6A6731494451324C6A4577494449354C6A6731544451324C6A4533494449354C6A6B79544451324C6A4579494449354C6A6733555451324C6A4D7A494449334C6A5131494451324C6A4D7A494449314C6A4579544451324C6A5134494449314C6A4933544451324C6A5179494449314C6A4978555451314C6A4534494449314C6A497A494451304C6A5532494449314C6A497A544451304C6A5579494449314C6A4535544451304C6A5134494449314C6A45315554517A4C6A6735494449314C6A4530494451794C6A5931494449314C6A4135544451794C6A6377494449314C6A457A544451794C6A6335494449314C6A4979555451794C6A6730494449314C6A4132494451794C6A63784944497A4C6A4D34544451794C6A59774944497A4C6A4933544451794C6A59774944497A4C6A4933555451304C6A4D324944497A4C6A5932494451324C6A4D334944497A4C6A5932544451324C6A4D324944497A4C6A5931544451324C6A51794944497A4C6A6378555451324C6A4934494449774C6A6331494451314C6A6B35494445344C6A6B35544451324C6A4177494445354C6A4178544451314C6A6734494445344C6A6734555451324C6A5134494445354C6A4179494451334C6A4179494445354C6A4179544451334C6A4578494445354C6A4577544451344C6A457A494445354C6A4178544451344C6A4579494445354C6A4177555451344C6A4179494449784C6A6B31494451344C6A41794944497A4C6A6378544451344C6A41784944497A4C6A6377544451334C6A6B304944497A4C6A597A555451354C6A51334944497A4C6A5935494455784C6A59304944497A4C6A5131544455784C6A59794944497A4C6A517A544455784C6A55794944497A4C6A4D30555455784C6A5132494449304C6A4932494455784C6A5132494449314C6A4134544455784C6A5532494449314C6A4534544455784C6A557A494449314C6A4532555455784C6A5131494449314C6A4932494455774C6A6B78494449314C6A4934544455774C6A6B79494449314C6A4935544455774C6A6332494449314C6A4530555455774C6A4978494449314C6A4932494451354C6A6777494449314C6A4934544451354C6A6332494449314C6A4930544451354C6A6777494449314C6A4935555451354C6A6332494449314C6A4930494451334C6A6B31494449314C6A4930544451344C6A4179494449314C6A4D78544451334C6A6B77494449334C6A5578544451334C6A6731494449334C6A5133555451334C6A6735494449344C6A5979494451334C6A6B33494449354C6A6334576B30314D5334344D7941794D7934774D6B77314D5334354E6941794D7934784E6B77314D5334344D5341794D7934774D4645314D4334324F5341794D79347A4F5341304F5334304D7941794D7934304E4577304F5334794E6941794D7934794E3077304F5334794E6941794D7934794E3145304F5334304E6941794D5334784E7941304F5334334E5341784F5334354D5577304F5334354D4341794D4334774E6B77304F5334344E4341794D4334774D4645304F53347A4E5341794D4334774D6941304F43347A4F5341794D4334784D3077304F4334304D4341794D4334784E4577304F4334304E4341784F4334324E5577304F4334314F5341784F4334344D5645304E6934324F5341784F4334324F5341304E5334314E6941784F4334324D5577304E5334304F5341784F4334314E5577304E5334314F5341784F4334324E4645304E6934774F4341794D4334344E6941304E6934794D5341794D7934314D4577304E6934774E7941794D79347A4E6B77304E6934774E4341794D79347A4D3145304E4334354E7941794D7934304D6941304D6934304E6941794D7934774D5577304D69347A4E5341794D6934354D4577304D69347A4D6941794D6934344E3145304D6934314E4341794D7934334D5341304D6934314E4341794E5334304F5577304D6934324E5341794E5334324D4577304D7934324D7941794E5334314E5577304D7934324D7941794E5334314E4645304D7934314D5341794E5334354D5341304D7934304D4341794E6934344E3077304D7934314D7941794E7934774D4577304E6934794D5341794E6934344D5577304E6934794E6941794E6934344E5645304E5334354E4341794F4334344E4341304E5334334E43417A4D4334774F4577304E5334334F53417A4D4334784D3077304E5334344F53417A4D4334794D3145304E6934794E43417A4D4334774E7941304E7934794D4341794F5334354F5577304E7934794F53417A4D4334774F4577304E79347A4E69417A4D4334784E5645304E79347A4F43417A4D4334324D7941304E79347A4E53417A4D5334314E4577304E7934794E53417A4D5334304E4577304E79347A4D53417A4D5334314D4645304E7934314D69417A4D53347A4E5341304F5334354F43417A4D5334304E5577314D4334784D79417A4D5334324D5577314D4334774D43417A4D5334304E3145304F5334304F5341794F5334304F5341304F53347A4E4341794E6934344D5577304F53347A4E6941794E6934344D3077304F5334794D7941794E6934334D4645314D5334304E5341794E6934334D7941314D6934344E7941794E6934354F4577314D6934344F5341794E7934774D4577314D7934774D7941794E7934784E4645314D6934344D4341794E69347A4F5341314D6934344D4341794E5334334E5577314D6934334F5341794E5334334E4577314D6934344D4341794E4334304E6B77314D6934344E4341794E4334314D4645314D6934334D6941794E4334314D7941314D69347A4E6941794E4334314E6B77314D6934794E4341794E4334304E4577314D5334334D7941794E4334304E3077314D5334334E7941794E4334314D6C45314D5334344E5341794E4334774E5341314D5334354D7941794D7934784D6C6F694C7A3438634746306143426D615778735053496A4E546B355A6A6C6D4969426B50534A4E4D546B754F4463674D6A55754E44464D4D546B754F5441674D6A55754E44524D4D546B754F544D674D6A55754E4464524D6A45754F4467674D6A55754D4459674D6A51754D4455674D6A55754D54524D4D6A51754D4455674D6A55754D54524D4D6A51754D5451674D6A55754D6A4E524D6A51754D5441674D6A4D754E4467674D6A51754D5441674D6A45754F445A4D4D6A51754D544D674D6A45754F446C4D4D6A51754D4455674D6A45754F4446524D6A51754D5445674D6A41754D546B674D6A51754D6A4D674D5467754E445A4D4D6A51754D6A67674D5467754E54424D4D6A51754D6A67674D5467754E5442524D6A4D754D7A67674D546B754E546B674D546B754F4451674D6A55754D7A6861545449324C6A597949444D774C6A5179544449324C6A553449444D774C6A4D34544449324C6A593349444D774C6A5133555449314C6A513549444D774C6A4979494449304C6A493349444D774C6A4533544449304C6A453249444D774C6A4132544449304C6A493549444D774C6A4535555449304C6A4178494449344C6A51304944497A4C6A6B30494449324C6A6332544449304C6A4130494449324C6A67325444497A4C6A6B30494449324C6A6332555449774C6A4D32494449324C6A5933494445334C6A4531494449334C6A5979544445334C6A457A494449334C6A5977544445334C6A4934494449334C6A6331555445334C6A4978494449334C6A4932494445334C6A4D30494449324C6A5535544445334C6A5131494449324C6A6378544445334C6A4D78494449324C6A5533555445344C6A5531494449304C6A5131494449774C6A6B34494449774C6A4535544449774C6A6B34494449774C6A4535544449784C6A4579494449774C6A4D7A555449794C6A6B35494445324C6A6B7A494449314C6A4D79494445304C6A4935544449314C6A4D35494445304C6A4D33544449314C6A4D33494445304C6A4D31555449314C6A6B77494445304C6A4532494449334C6A41304944457A4C6A6B33544449334C6A4530494445304C6A4133544449334C6A41774944457A4C6A6B30555449314C6A6779494445344C6A5178494449314C6A67794944497A4C6A4535544449314C6A63324944497A4C6A457A544449314C6A63794944497A4C6A4135555449314C6A6331494449304C6A457A494449314C6A6777494449314C6A4530544449314C6A6333494449314C6A4577544449324C6A6377494449314C6A4930544449324C6A6378494449314C6A4930555449334C6A4132494449314C6A4978494449334C6A5133494449314C6A4935544449334C6A557A494449314C6A4D30544449334C6A5133494449314C6A4935555449334C6A6377494449324C6A4578494449334C6A6734494449334C6A517A544449334C6A6732494449334C6A5177544449334C6A6778494449334C6A4D31555449334C6A4177494449334C6A4535494449314C6A6B35494449334C6A4132544449314C6A6735494449324C6A6B32544449314C6A6732494449324C6A6B7A555449324C6A4135494449344C6A4D33494449324C6A553249444D774C6A4D32576B30794E7934334D7941794E5334784D4577794E7934344D5341794E5334784F4577794E7934344D5341794E5334784F4645794E7934314E4341794E4334354F5341794E7934304D5341794E4334354F5577794E7934304F5341794E5334774E3077794E7934784D5341794E4334354E5577794E7934784F5341794E5334774D3145794E7934784D6941794E4334774D7941794E7934784D6941794D7934774E3077794E7934784F5341794D7934784E4577794E7934774E6941794D7934774D5645794E7934774F5341784F4334334D4341794F4334304F4341784E4334324D6B77794F4334304D6941784E4334314E6B77794F4334304E7941784E4334324D4645794F4334774E7941784E4334354D5341794E7934774F5341784E5334784E6B77794E7934774D6941784E5334774F5577794E7934774D6941784E5334774F5645794E7934794D7941784E4334324D7941794E7934314E4341784D7934324E3077794E7934314D7941784D7934324E3077794E7934304D6941784D7934314E6C45794E6934324D6941784D7934344F5341794E5334794D7941784E4334774E5577794E5334794E7941784E4334784D4577794E5334794D4341784E4334774D6C45794D6934314D4341784E6934354D7941784F4334354E6941794D7934794F4577784F4334354E6941794D7934794F4577794D43347A4F5341794D4334344D6B77794D4334304E5341794D4334344E3145794D4334774F5341794D5334304F5341784F5334354D5341794D5334344F4577784F5334354D7941794D5334354D4577784E7934774D4341794F4334784D5577784E6934344E7941794E7934354F5645784E79347A4D6941794E7934344F5341784F4334774F5341794E7934324D3077784F4334784F4341794E7934334D6B77784F4334774E4341794E7934344D3077784F4334774D7941794E7934344D3145784E7934354E6941794F43347A4D4341784E7934334E5341794F5334784E5577784E7934334E7941794F5334784E3077784E7934334D5341794F5334784D5645794D4334324D6941794F43347A4D7941794D7934354D4341794F4334304E6B77794D7934344D4341794F43347A4E6B77794D7934344D6941794F43347A4E3145794D7934354E5341794F5334784D6941794E4334774F43417A4D4334304E3077794E4334774E79417A4D4334304E6B77794E4334774D69417A4D4334304D5645794E4334334F53417A4D4334304E6941794E5334314D69417A4D4334314E4577794E5334304E79417A4D4334304F5577794E5334304D69417A4D4334304E4645794E5334314D69417A4D4334354D4341794E5334334D43417A4D5334344D3077794E5334334D53417A4D5334344E4577794E5334334E69417A4D5334344F5645794E6934354F43417A4D5334354E7941794F5334774D69417A4D6934314F5577794F5334774D53417A4D6934314F5577794F5334774D43417A4D6934314F4645794F4334304E69417A4D5334794E6941794E7934344E4341794F5334774E4577794E7934334E7941794F4334354E3077794F4334344E4341794F53347A4E6B77794F4334334E6941794F5334794F4645794F5334784F5341794F5334304D4341794F5334324E5341794F5334324D3077794F5334324F4341794F5334324E6B77794F5334324D6941794F5334324D4645794F5334784D5341794E7934354D7941794F5334774D4341794E6934334F5577794F5334784D6941794E6934354D5577794F4334354F4341794E6934334E3145794F4334314E7941794E6934324E4341794E7934334F5341794E6934304F4577794E7934344D6941794E6934314D5577794E7934344E4341794E6934314D3145794E7934324D7941794E5334324D4341794E7934324D7941794E5334774D56704E4D6A49754D6A59674D6A51754F545A4D4D6A49754D7A45674D6A55754D44464D4D6A49754D6A67674D6A51754F5468524D6A49754F4467674D6A51754D5467674D6A4D754F5451674D6A49754E44564D4D6A4D754F544D674D6A49754E44524D4D6A4D754F444D674D6A49754D7A52524D6A4D754F4459674D6A4D754D4449674D6A4D754F444D674D6A4D754E6A5A4D4D6A4D754F444D674D6A4D754E6A564D4D6A4D754E7A6B674D6A4D754E6A46524D6A4D754E7A6B674D6A51754D6A67674D6A4D754F4445674D6A51754F544E4D4D6A4D754F4467674D6A55754D44424D4D6A4D754E7A6B674D6A51754F5446524D6A4D754E5455674D6A55754D444D674D6A4D754D5459674D6A55754D444E4D4D6A4D754D4467674D6A51754F54524D4D6A4D754D4455674D6A51754F544A524D6A49754E6A55674D6A51754F544D674D6A49754D6A51674D6A51754F544E614969382B50484268644767675A443069545467674D544567517A4D7A49444D324C44517A494449314C4467354944456949484E30636D39725A543069497A646D5A5759335A6949675A6D6C7362443069626D39755A534976506A78775958526F49475139496B30784D43417A4E4342444E4455674D5467734E5459674D6A6B734F5445674D6A556949484E30636D39725A54306949324D334E7A4A6C4D7949675A6D6C7362443069626D39755A534976506A777663335A6E50673D3D, '8', '2024-01-30 03:26:06', '2024-01-30 03:26:02', '2024-01-30 03:26:06');

-- ----------------------------
-- Table structure for wiki
-- ----------------------------
DROP TABLE IF EXISTS `wiki`;
CREATE TABLE `wiki`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '知识库名称',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '知识库描述',
  `status` tinyint(1) NOT NULL COMMENT '文档状态，私有还是公开',
  `weight` int(11) NOT NULL DEFAULT 1 COMMENT '文档权重，值越大越靠前',
  `config` json NOT NULL COMMENT '空间配置',
  `uid` int(11) NULL DEFAULT NULL COMMENT '文档拥有者',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  CONSTRAINT `wiki_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wiki
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
