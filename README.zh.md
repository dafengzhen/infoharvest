# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

InfoHarvest 是一个书签管理工具，它使用户能够收集和存储有趣的在线内容，以便轻松访问和管理

[English](./README.md)

## 简介

类似于浏览器书签，InfoHarvest 旨在通过添加额外的信息（如描述）来增强书签的使用体验，同时保持简单性，避免过多的冗杂信息。与笔记或博客平台不同，InfoHarvest 专注于信息的收集和组织

收集有价值的信息可能具有一定的挑战性，尤其是在 "收获" 对自己有用的信息时。通过 InfoHarvest，您可以有效地维护和管理自己有用的资源收藏

## 主要特点

InfoHarvest 解决了以下常见场景：

1. **添加备注信息**：与传统书签只提供标题和 URL 不同，InfoHarvest 允许用户为书签添加描述。该功能使用户能够提供背景信息，并记住为什么收藏了特定资源

2. **控制层级结构**：InfoHarvest 避免了书签的深度嵌套，这使得它们更易于查找和管理。通过控制层级结构，用户可以轻松导航和定位书签，而无需在复杂的文件夹结构中迷失方向

3. **同步和集中管理**：InfoHarvest 提供了一个集中化的平台用于管理书签，克服了书签分散在不同浏览器或账号中的问题。通过 InfoHarvest，您可以将书签同步并从浏览器访问

## 功能

- **私有化部署**：InfoHarvest 支持私有部署，使用户可以完全掌控自己的书签数据，并确保隐私安全

- **关键词搜索**：InfoHarvest 提供强大的搜索功能，使用户可以使用关键词快速找到特定的书签

- **增强的书签信息**：除了标题和 URL 之外，InfoHarvest 允许用户为书签添加描述、分类和状态等附加信息。这个功能为每个书签提供了更好的组织和上下文

- **书签历史记录**：InfoHarvest 记录书签的历史记录，使用户可以重新查看先前更新过的资源

- **导入和导出**：InfoHarvest 支持书签的导入和导出，方便从其他书签工具迁移或与他人分享书签

- **浏览器书签解析**：InfoHarvest 提供解析浏览器书签的功能，允许用户方便地导入支持的浏览器中的现有书签

## 快速开始

InfoHarvest 书签管理工具提供了一个免费的云端环境，方便使用体验。点击[示例用户](https://www.infoharvest.cloud/login?type=example) ↗，即可开始体验

然后，您可以选择注册自己的帐户，以便更好地管理和保存书签

如果您希望将 InfoHarvest 部署到自己的服务器上，请参考下述的私有部署操作描述

## 本地开发

InfoHarvest 使用 [NestJS 10](https://nestjs.com) 和 [Next.js 14](https://nextjs.org)、[DaisyUI](https://daisyui.com) 开发，在设计上是单用户管理，数据库使用 MySQL 8。架构上采用前后端分离开发，web 目录属于前端 UI

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

6. 为了方便调试，提供了 ```src/resource/http_insomnia.json``` Insomnia 文件

   Insomnia 是一个开源、跨平台 API 客户端，对调试 Api 非常方便，你可以访问 [Github](https://github.com/Kong/insomnia) 下载

   下载后导入提供的 ```src/resource/http_insomnia.json``` 文件，就可以开始调试和开发 Infoharvest 服务了

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

   以上是在本地进行 InfoHarvest 的开发环境搭建和启动服务的步骤

## 私有部署

InfoHarvest 使用 Docker 部署，以减少繁杂的环境配置问题

### 拉取仓库

使用以下命令克隆仓库：

```bash
git clone https://github.com/dafengzhen/infoharvest.git
```

### 准备条件

确保你已安装 MySQL 8 数据库，并根据仓库目录下的 ```.env``` 配置文件提前新建数据库名称。例如，默认数据库名称为 ```infoHarvest```

### 构建后端服务

1. 更新 ```.env``` 配置文件，填写数据库等信息

2. 在当前目录下运行以下命令构建后端服务：

   ```bash
   docker build .
   ```

   默认情况下，后端服务将运行在 8080 端口

### 构建前端服务

1. 进入 ```web``` 文件夹：

   ```bash
   cd web
   ```

2. 更新 ```web/.env``` 配置文件，填写接口等信息

3. 在当前目录下运行以下命令构建前端服务：

   ```bash
   docker build .
   ```

   默认情况下，前端服务将运行在 3000 端口

### 运行服务

完成后端和前端的构建后，使用 ```docker run``` 命令运行服务即可

例如

```bash
docker run --restart=always -d -p 8080:8080 infoharvest
```

```bash
docker run --restart=always -d -p 3000:3000 infoharvest-web
```

## 相关反馈

如需反馈、问题或支持，请在 GitHub 上[打开一个问题](https://github.com/dafengzhen/infoharvest/issues) ↗，欢迎与我交流改进

## License

InfoHarvest 发布在 [MIT](https://opensource.org/licenses/MIT) 许可证下
