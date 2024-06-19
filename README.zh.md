# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

InfoHarvest 是一个书签管理工具，它使用户能够收集和存储有趣的在线内容，以便轻松访问和管理

[English](./README.md)

## 不同之处

InfoHarvest 书签工具和浏览器书签不同的是：

1. **添加更多额外信息**：InfoHarvest 允许用户为书签添加标记，描述等信息

2. **非嵌套的层级结构**：InfoHarvest 避免了书签的深度嵌套，更易于查找和管理

3. **同步和集中的管理**：InfoHarvest 提供了一个集中化的平台用于管理书签，解决了书签分散在不同浏览器或账号中的问题

## 功能特点

- **私有化部署**：InfoHarvest 支持私有部署，使用户可以完全掌控自己的书签数据

- **关键词搜索**：InfoHarvest 提供强大的搜索功能，可以通过关键词快速找到书签

- **多名称和多链接**：InfoHarvest 支持对一个书签，添加多个名称和链接，而不是一个书签只有一个标题和 URL

- **书签历史记录**：InfoHarvest 提供记录书签的历史记录功能，使用户可以回看之前更新的内容

## 快速开始

如果你希望将 InfoHarvest 部署到自己的服务器上或者本地开发体验，请继续往下看

## 本地开发

InfoHarvest 使用 [NestJS 10](https://nestjs.com) 和 [Next.js 14](https://nextjs.org)、[Shadcn-ui](https://ui.shadcn.com) 开发

在设计上是单用户管理，数据库使用 MySQL 8；在架构上采用前后端分离开发

根目录属于后端服务，构建方式为 Docker；web 目录属于前端 UI，构建方式为 Static Exports

下面将分别介绍如何进行本地开发：

### 启动后端服务

1. 首先，使用以下命令克隆仓库：

   ```bash
   git clone https://github.com/dafengzhen/infoharvest.git
   ```

2. 进入克隆的仓库目录，并修改启动配置（.env）文件，主要是配置数据库连接信息

3. 配置完成后，准备运行。使用 npm 安装依赖：

   ```bash
   npm install
   ```

4. 启动服务，默认启动端口为 8080：

   ```bash
   npm run dev
   ```

   注意：可以根据需要修改启动端口，通过 src/main.ts 文件下的 app.listen 函数来修改端口

5. 其他命令可查看 package.json 文件。

### 启动前端服务

1. 进入 web 文件夹：

   ```bash
   cd web
   ```

2. 使用 npm 安装依赖：

   ```bash
   npm install
   ```

3. 启动服务，默认启动端口为 3000：

   ```bash
   npm run dev
   ```

   注意：可以根据需要修改启动端口，在 package.json 文件中的 ```scripts``` 部分可以找到相关配置

4. 其他命令可查看 package.json 文件

   以上是关于在本地进行 InfoHarvest 的开发环境搭建和启动服务的步骤

## 私有部署

InfoHarvest 后端使用 Docker 部署，以减少繁杂的环境配置问题

InfoHarvest 前端使用静态导出，这意味着它可以部署和托管在任何可以提供 HTML/CSS/JS 静态资产的 Web 服务器上

### 拉取仓库

使用以下命令克隆仓库：

```bash
git clone https://github.com/dafengzhen/infoharvest.git
```

### 准备条件

确保你已安装 MySQL 8 数据库，并根据仓库目录下的 ```.env``` 配置文件提前新建数据库名称。例如，默认数据库名称为 ```infoharvest```

### 构建后端服务

1. 更新 ```.env``` 配置文件，填写数据库等信息

2. 在当前目录下运行以下命令构建后端服务：

   ```bash
   docker build -t infoharvest .
   ```

   默认情况下，后端服务将运行在 8080 端口

### 构建前端服务

1. 进入 ```web``` 文件夹：

   ```bash
   cd web
   ```

2. 更新 ```web/.env``` 配置文件，填写接口等信息

3. 在当前目录下运行以下命令构建前端服务：

   构建将输出在 `out` 目录

   ```bash
   npm run build
   ```

### 运行服务

1. 运行后端服务

   完成后端的构建后，使用 ```docker run``` 命令运行服务即可

   例如：
   
   ```bash
   docker run --restart=always -d -p 8080:8080 infoharvest
   ```

2. 运行前端服务

   完成前端的构建后，就可以将 `out` 目录放置到你 Web 服务器上
   
   例如：使用 Nginx 代理，以下是一个示例
   
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

你如果有任何建议，请在 GitHub 上[打开一个问题](https://github.com/dafengzhen/infoharvest/issues) ↗，欢迎与我交流改进

## License

InfoHarvest 发布在 [MIT](https://opensource.org/licenses/MIT) 许可证下
