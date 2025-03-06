# 使用 Nginx Alpine 作为基础镜像
FROM nginx:alpine


# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY package.json package-lock.json ./
COPY . .

# 将构建好的静态文件复制到 Nginx 的默认静态文件目录
RUN cp -r build/* /usr/share/nginx/html

# 设置Nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]