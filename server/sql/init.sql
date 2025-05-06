/*
 Navicat Premium Data Transfer

 Source Server         : 40.233.73.133
 Source Server Type    : PostgreSQL
 Source Server Version : 160002 (160002)
 Source Host           : 40.233.73.133:5432
 Source Catalog        : canl_picture
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160002 (160002)
 File Encoding         : 65001

 Date: 19/06/2024 01:01:23
*/


-- ----------------------------
-- Sequence structure for album_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."album_id_seq";
CREATE SEQUENCE "public"."album_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for album_tag_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."album_tag_id_seq";
CREATE SEQUENCE "public"."album_tag_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for article_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."article_id_seq";
CREATE SEQUENCE "public"."article_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for author_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."author_id_seq";
CREATE SEQUENCE "public"."author_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for author_question_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."author_question_id_seq";
CREATE SEQUENCE "public"."author_question_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for bucket_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."bucket_id_seq";
CREATE SEQUENCE "public"."bucket_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for dict_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."dict_id_seq";
CREATE SEQUENCE "public"."dict_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for habits_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."habits_id_seq";
CREATE SEQUENCE "public"."habits_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for image_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."image_id_seq";
CREATE SEQUENCE "public"."image_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for log_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."log_id_seq";
CREATE SEQUENCE "public"."log_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notify_history_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notify_history_id_seq";
CREATE SEQUENCE "public"."notify_history_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notify_receiver_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notify_receiver_id_seq";
CREATE SEQUENCE "public"."notify_receiver_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for plugin_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."plugin_id_seq";
CREATE SEQUENCE "public"."plugin_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for question_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."question_id_seq";
CREATE SEQUENCE "public"."question_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for setting_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."setting_id_seq";
CREATE SEQUENCE "public"."setting_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for smscode_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."smscode_id_seq";
CREATE SEQUENCE "public"."smscode_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_id_seq";
CREATE SEQUENCE "public"."user_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user_plugin_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_plugin_id_seq";
CREATE SEQUENCE "public"."user_plugin_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for verifycode_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."verifycode_id_seq";
CREATE SEQUENCE "public"."verifycode_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for wiki_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."wiki_id_seq";
CREATE SEQUENCE "public"."wiki_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for album
-- ----------------------------
DROP TABLE IF EXISTS "public"."album";
CREATE TABLE "public"."album" (
  "id" int4 NOT NULL DEFAULT nextval('album_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "desc" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "access_type" int4 NOT NULL,
  "access_pass" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "cover" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "background" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "sort" int4 NOT NULL DEFAULT 1,
  "view_num" int4 NOT NULL DEFAULT 0,
  "uid" int4 NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."album"."name" IS '相册名称';
COMMENT ON COLUMN "public"."album"."desc" IS '相册描述';
COMMENT ON COLUMN "public"."album"."access_type" IS '访问权限';
COMMENT ON COLUMN "public"."album"."access_pass" IS '访问密码';
COMMENT ON COLUMN "public"."album"."cover" IS '相册封面';
COMMENT ON COLUMN "public"."album"."background" IS '相册背景颜色';
COMMENT ON COLUMN "public"."album"."sort" IS '相册排序，值越大越靠前';
COMMENT ON COLUMN "public"."album"."view_num" IS '相册浏览量';
COMMENT ON COLUMN "public"."album"."uid" IS '用户id';

-- ----------------------------
-- Records of album
-- ----------------------------

-- ----------------------------
-- Table structure for album_tag
-- ----------------------------
DROP TABLE IF EXISTS "public"."album_tag";
CREATE TABLE "public"."album_tag" (
  "id" int4 NOT NULL DEFAULT nextval('album_tag_id_seq'::regclass),
  "album_id" int4 NOT NULL,
  "tags" json NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."album_tag"."album_id" IS '相册id';
COMMENT ON COLUMN "public"."album_tag"."tags" IS '相册标签tags';

-- ----------------------------
-- Records of album_tag
-- ----------------------------

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS "public"."article";
CREATE TABLE "public"."article" (
  "id" int4 NOT NULL DEFAULT nextval('article_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "url" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "public" int2 NOT NULL DEFAULT 0,
  "weight" int4 NOT NULL DEFAULT 1,
  "sha" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "theme" json NOT NULL,
  "publishedAt" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "pid" int4,
  "wid" int4 NOT NULL,
  "uid" int4 NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."article"."title" IS '文章标题';
COMMENT ON COLUMN "public"."article"."type" IS '文章类型，可选file|folder|mind';
COMMENT ON COLUMN "public"."article"."url" IS '文章存储位置';
COMMENT ON COLUMN "public"."article"."public" IS '文章状态，true-发布，false-草稿';
COMMENT ON COLUMN "public"."article"."weight" IS '文章权重，值越大越靠前';
COMMENT ON COLUMN "public"."article"."sha" IS '文章sha，存储git的sha值';
COMMENT ON COLUMN "public"."article"."theme" IS '文章所使用主题，由系统内置几套主题选择';
COMMENT ON COLUMN "public"."article"."publishedAt" IS '文章发布时间';
COMMENT ON COLUMN "public"."article"."pid" IS '上级id';
COMMENT ON COLUMN "public"."article"."wid" IS '关联知识库id';
COMMENT ON COLUMN "public"."article"."uid" IS '用户id';

-- ----------------------------
-- Records of article
-- ----------------------------

-- ----------------------------
-- Table structure for author
-- ----------------------------
DROP TABLE IF EXISTS "public"."author";
CREATE TABLE "public"."author" (
  "id" int4 NOT NULL DEFAULT nextval('author_id_seq'::regclass),
  "author_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author_avatar" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'publisher'::character varying,
  "is_org" bool NOT NULL DEFAULT false,
  "status" bool NOT NULL DEFAULT true,
  "weight" int4 NOT NULL DEFAULT 1,
  "uid" int4,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."author"."author_id" IS '作者id';
COMMENT ON COLUMN "public"."author"."author_name" IS '作者名称';
COMMENT ON COLUMN "public"."author"."author_avatar" IS '作者头像';
COMMENT ON COLUMN "public"."author"."author_type" IS '账号类型';
COMMENT ON COLUMN "public"."author"."is_org" IS '是否为机构账号';
COMMENT ON COLUMN "public"."author"."status" IS '任务状态';
COMMENT ON COLUMN "public"."author"."weight" IS '排序值，值越大越靠前';
COMMENT ON COLUMN "public"."author"."uid" IS '创建人';

-- ----------------------------
-- Records of author
-- ----------------------------

-- ----------------------------
-- Table structure for author_question
-- ----------------------------
DROP TABLE IF EXISTS "public"."author_question";
CREATE TABLE "public"."author_question" (
  "id" int4 NOT NULL DEFAULT nextval('author_question_id_seq'::regclass),
  "question_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_desc" text COLLATE "pg_catalog"."default" NOT NULL,
  "question_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_created" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_updated" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "uid" int4,
  "aid" int4,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."author_question"."question_id" IS '问题id';
COMMENT ON COLUMN "public"."author_question"."question_title" IS '问题标题';
COMMENT ON COLUMN "public"."author_question"."question_desc" IS '问题描述';
COMMENT ON COLUMN "public"."author_question"."question_type" IS '问题类型(commercial-疑似红包问题  normal-普通问题)';
COMMENT ON COLUMN "public"."author_question"."type" IS '类型(publish-发布 answer-回答  follow-关注)';
COMMENT ON COLUMN "public"."author_question"."question_created" IS '问题创建时间';
COMMENT ON COLUMN "public"."author_question"."question_updated" IS '问题更新时间';
COMMENT ON COLUMN "public"."author_question"."uid" IS '创建人';
COMMENT ON COLUMN "public"."author_question"."aid" IS '作者';

-- ----------------------------
-- Records of author_question
-- ----------------------------

-- ----------------------------
-- Table structure for bucket
-- ----------------------------
DROP TABLE IF EXISTS "public"."bucket";
CREATE TABLE "public"."bucket" (
  "id" int4 NOT NULL DEFAULT nextval('bucket_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "config" json NOT NULL,
  "weight" int4 NOT NULL DEFAULT 1,
  "visible" int2 NOT NULL DEFAULT 1,
  "uid" int4 NOT NULL,
  "user_plugin_id" int4 NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."bucket"."name" IS '存储桶名称';
COMMENT ON COLUMN "public"."bucket"."config" IS '存储桶配置';
COMMENT ON COLUMN "public"."bucket"."weight" IS '排序权重';
COMMENT ON COLUMN "public"."bucket"."visible" IS '是否在上传区域显示';
COMMENT ON COLUMN "public"."bucket"."uid" IS '用户id';
COMMENT ON COLUMN "public"."bucket"."user_plugin_id" IS '用户安装插件id';

-- ----------------------------
-- Records of bucket
-- ----------------------------

-- ----------------------------
-- Table structure for dict
-- ----------------------------
DROP TABLE IF EXISTS "public"."dict";
CREATE TABLE "public"."dict" (
  "id" int4 NOT NULL DEFAULT nextval('dict_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "code" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "values" json NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."dict"."name" IS '字典名称';
COMMENT ON COLUMN "public"."dict"."code" IS '字典编码-唯一';
COMMENT ON COLUMN "public"."dict"."values" IS '字典名称';

-- ----------------------------
-- Records of dict
-- ----------------------------
INSERT INTO "public"."dict" VALUES (1, '角色', 'user_role', '[{"label": "管理员", "value": 10}, {"label": "普通用户", "value": 1}]', '2023-08-24 07:31:35', '2023-08-30 05:11:33');
INSERT INTO "public"."dict" VALUES (4, ' 用户性别', 'user_gender', '[{"label": "男", "value": "男"}, {"label": "女", "value": "女"}, {"label": "阴阳人", "value": "阴阳人"}, {"label": "保密", "value": "保密"}]', '2023-08-30 05:10:51', '2023-08-30 05:10:51');
INSERT INTO "public"."dict" VALUES (5, '显示状态', 'show_status', '[{"label": "显示", "value": true}, {"label": "不显示", "value": false}]', '2023-08-30 05:11:05', '2023-08-30 05:11:05');
INSERT INTO "public"."dict" VALUES (6, '用户职业', 'user_major', '[{"label": "程序猿", "value": "程序猿"}, {"label": "程序媛", "value": "程序媛"}, {"label": "设计师", "value": "设计师"}, {"label": "开发者", "value": "开发者"}, {"label": "学生", "value": "学生"}, {"label": "其他", "value": "其他"}]', '2023-08-30 05:11:17', '2023-08-30 05:11:17');
INSERT INTO "public"."dict" VALUES (8, '插件所有类型', 'plugin_type', '[{"label": "上传插件", "value": "uploader"}, {"label": "主题插件", "value": "themer"}, {"label": "全局插件", "value": "commander"}, {"label": "工具箱插件", "value": "tooler"}]', '2023-08-30 08:20:14', '2024-01-29 09:33:41');
INSERT INTO "public"."dict" VALUES (9, '插件运行环境', 'plugin_env', '[{"label": "Nodejs", "value": "Node"}, {"label": "浏览器", "value": "Browser"}]', '2023-08-30 08:29:38', '2023-10-07 06:40:59');

-- ----------------------------
-- Table structure for habits
-- ----------------------------
DROP TABLE IF EXISTS "public"."habits";
CREATE TABLE "public"."habits" (
  "id" int4 NOT NULL DEFAULT nextval('habits_id_seq'::regclass),
  "uid" int4 NOT NULL,
  "shortKey" json NOT NULL,
  "showTip" json NOT NULL,
  "pasteStyle" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'url'::character varying,
  "autoPaste" int2 NOT NULL DEFAULT 0,
  "current_bucket" int4,
  "current_album" int4,
  "current_theme" json,
  "link_format" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT '![]($url)'::character varying,
  "gallery_img_fit" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'none'::character varying,
  "gallery_img_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'origin_name'::character varying,
  "album_cover_fit" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'none'::character varying,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."habits"."uid" IS '用户id';
COMMENT ON COLUMN "public"."habits"."shortKey" IS '快捷键设置';
COMMENT ON COLUMN "public"."habits"."showTip" IS '提示功能';
COMMENT ON COLUMN "public"."habits"."pasteStyle" IS '上传后自动复制图片地址类型，支持：url、markdown';
COMMENT ON COLUMN "public"."habits"."autoPaste" IS '上传后自动复制图片地址';
COMMENT ON COLUMN "public"."habits"."current_bucket" IS '当前使用存储桶';
COMMENT ON COLUMN "public"."habits"."current_album" IS '当前使用相册';
COMMENT ON COLUMN "public"."habits"."current_theme" IS '当前使用主题';
COMMENT ON COLUMN "public"."habits"."link_format" IS '链接格式，默认是 ![]($url)';
COMMENT ON COLUMN "public"."habits"."gallery_img_fit" IS '图片层现方式';
COMMENT ON COLUMN "public"."habits"."gallery_img_name" IS '图片显示名称';
COMMENT ON COLUMN "public"."habits"."album_cover_fit" IS '相册封面层现方式';

-- ----------------------------
-- Records of habits
-- ----------------------------
INSERT INTO "public"."habits" VALUES (22, 1, '[{"id": 1, "key": "快捷上传", "label": "点击快捷键自动上传粘贴板中的图片", "value": "Command + K"}, {"id": 2, "key": "帮助中心", "label": "点击快捷键自动打开帮助中心窗口", "value": "Command + H"}, {"id": 3, "key": "个人中心", "label": "点击快捷键自动进入个人中心", "value": "Control + Shift + F"}, {"id": 4, "key": "上传网络图片", "label": "点击快捷键自动上传粘贴板中的网络图片", "value": "Command + P + C"}, {"id": 5, "key": "快捷退出", "label": "点击快捷键自动退出登录", "value": "Control + Shift + D"}]', '{"copy": true, "delete": true, "update": true, "upload": true}', 'markdown', 0, 6, 0, '{"id": 0, "plugin_id": 0}', '[${filename}](${url})', 'cover', 'name', 'cover', '2023-08-25 04:25:11', '2024-01-30 02:05:29');

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS "public"."image";
CREATE TABLE "public"."image" (
  "id" int4 NOT NULL DEFAULT nextval('image_id_seq'::regclass),
  "bucket_id" int4 NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "origin_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "width" int4 NOT NULL,
  "height" int4 NOT NULL,
  "mime_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "size" int4 NOT NULL,
  "hash" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "weight" int4 NOT NULL DEFAULT 1,
  "baseurl" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "config" json NOT NULL,
  "tags" json NOT NULL,
  "uid" int4 NOT NULL,
  "album_id" int4,
  "add_time" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."image"."id" IS '图片id';
COMMENT ON COLUMN "public"."image"."bucket_id" IS '存储桶id';
COMMENT ON COLUMN "public"."image"."name" IS '图片名称，自动生成的名称(可修改)';
COMMENT ON COLUMN "public"."image"."origin_name" IS '图片原名称';
COMMENT ON COLUMN "public"."image"."width" IS '图片宽度';
COMMENT ON COLUMN "public"."image"."height" IS '图片高度';
COMMENT ON COLUMN "public"."image"."mime_type" IS '图片媒体类型，如: image/png';
COMMENT ON COLUMN "public"."image"."url" IS '图片存储相对路径，如: img/202304071707109.png';
COMMENT ON COLUMN "public"."image"."size" IS '图片大小，单位byte';
COMMENT ON COLUMN "public"."image"."hash" IS '图片sha';
COMMENT ON COLUMN "public"."image"."weight" IS '图片权重，排序值';
COMMENT ON COLUMN "public"."image"."baseurl" IS '图片基地址，存储存储桶的访问前缀';
COMMENT ON COLUMN "public"."image"."config" IS '图片基地址';
COMMENT ON COLUMN "public"."image"."tags" IS '图片基地址';
COMMENT ON COLUMN "public"."image"."uid" IS '用户id';
COMMENT ON COLUMN "public"."image"."album_id" IS '相册id';
COMMENT ON COLUMN "public"."image"."add_time" IS '添加相册时间';

-- ----------------------------
-- Records of image
-- ----------------------------

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS "public"."log";
CREATE TABLE "public"."log" (
  "id" int4 NOT NULL DEFAULT nextval('log_id_seq'::regclass),
  "type" int4 NOT NULL,
  "operate_id" int4 NOT NULL,
  "operate_cont" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "client_info" json NOT NULL,
  "uid" int4 NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying
)
;
COMMENT ON COLUMN "public"."log"."type" IS '日志类型';
COMMENT ON COLUMN "public"."log"."operate_id" IS '操作记录id';
COMMENT ON COLUMN "public"."log"."operate_cont" IS '操作记录内容';
COMMENT ON COLUMN "public"."log"."client_info" IS '操作记录id';
COMMENT ON COLUMN "public"."log"."uid" IS '用户id';
COMMENT ON COLUMN "public"."log"."email" IS '用户邮箱';

-- ----------------------------
-- Records of log
-- ----------------------------
INSERT INTO "public"."log" VALUES (1010, 64, 19, '安装了插件[本地存储上传插件]', '{"ip": "172.20.0.3", "city": "未知", "type": "baidu", "adcode": "", "district": "未知", "province": "未知", "rectangle": {"x": "", "y": ""}}', 1, '2024-01-30 03:26:27', '2024-01-30 03:26:27', 'admin@163.com');

-- ----------------------------
-- Table structure for notify_history
-- ----------------------------
DROP TABLE IF EXISTS "public"."notify_history";
CREATE TABLE "public"."notify_history" (
  "id" int4 NOT NULL DEFAULT nextval('notify_history_id_seq'::regclass),
  "obj_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "notify_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "notify_content" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "uid" int4,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."notify_history"."obj_id" IS '通知的对象id';
COMMENT ON COLUMN "public"."notify_history"."notify_type" IS '通知类型(question-问题通知 author-博主通知)';
COMMENT ON COLUMN "public"."notify_history"."notify_content" IS '通知内容';
COMMENT ON COLUMN "public"."notify_history"."uid" IS '创建人';

-- ----------------------------
-- Records of notify_history
-- ----------------------------

-- ----------------------------
-- Table structure for notify_receiver
-- ----------------------------
DROP TABLE IF EXISTS "public"."notify_receiver";
CREATE TABLE "public"."notify_receiver" (
  "id" int4 NOT NULL DEFAULT nextval('notify_receiver_id_seq'::regclass),
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "remark" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "status" bool NOT NULL DEFAULT true,
  "uid" int4,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."notify_receiver"."email" IS '邮箱地址';
COMMENT ON COLUMN "public"."notify_receiver"."remark" IS '备注';
COMMENT ON COLUMN "public"."notify_receiver"."status" IS '账号状态';
COMMENT ON COLUMN "public"."notify_receiver"."uid" IS '创建人';

-- ----------------------------
-- Records of notify_receiver
-- ----------------------------

-- ----------------------------
-- Table structure for plugin
-- ----------------------------
DROP TABLE IF EXISTS "public"."plugin";
CREATE TABLE "public"."plugin" (
  "id" int4 NOT NULL DEFAULT nextval('plugin_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "description" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "version" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "logo" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "author" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "category" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "platform" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "downloadCounts" int4 NOT NULL DEFAULT 0,
  "status" int2 NOT NULL DEFAULT 0,
  "weight" int4 NOT NULL DEFAULT 1,
  "payment" int2 NOT NULL DEFAULT 0,
  "payment_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'free'::character varying,
  "price" float4 NOT NULL DEFAULT 0,
  "tags" json NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."plugin"."id" IS '插件id';
COMMENT ON COLUMN "public"."plugin"."name" IS '插件名称，对应npm包名称';
COMMENT ON COLUMN "public"."plugin"."description" IS '插件描述，自动从npm包package.json中获取';
COMMENT ON COLUMN "public"."plugin"."version" IS '插件版本号，从所有版本中选择，默认取最新版本';
COMMENT ON COLUMN "public"."plugin"."logo" IS '插件logo，自动从npm包package.json中获取';
COMMENT ON COLUMN "public"."plugin"."title" IS '插件别名，页面上所显示的插件名称';
COMMENT ON COLUMN "public"."plugin"."author" IS '插件作者，自动从npm包package.json中获取';
COMMENT ON COLUMN "public"."plugin"."category" IS '插件类别，目前支持themer|uploader|transformer|handler|commander';
COMMENT ON COLUMN "public"."plugin"."platform" IS '插件运行环境，Node|Browser';
COMMENT ON COLUMN "public"."plugin"."downloadCounts" IS '插件安装次数，安装一次累加一次';
COMMENT ON COLUMN "public"."plugin"."status" IS '插件状态，是否用户可见';
COMMENT ON COLUMN "public"."plugin"."weight" IS '插件权重，权重越大越靠前';
COMMENT ON COLUMN "public"."plugin"."payment" IS '插件是否需要付费';
COMMENT ON COLUMN "public"."plugin"."payment_type" IS '插件付费版本';
COMMENT ON COLUMN "public"."plugin"."price" IS '插件付费需设置价格';
COMMENT ON COLUMN "public"."plugin"."tags" IS '插件标签';

-- ----------------------------
-- Records of plugin
-- ----------------------------
INSERT INTO "public"."plugin" VALUES (5, '@itchenliang/picture-rollup-oss-plugin', '轻快图片管理系统的插件：使用rollup开发的阿里云对象存储(oss)插件', '1.0.13', 'https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico', '阿里云OSS存储上传插件', 'itchenliang', 'uploader', 'Node', 2, 1, 5, 0, 'free', 0, '[]', '2023-09-01 07:37:01', '2024-01-29 05:50:52');
INSERT INTO "public"."plugin" VALUES (6, '@itchenliang/picture-rollup-qiniu-plugin', '轻快图片管理系统的插件：使用rollup开发的七牛云对象存储(kodo)插件', '1.1.6', 'https://qiniu.staticfile.org/favicon.ico', '七牛云Kodo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 6, 0, 'free', 0, '[]', '2023-09-15 07:19:10', '2023-09-18 09:36:10');
INSERT INTO "public"."plugin" VALUES (7, '@itchenliang/picture-rollup-bilibili-plugin', '轻快图片管理系统的插件：使用rollup开发的哔哩哔哩图片上传插件', '1.0.11', 'https://www.bilibili.com/favicon.ico', '哔哩哔哩存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 7, 0, 'free', 0, '[]', '2023-09-18 02:16:19', '2023-09-18 05:45:30');
INSERT INTO "public"."plugin" VALUES (9, '@itchenliang/picture-rollup-yopngs-plugin', '轻快图片管理系统的插件：使用rollup开发的有图床图片上传插件', '1.0.3', 'https://www.yopngs.com/favicon.png', '有图床存储上传插件', 'itchenliang', 'uploader', 'Node', 3, 1, 8, 0, 'free', 0, '[]', '2023-09-18 05:32:35', '2024-01-27 06:29:48');
INSERT INTO "public"."plugin" VALUES (10, '@itchenliang/picture-rollup-cos-plugin', '轻快图片管理系统的插件：使用rollup开发的腾讯云对象存储COS图片上传插件', '1.0.3', 'https://cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/shareicons/cloud.png', '腾讯云COS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 9, 0, 'free', 0, '[]', '2023-09-18 06:19:39', '2024-01-29 05:50:45');
INSERT INTO "public"."plugin" VALUES (11, '@itchenliang/picture-rollup-uss-plugin', '轻快图片管理系统的插件：使用rollup开发的又拍云对象存储USS图片上传插件', '1.0.1', 'https://www.upyun.com/static/favicon-64x64.png', '又拍云USS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 10, 0, 'free', 0, '[]', '2023-09-18 06:45:12', '2024-01-29 05:50:41');
INSERT INTO "public"."plugin" VALUES (12, '@itchenliang/picture-rollup-mdnice-plugin', '轻快图片管理系统的插件：使用rollup开发的墨滴社区图片上传插件', '1.0.2', 'https://mdnice.com/favicon.svg', '墨滴社区存储上传插件', 'itchenliang', 'uploader', 'Node', 2, 1, 11, 0, 'free', 0, '[]', '2023-09-18 07:09:17', '2023-12-08 09:50:23');
INSERT INTO "public"."plugin" VALUES (13, '@itchenliang/picture-rollup-gitee-plugin', '轻快图片管理系统的插件：使用rollup开发的Gitee图片上传插件', '1.0.5', 'https://cn-assets.gitee.com/assets/favicon-9007bd527d8a7851c8330e783151df58.ico', 'Gitee存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 12, 0, 'free', 0, '[]', '2023-09-18 07:57:56', '2023-09-18 08:22:42');
INSERT INTO "public"."plugin" VALUES (14, '@itchenliang/picture-rollup-github-plugin', '轻快图片管理系统的插件：使用rollup开发的Github图片上传插件', '1.0.2', 'https://github.com/favicon.ico', 'Github存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 13, 0, 'free', 0, '[]', '2023-09-18 08:40:37', '2024-01-29 05:50:30');
INSERT INTO "public"."plugin" VALUES (15, '@itchenliang/picture-rollup-obs-plugin', '轻快图片管理系统的插件：使用rollup开发的华为云对象存储obs图片上传插件', '1.0.9', 'https://www.huaweicloud.com/favicon.ico', '华为云OBS存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 14, 0, 'free', 0, '[]', '2023-09-18 09:35:56', '2023-09-19 02:56:44');
INSERT INTO "public"."plugin" VALUES (16, '@itchenliang/picture-rollup-minio-plugin', '轻快图片管理系统的插件：使用rollup开发的Minio存储图片上传插件', '1.0.1', 'https://www.minio.org.cn/favicon.ico', 'Minio存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 15, 0, 'free', 0, '[]', '2023-09-19 03:13:44', '2024-01-29 05:50:20');
INSERT INTO "public"."plugin" VALUES (17, '@itchenliang/picture-rollup-qingstor-plugin', '轻快图片管理系统的插件：使用rollup开发的青云对象存储qingstor图片上传插件', '1.0.0', 'https://s4.qingcloud.com/static/assets/images/favicon.ico', '青云qingstor存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 16, 0, 'free', 0, '[]', '2023-09-19 04:02:58', '2023-09-19 04:03:15');
INSERT INTO "public"."plugin" VALUES (18, '@itchenliang/picture-rollup-alist-plugin', '轻快图片管理系统的插件：使用rollup开发的AList图片上传插件', '1.0.2', 'https://alist.nn.ci/favicon.ico', 'Alist存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 17, 0, 'free', 0, '[]', '2023-09-19 04:46:11', '2024-01-29 05:50:14');
INSERT INTO "public"."plugin" VALUES (19, '@itchenliang/picture-rollup-local-plugin', '轻快图片管理系统的插件：使用rollup开发的本地存储图片上传插件', '1.0.10', 'https://files.mdnice.com/user/31298/1e995a4e-3423-4003-96a8-b1e64119c86f.png', '本地存储上传插件', 'itchenliang', 'uploader', 'Node', 4, 1, 18, 0, 'free', 0, '[]', '2023-09-19 05:32:38', '2024-01-30 03:26:26');
INSERT INTO "public"."plugin" VALUES (21, '@itchenliang/picture-rollup-leancloud-plugin', '轻快图片管理系统的插件：使用rollup开发的leancloud存储图片上传插件', '1.0.13', 'https://www.leancloud.cn/favicon.ico', 'Leancloud存储上传插件', 'itchenliang', 'uploader', 'Node', 4, 0, 19, 0, 'free', 0, '[]', '2023-09-20 02:38:51', '2023-10-08 09:02:25');
INSERT INTO "public"."plugin" VALUES (22, '@itchenliang/picture-rollup-csdn-plugin', '轻快图片管理系统的插件：使用rollup开发的csdn存储图片上传插件', '1.0.2', 'https://g.csdnimg.cn/static/logo/favicon32.ico', 'CSDN存储上传拆插件', 'itchenliang', 'uploader', 'Node', 2, 1, 20, 0, 'free', 0, '["uploader", "plugin", "csdn", "blog", "picture"]', '2023-09-20 06:20:19', '2024-01-28 08:26:11');
INSERT INTO "public"."plugin" VALUES (23, '@itchenliang/picture-rollup-ucloud-plugin', '轻快图片管理系统的插件：使用rollup开发的ucloud云对象存储US3图片上传插件', '1.0.0', 'https://www.ucloud.cn/favicon.ico?v=2023091301', 'Ucloud云对象存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 0, 21, 0, 'free', 0, '["uploader", "plugin", "ucloud", "US3", "picture"]', '2023-09-20 08:25:35', '2024-01-29 05:07:39');
INSERT INTO "public"."plugin" VALUES (24, '@itchenliang/picture-rollup-postimage-plugin', '轻快图片管理系统的插件：使用rollup开发的postimage存储图片上传插件，支持设定图片过期时间和是否缩放图片功能。', '1.0.7', 'https://postimgs.org/favicon.ico', 'Postimage存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 22, 0, 'free', 0, '["uploader", "plugin", "postimage", "storage", "picture"]', '2023-09-21 05:02:18', '2023-09-21 10:02:22');
INSERT INTO "public"."plugin" VALUES (25, '@itchenliang/picture-rollup-nextcloud-plugin', '轻快图片管理系统的插件：使用rollup开发的nextcloud存储图片上传插件。', '1.0.3', 'https://nextcloud.com/wp-content/uploads/2022/03/favicon.png', 'Nextcloud存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 23, 0, 'free', 0, '["uploader", "plugin", "nextcloud", "storage", "picture"]', '2023-09-21 08:05:04', '2024-01-29 05:49:50');
INSERT INTO "public"."plugin" VALUES (26, '@itchenliang/picture-rollup-cloudflare-plugin', '轻快图片管理系统的插件：使用rollup开发的cloudflare存储图片上传插件。', '1.0.1', 'https://www.cloudflare.com/favicon.ico', 'Cloudflare存储上传插件', 'itchenliang', 'uploader', 'Node', 0, 1, 24, 0, 'free', 0, '["uploader", "plugin", "cloudflare", "storage", "picture"]', '2023-09-21 08:32:09', '2024-01-29 05:01:46');
INSERT INTO "public"."plugin" VALUES (27, '@itchenliang/picture-rollup-coding-plugin', '轻快图片管理系统的插件：使用rollup开发的coding存储图片上传插件。', '1.0.7', 'https://help-assets.codehub.cn/enterprise/guanwang/favicon.ico', 'Coding存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 27, 0, 'free', 0, '["uploader", "plugin", "coding", "storage", "picture"]', '2023-09-21 09:24:25', '2024-01-29 05:49:03');
INSERT INTO "public"."plugin" VALUES (28, '@itchenliang/picture-rollup-azure-plugin', '轻快图片管理系统的插件：使用rollup开发的azure repo存储上传插件', '1.0.9', 'https://azure.microsoft.com/favicon.ico', 'AzureRepo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 25, 0, 'free', 0, '["uploader", "plugin", "azure", "storage", "repo"]', '2023-09-22 06:55:05', '2024-01-29 06:07:23');
INSERT INTO "public"."plugin" VALUES (29, '@itchenliang/picture-rollup-gitlab-plugin', '轻快图片管理系统的插件：使用rollup开发的gitlab repo存储上传插件', '1.0.3', 'https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png', 'GitlabRepo存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 26, 0, 'free', 0, '["uploader", "plugin", "gitlab", "storage", "repo"]', '2023-09-22 09:34:23', '2024-01-29 05:49:20');
INSERT INTO "public"."plugin" VALUES (31, '@itchenliang/picture-rollup-segmentfault-plugin', '轻快图片管理系统的插件：使用rollup开发的思否存储图片上传插件。', '1.0.1', 'https://static.segmentfault.com/main_site_next/c395bbfb/favicon.ico', '思否社区存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 1, 28, 0, 'free', 0, '["uploader", "plugin", "segmentfault", "思否", "picture"]', '2023-09-27 09:47:42', '2024-01-29 04:09:21');
INSERT INTO "public"."plugin" VALUES (32, '@itchenliang/picture-rollup-tencent-plugin', '轻快图片管理系统的插件：使用rollup开发的腾讯云开发者社区存储图片上传插件。', '1.0.0', 'https://cloud.tencent.com/favicon.ico', '腾讯开发者社区存储上传插件', 'itchenliang', 'uploader', 'Node', 1, 0, 29, 0, 'free', 0, '["uploader", "plugin", "腾讯云", "开发者社区", "picture"]', '2023-09-28 06:08:39', '2023-12-08 09:58:58');
INSERT INTO "public"."plugin" VALUES (33, '@itchenliang/picture-plugin-uuid', 'UUID全称为通用唯一识别码（Universally Unique Identifier），是一种标准化的标识符，在计算机系统中广泛应用，用于唯一标识对象、实体或信息。UUID由128位数字组成，通常以32个十六进制数字的形式表示，中间使用连字符进行分隔。', '1.0.9', 'https://files.mdnice.com/user/31298/06f32ee8-5135-4149-8572-cefc7bfeeaa7.png', 'UUID生成器', 'itchenliang', 'tooler', 'Browser', 2, 1, 30, 0, 'free', 0, '["tooler", "plugin", "uuid", "UUID"]', '2024-01-10 00:47:58', '2024-01-29 05:48:40');
INSERT INTO "public"."plugin" VALUES (34, '@itchenliang/picture-plugin-img-cutter', '简单易用的在线裁剪图片工具，支持gif、png、jpg、jpeg等图片裁剪，同时也支持裁剪远程图片。', '1.0.3', 'https://files.mdnice.com/user/31298/a5b9e591-b9cb-4c2c-8a3e-f7a1650a8155.png', '在线图片裁剪', 'itchenliang', 'tooler', 'Browser', 1, 1, 31, 0, 'free', 0, '["tooler", "plugin", "image", "cutter", "工具"]', '2024-01-11 04:38:26', '2024-01-29 03:27:27');
INSERT INTO "public"."plugin" VALUES (35, '@itchenliang/picture-plugin-code2image', '简单易用的代码转图片的工具，快速将源代码转换成美丽图像的在线工具。', '1.0.3', 'https://files.mdnice.com/user/31298/05b6e50e-4bcf-4966-b73f-04ae528e8094.png', '代码转图片', 'itchenliang', 'tooler', 'Browser', 1, 1, 32, 1, 'limited_free', 24, '["tooler", "plugin", "image", "code", "工具"]', '2024-01-12 11:18:26', '2024-01-16 01:51:51');
INSERT INTO "public"."plugin" VALUES (37, '@itchenliang/picture-plugin-theme-dark', 'vscode暗黑主题', '1.0.3', 'https://files.mdnice.com/user/31298/8d1cbe32-6fa5-4f9f-bd15-e269d473bea0.png', '暗黑主题', 'itchenliang', 'themer', 'Browser', 5, 1, 34, 0, 'free', 0, '["tooler", "plugin", "theme", "dark", "主题"]', '2024-01-17 02:00:01', '2024-01-29 03:25:45');
INSERT INTO "public"."plugin" VALUES (38, '@itchenliang/picture-plugin-theme-monokai', 'vscode之Monokai主题', '1.0.2', 'https://files.mdnice.com/user/31298/df4c9089-fb8f-4b4f-86df-27856d0b203b.png', 'Monokai主题', 'itchenliang', 'themer', 'Browser', 3, 1, 35, 0, 'free', 0, '["themer", "plugin", "theme", "monokai", "主题"]', '2024-01-17 08:43:34', '2024-01-29 03:26:25');
INSERT INTO "public"."plugin" VALUES (39, '@itchenliang/picture-plugin-theme-onedark', 'vscode之one dark pro主题', '1.0.2', 'https://files.mdnice.com/user/31298/cf5969e9-e667-458e-8d7a-ba4ae5bdaaec.png', 'OneDarkPro主题', 'itchenliang', 'themer', 'Browser', 2, 1, 36, 0, 'free', 0, '["themer", "plugin", "theme", "one dark", "主题"]', '2024-01-18 09:38:07', '2024-01-29 03:25:35');
INSERT INTO "public"."plugin" VALUES (40, '@itchenliang/picture-plugin-image2base64', '一个生成图片的Base64编码数据的在线工具。', '1.0.4', 'https://files.mdnice.com/user/31298/b85be754-6f64-4666-99e7-459fda565bf2.png', '图片Base64编码', 'itchenliang', 'tooler', 'Browser', 4, 1, 37, 0, 'free', 0, '["tooler", "plugin", "image", "base64", "dataURI"]', '2024-01-22 02:34:38', '2024-01-29 03:09:47');

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS "public"."question";
CREATE TABLE "public"."question" (
  "id" int4 NOT NULL DEFAULT nextval('question_id_seq'::regclass),
  "quesion_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_desc" text COLLATE "pg_catalog"."default",
  "question_author_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_author_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_author_avatar" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_created" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "question_updated" varchar(255) COLLATE "pg_catalog"."default",
  "question_red_money" int4 DEFAULT 0,
  "question_red_count" int4 DEFAULT 0,
  "notify_status" bool DEFAULT false,
  "notify_time" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "status" bool DEFAULT true,
  "weight" int4 NOT NULL DEFAULT 1,
  "uid" int4,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."question"."quesion_id" IS '问题原id';
COMMENT ON COLUMN "public"."question"."question_title" IS '问题标题';
COMMENT ON COLUMN "public"."question"."question_desc" IS '问题描述';
COMMENT ON COLUMN "public"."question"."question_author_name" IS '问题作者名称';
COMMENT ON COLUMN "public"."question"."question_author_id" IS '问题作者id';
COMMENT ON COLUMN "public"."question"."question_author_avatar" IS '问题作者头像';
COMMENT ON COLUMN "public"."question"."question_created" IS '问题创建时间';
COMMENT ON COLUMN "public"."question"."question_updated" IS '问题更新时间';
COMMENT ON COLUMN "public"."question"."question_red_money" IS '问题红包金额';
COMMENT ON COLUMN "public"."question"."question_red_count" IS '问题红包个数';
COMMENT ON COLUMN "public"."question"."notify_status" IS '通知状态';
COMMENT ON COLUMN "public"."question"."notify_time" IS '最近通知时间';
COMMENT ON COLUMN "public"."question"."status" IS '状态';
COMMENT ON COLUMN "public"."question"."weight" IS '排序值，值越大越靠前';
COMMENT ON COLUMN "public"."question"."uid" IS '创建人';

-- ----------------------------
-- Records of question
-- ----------------------------

-- ----------------------------
-- Table structure for setting
-- ----------------------------
DROP TABLE IF EXISTS "public"."setting";
CREATE TABLE "public"."setting" (
  "id" int4 NOT NULL DEFAULT nextval('setting_id_seq'::regclass),
  "website" json NOT NULL,
  "contact" json NOT NULL,
  "system" json NOT NULL,
  "uplog" text COLLATE "pg_catalog"."default" NOT NULL,
  "bucket_service" json NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."setting"."website" IS '网站信息';
COMMENT ON COLUMN "public"."setting"."contact" IS '联系我们';
COMMENT ON COLUMN "public"."setting"."system" IS '系统配置';
COMMENT ON COLUMN "public"."setting"."uplog" IS '更新日志';
COMMENT ON COLUMN "public"."setting"."bucket_service" IS '右上角菜单配置';

-- ----------------------------
-- Records of setting
-- ----------------------------
INSERT INTO "public"."setting" VALUES (1, '{"ico": "https://cdn.yopngs.com/2023/10/12/594e5a00-b98b-49c9-bb68-d27a2e01efd2.png", "desc": "图片上传+管理新体验的轻量级图片管理系统、图床系统", "keys": ["图床", "图片管理", "插件管理", "图床系统", "知识库管理", "文档管理"], "logo": "https://cdn.yopngs.com/2023/10/12/594e5a00-b98b-49c9-bb68-d27a2e01efd2.png", "name": "轻快图片管理系统", "title": "", "author": "itchenliang", "domain": "", "baseUrl": "", "version": "1.0.0", "subtitle": "", "ico_preview": "", "logo_preview": "http://lc-DZNcsGI3.cn-n1.lcfile.com/e4TyxC3fN5Mxq2P8PxFHcCbllUPoLzhE/logo.png", "reward_alipay": "http://lc-dzncsgi3.cn-n1.lcfile.com/FnXBNkKfhnOYoLppJGSWQY6dUh1rnMHA/reward_alipay.jpg", "reward_weixin": "http://lc-dzncsgi3.cn-n1.lcfile.com/PAMB9Ah4luFLiVvwp6oVh6pelyPudsNK/reward_weixin.jpg", "reward_alipay_preview": "", "reward_weixin_preview": ""}', '{"qq": "1825956830", "about": "轻快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，支持在线存储桶插件开发，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、本地存储桶、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示.\n\n\n快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，支持在线存储桶插件开发，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、**本地存储桶**、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示\n\n快图床：使用koa + vue3.x + typescript全家桶实现的在线图床系统，**支持在线存储桶插件开发**，目前支持腾讯云COS、又拍云Upyun、阿里云OSS、github图床、gitee图床、本地存储桶、七牛云 KODO等在线图床存储桶。市面上最火的图床系统是picgo，但由于picgo是桌面应用程序，换了新电脑需要重新下载安装配置，十分麻烦，故诞生了这款系统。支持ChatGPT功能演示\n", "email": "", "gitee": "https://gitee.com/itchenliang", "github": "https://github.com/ischenliang", "weixin": "CL13281289371", "qq_group": ""}', '{"accept": ["jpeg", "jpg", "webp", "ico", "gif", "png", "svg", "svgz"], "map_key": "", "maxsize": 20, "icon_url": "", "map_type": "baidu", "maxcount": 30, "icon_font": "", "mail_pass": "stjflvegjjumbbfa", "mail_user": "itchenliang@163.com", "icon_prefix": "", "storage_size": 1, "storage_count": 1, "copyright_time": "上午9:00~下午18:00", "enable_chatgpt": false, "enable_register": true, "copyright_company": "itchenliang", "copyright_miiturl": "https://beian.miit.gov.cn/", "copyright_miitbeian": "蜀ICP备19023554号-2"}', '## 2024-01-26
- `U`知识库文档管理功能实现，支持在线markdown编辑(bytemd)和预览
- `A`自定义bytemd编辑器主题切换插件功能，同时支持渲染与编辑时使用
- `U`调整新增知识库时只能关联Gitee仓库(Github由于是国外镜像很多时候会出现无法访问问题)
- `U`知识库交互优化，鼠标移入知识库项支持动画效果

## 2024-01-08
- `U`修复覆盖上传图片时无法预览
  > 同时如果是覆盖上传则无需要再预览中新增记录，而是直接更新记录
- `U`修改原始的认证失败后的操作策略
- `U`修改退出登录后的操作策略
- `U`修复创建存储桶时只能选择上传插件(uploader)
- `U`获取用户已安装插件时新增`type`类型，用于区别获取什么类型的插件

## 2023-12-21
- `A`新增图库中的图片可以批量移入相册
- `A`新增可以启用或关闭注册和chatgpt功能
- `U`修复盖上传图片未生效问题
- `U`修复存储桶数据迁移之导出excel错误问题
- `A`操作日志新增按类别查询
- `A`相册新增分类查询和分页查询
- `U`调整全局样式统一，包括搜索条件、列表展现方式等
- `A`新增用户偏好设置的图片名称显示规则(原名称|时间戳名称)、图库图片呈现方式(object-fit)、相册封面呈现方式(object-fit)

', '[{"link": "https://ejq9qy8emd.feishu.cn/docx/Eo1HdFD7noXoSlxfRfWcYyzJnpf", "label": "文档中心", "target": "_blank"}, {"link": "https://github.com/ischenliang/quickly-picture-bed", "label": "Github", "target": "_blank"}, {"link": "https://gitee.com/itchenliang/quickly-picture-bed", "label": "Gitee", "target": "_blank"}]', '2023-08-25 06:06:59', '2024-01-30 03:28:30');

-- ----------------------------
-- Table structure for smscode
-- ----------------------------
DROP TABLE IF EXISTS "public"."smscode";
CREATE TABLE "public"."smscode" (
  "id" int4 NOT NULL DEFAULT nextval('smscode_id_seq'::regclass),
  "account" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "code" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "expire_at" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."smscode"."account" IS '账号，邮箱或者手机号';
COMMENT ON COLUMN "public"."smscode"."type" IS '类别，可选email|phone';
COMMENT ON COLUMN "public"."smscode"."code" IS '验证码内容';
COMMENT ON COLUMN "public"."smscode"."expire_at" IS '验证码有效期';

-- ----------------------------
-- Records of smscode
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "public"."user";
CREATE TABLE "public"."user" (
  "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "username" varchar(255) COLLATE "pg_catalog"."default" DEFAULT '默认名称'::character varying,
  "phone" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "role" int4 DEFAULT 1,
  "avatar" varchar(255) COLLATE "pg_catalog"."default" DEFAULT '星座_白羊座'::character varying,
  "desc" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "major" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "address" json,
  "status" int2 DEFAULT 1,
  "config" json,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "gender" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying
)
;
COMMENT ON COLUMN "public"."user"."email" IS '用户邮箱';
COMMENT ON COLUMN "public"."user"."username" IS '用户昵称';
COMMENT ON COLUMN "public"."user"."phone" IS '手机号';
COMMENT ON COLUMN "public"."user"."password" IS '密码';
COMMENT ON COLUMN "public"."user"."role" IS '角色';
COMMENT ON COLUMN "public"."user"."avatar" IS '头像';
COMMENT ON COLUMN "public"."user"."desc" IS '自我描述';
COMMENT ON COLUMN "public"."user"."major" IS '职业';
COMMENT ON COLUMN "public"."user"."address" IS '地址';
COMMENT ON COLUMN "public"."user"."status" IS '用户状态';
COMMENT ON COLUMN "public"."user"."config" IS '用户配置';
COMMENT ON COLUMN "public"."user"."gender" IS '性别';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO "public"."user" VALUES (1, 'admin@163.com', '管理员', '132xxxx9371', '5a8366fc9da3ff99c9b5a21702664735', 10, '星座_白羊座', '这是我的个人简介哈........', '程序猿', '["11", "1101", "110101"]', 1, '{"chatgpt": true}', '2023-08-19 09:13:16', '2024-01-30 03:26:00', '保密');

-- ----------------------------
-- Table structure for user_plugin
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_plugin";
CREATE TABLE "public"."user_plugin" (
  "id" int4 NOT NULL DEFAULT nextval('user_plugin_id_seq'::regclass),
  "pid" int4 NOT NULL,
  "uid" int4 NOT NULL,
  "status" int2 NOT NULL DEFAULT 1,
  "version" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."user_plugin"."pid" IS '插件id，关联插件表';
COMMENT ON COLUMN "public"."user_plugin"."uid" IS '用户id，关联用户表';
COMMENT ON COLUMN "public"."user_plugin"."status" IS '插件状态，停用还是启用';
COMMENT ON COLUMN "public"."user_plugin"."version" IS '当前安装的插件版本号';

-- ----------------------------
-- Records of user_plugin
-- ----------------------------
INSERT INTO "public"."user_plugin" VALUES (64, 19, 1, 1, '1.0.10', '2024-01-30 03:26:26', '2024-01-30 03:26:26');

-- ----------------------------
-- Table structure for verifycode
-- ----------------------------
DROP TABLE IF EXISTS "public"."verifycode";
CREATE TABLE "public"."verifycode" (
  "id" int4 NOT NULL DEFAULT nextval('verifycode_id_seq'::regclass),
  "code" bytea NOT NULL,
  "anser" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "expire_at" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."verifycode"."code" IS '验证码内容';
COMMENT ON COLUMN "public"."verifycode"."anser" IS '验证码答案';
COMMENT ON COLUMN "public"."verifycode"."expire_at" IS '验证码有效期';

-- ----------------------------
-- Records of verifycode
-- ----------------------------
INSERT INTO "public"."verifycode" VALUES (1397, E'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAsMCwxMDAsNDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU5ZjEiLz48cGF0aCBmaWxsPSIjYmM1OGRlIiBkPSJNNjguODUgMjUuMzlMNjguODUgMjUuMzlMNjguOTEgMjUuNDRRNzEuMDIgMjUuMjEgNzMuMTkgMjUuMjhMNzMuMTQgMjUuMjNMNzMuMDcgMjUuMTZRNzMuMTggMjMuNTcgNzMuMTggMjEuOTRMNzMuMTkgMjEuOTVMNzMuMDkgMjEuODVRNzMuMTIgMjAuMjAgNzMuMjUgMTguNDdMNzMuMTkgMTguNDFMNzMuMTUgMTguMzdRNzIuNDggMTkuNjkgNjguOTQgMjUuNDdaTTc1LjY1IDMwLjQ1TDc1LjUxIDMwLjMyTDc1LjUwIDMwLjMxUTc0LjQ0IDMwLjE3IDczLjIyIDMwLjEyTDczLjE3IDMwLjA3TDczLjE0IDMwLjA0UTczLjA0IDI4LjQ2IDcyLjk2IDI2Ljc5TDczLjAzIDI2Ljg1TDczLjAxIDI2LjgzUTY5LjUwIDI2LjgxIDY2LjMwIDI3Ljc3TDY2LjMwIDI3Ljc3TDY2LjI2IDI3LjczUTY2LjI1IDI3LjMxIDY2LjM4IDI2LjY0TDY2LjM1IDI2LjYxTDY2LjMzIDI2LjU4UTY3LjY3IDI0LjU3IDcwLjEwIDIwLjMxTDcwLjA4IDIwLjI5TDcwLjA2IDIwLjI3UTcyLjA5IDE3LjAyIDc0LjQxIDE0LjM5TDc0LjM2IDE0LjM0TDc0LjMwIDE0LjI4UTc0Ljk5IDE0LjI1IDc2LjEzIDE0LjA3TDc2LjExIDE0LjA1TDc2LjE1IDE0LjA4UTc0Ljg4IDE4LjQ3IDc0Ljg4IDIzLjI1TDc0Ljc5IDIzLjE3TDc0LjczIDIzLjEwUTc0LjcxIDI0LjA5IDc0Ljc2IDI1LjEwTDc0Ljc0IDI1LjA3TDc1LjczIDI1LjI3TDc1LjYzIDI1LjE2UTc2LjE0IDI1LjI4IDc2LjU1IDI1LjM2TDc2LjQ1IDI1LjI2TDc2LjUzIDI1LjM0UTc2LjcxIDI2LjExIDc2Ljg5IDI3LjQzTDc2LjczIDI3LjI4TDc2LjcwIDI3LjI0UTc1LjkxIDI3LjEwIDc0LjkxIDI2Ljk3TDc0Ljk1IDI3LjAyTDc0Ljk1IDI3LjAyUTc1LjIwIDI4LjQ4IDc1LjY2IDMwLjQ3Wk03Ni44MSAyNS4xOEw3Ni43MiAyNS4wOUw3Ni44MCAyNS4xOFE3Ni41NyAyNS4wMiA3Ni40NCAyNS4wMkw3Ni40MyAyNS4wMUw3Ni4yMiAyNS4wNkw3Ni4xMiAyNC45NVE3Ni4yMSAyNC4xMiA3Ni4yMSAyMy4xNkw3Ni4wNCAyMi45OUw3Ni4wNiAyMy4wMVE3Ni4wOCAxOC42OSA3Ny40OCAxNC42MUw3Ny41OSAxNC43Mkw3Ny41MiAxNC42NlE3Ny4wNSAxNC44OCA3Ni4wNyAxNS4xNEw3Ni4wMiAxNS4wOUw3NS45OSAxNS4wNlE3Ni4xOSAxNC41OSA3Ni41MCAxMy42NEw3Ni41NCAxMy42N0w3Ni41OCAxMy43MVE3NS42OSAxMy45NiA3NC4yOSAxNC4xMUw3NC4xNiAxMy45OUw3NC4yMyAxNC4wNlE3MS41MSAxNi45NCA2Ny45NyAyMy4zMEw2OC4wMSAyMy4zM0w2OS4zNiAyMC43OEw2OS41MiAyMC45NFE2OS4xMCAyMS41MCA2OC45MiAyMS44OUw2OC45NSAyMS45Mkw2NS44NiAyNy45OEw2NS45OSAyOC4xMFE2Ni40NiAyOC4wMyA2Ny4yMyAyNy43N0w2Ny4yNSAyNy43OUw2Ny4wNCAyNy44NEw2Ny4xMCAyNy45MFE2Ni45NCAyOC4yOCA2Ni43MyAyOS4xM0w2Ni43MyAyOS4xM0w2Ni42NyAyOS4wN1E2OS41NSAyOC4yNiA3Mi44MyAyOC4zOUw3Mi44MyAyOC4zOEw3Mi44NiAyOC40MVE3Mi44NCAyOS4wMSA3Mi45NyAzMC4zNkw3Mi45NyAzMC4zNkw3Mi45MiAzMC4zMVE3My43OSAzMC40NSA3NC41MSAzMC41M0w3NC41MyAzMC41NUw3NC40OSAzMC41MVE3NC40NyAzMC44NSA3NC42NSAzMS43OEw3NC44MSAzMS45NEw3NC42OCAzMS44MVE3Ni4wNSAzMi4wNCA3OC4wOSAzMi42Nkw3OC4xMSAzMi42OEw3OC4xNCAzMi43MlE3Ny40MSAzMS4yMSA3Ni43OSAyOC45OUw3Ni44MyAyOS4wM0w3Ny44NCAyOS4zN0w3Ny43OSAyOS4zMlE3OC4xMyAyOS4zNSA3OC42MCAyOS41OEw3OC43NyAyOS43Nkw3OC43MiAyOS43MFE3OC4xNyAyNy45OSA3OC4wNyAyNi44Nkw3OC4xMiAyNi45MUw3Ny45OCAyNi43NlE3Ny41OCAyNi42NSA3Ni44MCAyNi40OUw3Ni44MSAyNi41MEw3Ni45MyAyNi42MlE3Ni43NCAyNS43MCA3Ni43NCAyNS4xMVpNNzEuMzAgMjUuMDBMNzEuMjggMjQuOTdMNzEuMzQgMjUuMDRRNzEuODAgMjQuMTAgNzIuODYgMjIuMzdMNzIuOTMgMjIuNDRMNzIuNzggMjIuMjlRNzIuOTUgMjMuMTEgNzIuOTIgMjMuNzVMNzIuNzUgMjMuNThMNzIuODUgMjMuNjhRNzIuOTIgMjQuNDIgNzIuOTUgMjUuMDdMNzIuNzcgMjQuODlMNzIuODYgMjQuOThRNzIuNDUgMjQuOTMgNzIuMDYgMjQuOTNMNzIuMDMgMjQuODlMNzIuMTEgMjQuOThRNzEuNzkgMjUuMDcgNzEuMzcgMjUuMDdaIi8+PHBhdGggZmlsbD0iIzZjN2M4ZCIgZD0iTTQ4LjAwIDI5LjgxTDQ4LjA0IDI5Ljg1TDQ3LjkxIDI5LjczUTQ3LjYyIDI5Ljg3IDQ3LjE2IDI5LjkwTDQ3LjA1IDI5LjgwTDQ3LjA4IDI5LjgyUTQ2LjU2IDI5Ljg1IDQ2LjEwIDI5Ljg1TDQ2LjE3IDI5LjkyTDQ2LjEyIDI5Ljg3UTQ2LjMzIDI3LjQ1IDQ2LjMzIDI1LjEyTDQ2LjQ4IDI1LjI3TDQ2LjQyIDI1LjIxUTQ1LjE4IDI1LjIzIDQ0LjU2IDI1LjIzTDQ0LjUyIDI1LjE5TDQ0LjQ4IDI1LjE1UTQzLjg5IDI1LjE0IDQyLjY1IDI1LjA5TDQyLjcwIDI1LjEzTDQyLjc5IDI1LjIyUTQyLjg0IDI1LjA2IDQyLjcxIDIzLjM4TDQyLjYwIDIzLjI3TDQyLjYwIDIzLjI3UTQ0LjM2IDIzLjY2IDQ2LjM3IDIzLjY2TDQ2LjM2IDIzLjY1TDQ2LjQyIDIzLjcxUTQ2LjI4IDIwLjc1IDQ1Ljk5IDE4Ljk5TDQ2LjAwIDE5LjAxTDQ1Ljg4IDE4Ljg4UTQ2LjQ4IDE5LjAyIDQ3LjAyIDE5LjAyTDQ3LjExIDE5LjEwTDQ4LjEzIDE5LjAxTDQ4LjEyIDE5LjAwUTQ4LjAyIDIxLjk1IDQ4LjAyIDIzLjcxTDQ4LjAxIDIzLjcwTDQ3Ljk0IDIzLjYzUTQ5LjQ3IDIzLjY5IDUxLjY0IDIzLjQ1TDUxLjYyIDIzLjQzTDUxLjUyIDIzLjM0UTUxLjQ2IDI0LjI2IDUxLjQ2IDI1LjA4TDUxLjU2IDI1LjE4TDUxLjUzIDI1LjE2UTUxLjQ1IDI1LjI2IDUwLjkxIDI1LjI4TDUwLjkyIDI1LjI5TDUwLjc2IDI1LjE0UTUwLjIxIDI1LjI2IDQ5LjgwIDI1LjI4TDQ5Ljc2IDI1LjI0TDQ5LjgwIDI1LjI5UTQ5Ljc2IDI1LjI0IDQ3Ljk1IDI1LjI0TDQ4LjAyIDI1LjMxTDQ3LjkwIDI3LjUxTDQ3Ljg1IDI3LjQ3UTQ3Ljg5IDI4LjYyIDQ3Ljk3IDI5Ljc4Wk01MS44MyAyMy4wMkw1MS45NiAyMy4xNkw1MS44MSAyMy4wMFE1MC42OSAyMy4zOSA0OS40MyAyMy40NEw0OS4yNiAyMy4yN0w0OS4yNiAyMy4yN1E0OS40NiAyMS4xNyA0OS43NSAxOS45MUw0OS45MCAyMC4wNkw0OS44NCAyMC4wMFE0OS4zNSAyMC4wMiA0OC4zOSAyMC4xM0w0OC40MCAyMC4xNEw0OC40NCAxOC42NUw0OC41OSAxOC44MVE0Ni42OSAxOC42OSA0NS41NiAxOC42MUw0NS40OSAxOC41NUw0NS41OSAxOC42NFE0Ni4wOCAyMC44NiA0Ni4yMSAyMy41MEw0Ni4wNyAyMy4zNkw0Ni4wNCAyMy4zM1E0NC45NyAyMy40MiA0Mi40NiAyMy4wMUw0Mi4zNSAyMi45MEw0Mi4zMiAyMi44N1E0Mi41NCAyMy43MSA0Mi41NCAyNS40OUw0Mi42NSAyNS42MEw0My42MyAyNS41NUw0My42MyAyNS41NFE0My41MSAyNS45MSA0My40MCAyNi44N0w0My41MyAyNy4wMEw0Ni4yMSAyNi44MUw0Ni4yNiAyNi44NVE0NS45NCAyOC44NCA0NS43NCAzMC4wOEw0NS43OSAzMC4xM0w0NS44OSAzMC4yM1E0Ni4yNCAzMC4wNyA0Ny4yMCAyOS45OUw0Ny4yOSAzMC4wOEw0Ny4zNiAzMC4xNVE0Ny4zOCAzMC42MyA0Ny4zNSAzMS41NEw0Ny4yNSAzMS40NEw0Ny4zMSAzMS41MFE0Ny41MiAzMS4zNSA0OS45OCAzMS40NUw1MC4xMyAzMS42MUw1MC4wMCAzMS40N1E0OS40OSAyOS40OSA0OS4zNCAyNi44MUw0OS4zNiAyNi44M0w0OS4yMyAyNi43MFE1MS40NSAyNi43MyA1Mi44NyAyNi45OEw1Mi44OSAyNy4wMEw1My4wMyAyNy4xNFE1Mi44MCAyNi4zOSA1Mi44MCAyNS43NUw1Mi43OSAyNS43NEw1Mi44MCAyNC40Nkw1Mi44NCAyNC41MFE1Mi43MiAyNC41MyA1Mi4zNiAyNC41Nkw1Mi4yNCAyNC40NEw1MS43MyAyNC40N0w1MS43NyAyNC41MlE1MS44NSAyNC4wNSA1MS45MyAyMy4xMloiLz48cGF0aCBmaWxsPSIjNTk5ZjlmIiBkPSJNMTkuODcgMjUuNDFMMTkuOTAgMjUuNDRMMTkuOTMgMjUuNDdRMjEuODggMjUuMDYgMjQuMDUgMjUuMTRMMjQuMDUgMjUuMTRMMjQuMTQgMjUuMjNRMjQuMTAgMjMuNDggMjQuMTAgMjEuODZMMjQuMTMgMjEuODlMMjQuMDUgMjEuODFRMjQuMTEgMjAuMTkgMjQuMjMgMTguNDZMMjQuMjggMTguNTBMMjQuMjggMTguNTBRMjMuMzggMTkuNTkgMTkuODQgMjUuMzhaTTI2LjYyIDMwLjQyTDI2LjU4IDMwLjM4TDI2LjY3IDMwLjQ3UTI1LjQ5IDMwLjIyIDI0LjI3IDMwLjE3TDI0LjE2IDMwLjA2TDI0LjI5IDMwLjE5UTI0LjAxIDI4LjQ0IDIzLjk0IDI2Ljc2TDI0LjA0IDI2Ljg2TDIzLjk0IDI2Ljc2UTIwLjM2IDI2LjY3IDE3LjE1IDI3LjYyTDE3LjEzIDI3LjYwTDE3LjI4IDI3Ljc1UTE3LjIxIDI3LjI2IDE3LjM0IDI2LjU5TDE3LjQ1IDI2LjcxTDE3LjMxIDI2LjU3UTE4LjU1IDI0LjQ1IDIwLjk4IDIwLjE5TDIwLjk4IDIwLjE5TDIxLjEyIDIwLjMzUTIyLjk5IDE2LjkzIDI1LjMyIDE0LjI5TDI1LjM5IDE0LjM3TDI1LjM3IDE0LjM1UTI1LjkwIDE0LjE2IDI3LjA0IDEzLjk3TDI3LjE0IDE0LjA3TDI3LjAwIDEzLjk0UTI1LjgyIDE4LjQxIDI1LjgyIDIzLjE5TDI1Ljc2IDIzLjEzTDI1LjcyIDIzLjA5UTI1Ljc1IDI0LjEzIDI1LjgwIDI1LjE0TDI1Ljc3IDI1LjEwTDI2LjcwIDI1LjI0TDI2LjcxIDI1LjI0UTI3LjA2IDI1LjIxIDI3LjQ3IDI1LjI5TDI3LjUzIDI1LjM0TDI3LjQ3IDI1LjI5UTI3LjcwIDI2LjExIDI3Ljg4IDI3LjQzTDI3Ljg2IDI3LjQwTDI3LjgxIDI3LjM1UTI3LjAwIDI3LjE5IDI1Ljk5IDI3LjA2TDI1Ljg5IDI2Ljk2TDI1Ljg2IDI2LjkzUTI2LjA5IDI4LjM3IDI2LjU2IDMwLjM2Wk0yNy43MyAyNS4xMEwyNy44MSAyNS4xOEwyNy44MSAyNS4xOFEyNy41NCAyNC45OSAyNy40MSAyNC45OUwyNy40OSAyNS4wN0wyNy4xMSAyNC45NUwyNy4xOSAyNS4wM1EyNy4xMiAyNC4wMyAyNy4xMiAyMy4wN0wyNy4xOSAyMy4xNEwyNy4wNiAyMy4wMVEyNy4wOSAxOC43MCAyOC40OCAxNC42MkwyOC40MiAxNC41NkwyOC40NyAxNC42MFEyOC4wNyAxNC45MSAyNy4wOSAxNS4xNkwyNy4wMiAxNS4wOUwyNy4wMiAxNS4wOVEyNy4yMyAxNC42MyAyNy41NCAxMy42N0wyNy41MyAxMy42N0wyNy40MiAxMy41NlEyNi42MiAxMy44OSAyNS4yMyAxNC4wNUwyNS4yNyAxNC4xMEwyNS4yMCAxNC4wMlEyMi41MCAxNi45MyAxOC45NiAyMy4yOEwxOC45NiAyMy4yOEwyMC4zOSAyMC44MkwyMC40NSAyMC44N1EyMC4wOSAyMS40OSAxOS45MSAyMS44OEwxOS45MyAyMS45MEwxNy4wMCAyOC4xMUwxNi44NyAyNy45OVExNy4zMiAyNy44OSAxOC4wOSAyNy42M0wxOC4xOCAyNy43MkwxOC4wNCAyNy44M0wxOC4wMyAyNy44M1ExNy45NiAyOC4zMCAxNy43NSAyOS4xNUwxNy43NyAyOS4xN0wxNy43MSAyOS4xMVEyMC42MiAyOC4zMyAyMy45MCAyOC40NkwyMy44MCAyOC4zNkwyMy44MiAyOC4zN1EyMy45NSAyOS4xMiAyNC4wOCAzMC40N0wyNC4wNyAzMC40NkwyNC4wMiAzMC40MVEyNC43OSAzMC40NiAyNS41MiAzMC41NEwyNS40NyAzMC40OUwyNS40MiAzMC40NFEyNS41MiAzMC45MCAyNS43MCAzMS44M0wyNS43MSAzMS44NEwyNS43NiAzMS44OVEyNi45OCAzMS45NyAyOS4wMiAzMi41OUwyOS4wMSAzMi41OUwyOS4wMCAzMi41OFEyOC40NiAzMS4yNiAyNy44NCAyOS4wNEwyNy43NyAyOC45N0wyOC44NCAyOS4zNkwyOC43NiAyOS4yOFEyOS4xOSAyOS40MCAyOS42NSAyOS42M0wyOS42OCAyOS42NkwyOS42MiAyOS42MFEyOS4xMSAyNy45MyAyOS4wMCAyNi43OUwyOS4xMiAyNi45MUwyOC45OCAyNi43N1EyOC41NyAyNi42NCAyNy43OSAyNi40OEwyNy44MiAyNi41MUwyNy44NCAyNi41M1EyNy42MyAyNS42MCAyNy42MyAyNS4wMVpNMjIuMjYgMjQuOTZMMjIuMzEgMjUuMDFMMjIuMjggMjQuOThRMjIuODggMjQuMTggMjMuOTQgMjIuNDVMMjMuOTMgMjIuNDRMMjMuODMgMjIuMzRRMjMuODYgMjMuMDIgMjMuODMgMjMuNjZMMjMuODMgMjMuNjVMMjMuNzkgMjMuNjFRMjMuNzkgMjQuMjggMjMuODEgMjQuOTNMMjMuODggMjUuMDBMMjMuNzkgMjQuOTFRMjMuNTUgMjUuMDMgMjMuMTYgMjUuMDNMMjMuMDggMjQuOTRMMjMuMDUgMjQuOTJRMjIuNjUgMjQuOTMgMjIuMjQgMjQuOTNaIi8+PHBhdGggZD0iTTggMTEgQzMzIDM2LDQzIDI1LDg5IDEiIHN0cm9rZT0iIzdmZWY3ZiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCAzNCBDNDUgMTgsNTYgMjksOTEgMjUiIHN0cm9rZT0iI2M3NzJlMyIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==', '8', '2024-01-30 03:26:06', '2024-01-30 03:26:02', '2024-01-30 03:26:06');

-- ----------------------------
-- Table structure for wiki
-- ----------------------------
DROP TABLE IF EXISTS "public"."wiki";
CREATE TABLE "public"."wiki" (
  "id" int4 NOT NULL DEFAULT nextval('wiki_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL::character varying,
  "description" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "status" int2 NOT NULL,
  "weight" int4 NOT NULL DEFAULT 1,
  "config" json NOT NULL,
  "uid" int4,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."wiki"."title" IS '知识库名称';
COMMENT ON COLUMN "public"."wiki"."description" IS '知识库描述';
COMMENT ON COLUMN "public"."wiki"."status" IS '文档状态，私有还是公开';
COMMENT ON COLUMN "public"."wiki"."weight" IS '文档权重，值越大越靠前';
COMMENT ON COLUMN "public"."wiki"."config" IS '空间配置';
COMMENT ON COLUMN "public"."wiki"."uid" IS '文档拥有者';

-- ----------------------------
-- Records of wiki
-- ----------------------------

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."album_id_seq"
OWNED BY "public"."album"."id";
SELECT setval('"public"."album_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."album_tag_id_seq"
OWNED BY "public"."album_tag"."id";
SELECT setval('"public"."album_tag_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."article_id_seq"
OWNED BY "public"."article"."id";
SELECT setval('"public"."article_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."author_id_seq"
OWNED BY "public"."author"."id";
SELECT setval('"public"."author_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."author_question_id_seq"
OWNED BY "public"."author_question"."id";
SELECT setval('"public"."author_question_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."bucket_id_seq"
OWNED BY "public"."bucket"."id";
SELECT setval('"public"."bucket_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."dict_id_seq"
OWNED BY "public"."dict"."id";
SELECT setval('"public"."dict_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."habits_id_seq"
OWNED BY "public"."habits"."id";
SELECT setval('"public"."habits_id_seq"', 22, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."image_id_seq"
OWNED BY "public"."image"."id";
SELECT setval('"public"."image_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."log_id_seq"
OWNED BY "public"."log"."id";
SELECT setval('"public"."log_id_seq"', 1010, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notify_history_id_seq"
OWNED BY "public"."notify_history"."id";
SELECT setval('"public"."notify_history_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notify_receiver_id_seq"
OWNED BY "public"."notify_receiver"."id";
SELECT setval('"public"."notify_receiver_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."plugin_id_seq"
OWNED BY "public"."plugin"."id";
SELECT setval('"public"."plugin_id_seq"', 40, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."question_id_seq"
OWNED BY "public"."question"."id";
SELECT setval('"public"."question_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."setting_id_seq"
OWNED BY "public"."setting"."id";
SELECT setval('"public"."setting_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."smscode_id_seq"
OWNED BY "public"."smscode"."id";
SELECT setval('"public"."smscode_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."user_id_seq"
OWNED BY "public"."user"."id";
SELECT setval('"public"."user_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."user_plugin_id_seq"
OWNED BY "public"."user_plugin"."id";
SELECT setval('"public"."user_plugin_id_seq"', 64, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."verifycode_id_seq"
OWNED BY "public"."verifycode"."id";
SELECT setval('"public"."verifycode_id_seq"', 1397, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."wiki_id_seq"
OWNED BY "public"."wiki"."id";
SELECT setval('"public"."wiki_id_seq"', 1, false);

-- ----------------------------
-- Primary Key structure for table album
-- ----------------------------
ALTER TABLE "public"."album" ADD CONSTRAINT "album_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table album_tag
-- ----------------------------
CREATE INDEX "public_album_tag_album_id0_idx" ON "public"."album_tag" USING btree (
  "album_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table album_tag
-- ----------------------------
ALTER TABLE "public"."album_tag" ADD CONSTRAINT "album_tag_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table article
-- ----------------------------
CREATE INDEX "public_article_pid0_idx" ON "public"."article" USING btree (
  "pid" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "public_article_uid2_idx" ON "public"."article" USING btree (
  "uid" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "public_article_wid1_idx" ON "public"."article" USING btree (
  "wid" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table article
-- ----------------------------
ALTER TABLE "public"."article" ADD CONSTRAINT "article_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table author
-- ----------------------------
ALTER TABLE "public"."author" ADD CONSTRAINT "author_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table author_question
-- ----------------------------
ALTER TABLE "public"."author_question" ADD CONSTRAINT "author_question_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table bucket
-- ----------------------------
CREATE INDEX "public_bucket_uid0_idx" ON "public"."bucket" USING btree (
  "uid" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "public_bucket_user_plugin_id1_idx" ON "public"."bucket" USING btree (
  "user_plugin_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table bucket
-- ----------------------------
ALTER TABLE "public"."bucket" ADD CONSTRAINT "bucket_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table dict
-- ----------------------------
CREATE UNIQUE INDEX "public_dict_code0_idx" ON "public"."dict" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table dict
-- ----------------------------
ALTER TABLE "public"."dict" ADD CONSTRAINT "dict_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table habits
-- ----------------------------
CREATE INDEX "public_habits_uid0_idx" ON "public"."habits" USING btree (
  "uid" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table habits
-- ----------------------------
ALTER TABLE "public"."habits" ADD CONSTRAINT "habits_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table image
-- ----------------------------
ALTER TABLE "public"."image" ADD CONSTRAINT "image_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table log
-- ----------------------------
ALTER TABLE "public"."log" ADD CONSTRAINT "log_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notify_history
-- ----------------------------
ALTER TABLE "public"."notify_history" ADD CONSTRAINT "notify_history_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notify_receiver
-- ----------------------------
ALTER TABLE "public"."notify_receiver" ADD CONSTRAINT "notify_receiver_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table plugin
-- ----------------------------
ALTER TABLE "public"."plugin" ADD CONSTRAINT "plugin_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table question
-- ----------------------------
ALTER TABLE "public"."question" ADD CONSTRAINT "question_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table setting
-- ----------------------------
ALTER TABLE "public"."setting" ADD CONSTRAINT "setting_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table smscode
-- ----------------------------
ALTER TABLE "public"."smscode" ADD CONSTRAINT "smscode_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user
-- ----------------------------
CREATE UNIQUE INDEX "public_user_email0_idx" ON "public"."user" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "public_user_phone1_idx" ON "public"."user" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table user
-- ----------------------------
ALTER TABLE "public"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_plugin
-- ----------------------------
CREATE INDEX "public_user_plugin_pid0_idx" ON "public"."user_plugin" USING btree (
  "pid" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "public_user_plugin_uid1_idx" ON "public"."user_plugin" USING btree (
  "uid" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table user_plugin
-- ----------------------------
ALTER TABLE "public"."user_plugin" ADD CONSTRAINT "user_plugin_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table verifycode
-- ----------------------------
ALTER TABLE "public"."verifycode" ADD CONSTRAINT "verifycode_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table wiki
-- ----------------------------
CREATE INDEX "public_wiki_uid0_idx" ON "public"."wiki" USING btree (
  "uid" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table wiki
-- ----------------------------
ALTER TABLE "public"."wiki" ADD CONSTRAINT "wiki_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table album_tag
-- ----------------------------
ALTER TABLE "public"."album_tag" ADD CONSTRAINT "album_tag_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."album" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table article
-- ----------------------------
ALTER TABLE "public"."article" ADD CONSTRAINT "article_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."article" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."article" ADD CONSTRAINT "article_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."article" ADD CONSTRAINT "article_wid_fkey" FOREIGN KEY ("wid") REFERENCES "public"."wiki" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table author
-- ----------------------------
ALTER TABLE "public"."author" ADD CONSTRAINT "author_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table author_question
-- ----------------------------
ALTER TABLE "public"."author_question" ADD CONSTRAINT "author_question_aid_fkey" FOREIGN KEY ("aid") REFERENCES "public"."author" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."author_question" ADD CONSTRAINT "author_question_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table bucket
-- ----------------------------
ALTER TABLE "public"."bucket" ADD CONSTRAINT "bucket_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."bucket" ADD CONSTRAINT "bucket_user_plugin_id_fkey" FOREIGN KEY ("user_plugin_id") REFERENCES "public"."user_plugin" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table habits
-- ----------------------------
ALTER TABLE "public"."habits" ADD CONSTRAINT "habits_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table notify_history
-- ----------------------------
ALTER TABLE "public"."notify_history" ADD CONSTRAINT "notify_history_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table notify_receiver
-- ----------------------------
ALTER TABLE "public"."notify_receiver" ADD CONSTRAINT "notify_receiver_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table question
-- ----------------------------
ALTER TABLE "public"."question" ADD CONSTRAINT "question_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table user_plugin
-- ----------------------------
ALTER TABLE "public"."user_plugin" ADD CONSTRAINT "user_plugin_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."plugin" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_plugin" ADD CONSTRAINT "user_plugin_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table wiki
-- ----------------------------
ALTER TABLE "public"."wiki" ADD CONSTRAINT "wiki_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
