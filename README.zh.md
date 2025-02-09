# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

InfoHarvest 是一款书签管理工具，帮助用户收集和存储有趣的在线内容，便于访问和管理

InfoHarvest 采用前后端分离架构，支持单用户管理，并使用 MySQL 9 作为数据库

- **前端**：基于 [Next.js 15](https://nextjs.org)（React 框架）开发
- **后端**：[InfoHarvest API](https://github.com/dafengzhen/infoharvest-api) 基于 [NestJS 11](https://nestjs.com) 开发

[English](./README.md)

## 功能特点

- **多名称和链接**：支持为同一书签添加多个名称和链接
- **丰富的书签信息**：允许为书签添加标记、描述等
- **关键词搜索**：强大的搜索功能，助力快速查找书签
- **书签历史记录**：记录书签更新历史，方便回溯
- **私有化部署**：支持私有部署，确保书签数据完全掌控

## InfoHarvest 扩展

将 InfoHarvest 设置为您的默认新标签页，打造无缝的浏览体验

- **GitHub 仓库:** [infoharvest-extension](https://github.com/dafengzhen/infoharvest-extension)

## 快速开始

如果你希望在本地开发或部署 InfoHarvest，请按照以下步骤操作

## 本地开发

### 启动后端服务

1. 克隆仓库

   ```bash
   git clone https://github.com/dafengzhen/infoharvest-api
   ```

2. 配置 ```.env``` 文件，设置数据库连接信息

3. 安装依赖

   ```bash
   npm install
   ```

4. 启动服务（默认端口：8080）

   ```bash
   npm run dev
   ```

5. 其他命令可查看 package.json 文件

### 启动前端服务

1. 克隆仓库

   ```bash
   git clone https://github.com/dafengzhen/infoharvest
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动服务（默认端口：3000）

   ```bash
   npm run dev
   ```

4. 更多命令请查看 package.json

## 私有部署

InfoHarvest 后端采用 Docker 部署，简化环境配置

前端支持静态导出，可部署至任何支持静态文件的 Web 服务器

### 准备工作

确保已安装 MySQL 9，并根据 ```.env``` 配置文件提前创建数据库，例如默认名称为 ```infoharvest```

### 构建后端服务

1. 更新 ```.env``` 配置文件，设置数据库信息

2. 运行以下命令构建后端服务

   ```bash
   docker build -t infoharvest .
   ```

   默认后端服务端口：8080

### 构建前端服务

1. 更新 ```.env``` 配置文件，设置 API 接口信息

2. 运行以下命令构建前端，输出目录为 ```out```

   ```bash
   npm run build
   ```

### 运行服务

1. 运行后端服务

   构建完成后，使用 ```docker run``` 命令运行后端

   例如：

   ```bash
   docker run --restart=always -d -p 8080:8080 infoharvest
   ```

2. 运行前端服务

   构建完成后，将 ```out``` 目录部署至 Web 服务器

   示例：使用 Nginx 代理：

   ```nginx
   server {
     ......
   
     # Infoharvest
     location /infoharvest {
       alias /usr/share/nginx/html/infoharvest/out;
       try_files $uri $uri.html $uri/ =404;
     }
   
     ......
   }
   ```

## 相关反馈

如果你有任何建议或问题，请在 GitHub 上提交 [Issue](https://github.com/dafengzhen/infoharvest/issues) ↗，欢迎交流与改进

## License

InfoHarvest 遵循 [MIT](https://opensource.org/licenses/MIT) 许可证
