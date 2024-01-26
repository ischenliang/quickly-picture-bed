# Stage1: 安装依赖打包项目
FROM node:18.15.0 as node
RUN mkdir -p /client
WORKDIR /client
# 将 package.json 和 package-lock.json 拷贝到容器中
COPY package*.json ./
# 切换镜像
RUN npm config set registry https://registry.npmmirror.com/
# 安装依赖
RUN npm install
# 将所有文件拷贝到容器中
COPY . .
# 打包项目
RUN npm run build

# Stage2: 将dist部署到nginx上
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]