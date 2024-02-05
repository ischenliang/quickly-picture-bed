FROM node:18.15.0
# 运行成功后就可以安装和更新软件包了。
RUN mkdir -p /app
WORKDIR /app

# 将 package.json 和 package-lock.json 拷贝到容器中
COPY package*.json ./

# 切换镜像
RUN npm config set registry https://registry.npmmirror.com/

# 安装依赖
RUN npm install

# 安装nodemon和ts-node和typescript
# RUN npm install nodemon -g
RUN npm install ts-node -g
RUN npm install typescript

# 将所有文件拷贝到容器中
COPY . .

# 安装mysql数据库
# RUN apt-get update && apt-get -y install mysql-client

# 暴露端口
EXPOSE 3002

# 启动服务
CMD ["npm", "run", "start"]