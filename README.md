# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

InfoHarvest is a bookmark management tool that helps users collect and store interesting online content for easy access
and management.

InfoHarvest adopts a front-end and back-end separation architecture, supports single-user management, and uses MySQL 9
as the database.

- **Front-end**：Developed based on [Next.js 15](https://nextjs.org) (React framework)
- **Back-end**：[InfoHarvest API](https://github.com/dafengzhen/infoharvest-api) developed based
  on [NestJS 11](https://nestjs.com)

[简体中文](./README.zh.md)

## Features

- **Multiple names and links**: Support for adding multiple names and links to the same bookmark.
- **Rich bookmark information**: Allows adding tags, descriptions, etc., to bookmarks.
- **Keyword search**: Powerful search capabilities to quickly find bookmarks.
- **Bookmark history**: Records bookmark update history for easy tracking.
- **Private deployment**: Supports private deployment to ensure complete control over bookmark data.

## InfoHarvest Extension

Set InfoHarvest as your default new tab page for a seamless browsing experience.

- **GitHub Repository:** [infoharvest-extension](https://github.com/dafengzhen/infoharvest-extension)

## Quick Start

If you want to develop or deploy InfoHarvest locally, follow the steps below.

## Local Development

### Start the Back-end Service

1. Clone the repository

   ```bash
   git clone https://github.com/dafengzhen/infoharvest-api
   ```

2. Configure the ```.env``` file and set up database connection information

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the service (default port: 8080)

   ```bash
   npm run dev
   ```

5. For other commands, refer to the package.json file

### Start the Front-end Service

1. Clone the repository

   ```bash
   git clone https://github.com/dafengzhen/infoharvest
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the service (default port: 3000)

   ```bash
   npm run dev
   ```

4. For more commands, refer to the package.json file

## Private Deployment

InfoHarvest back-end is deployed using Docker to simplify environment configuration.

The front-end supports static export and can be deployed to any web server that supports static files.

### Preparation

Ensure MySQL 9 is installed and create a database according to the ```.env``` configuration file (default database name:
```infoharvest```).

### Build the Back-end Service

1. Update the ```.env``` configuration file and set up database information

2. Run the following command to build the back-end service

   ```bash
   docker build -t infoharvest .
   ```

   Default back-end service port: 8080.

### Build the Front-end Service

1. Update the .env configuration file and set up API interface information

2. Run the following command to build the front-end, output directory is ```out```

   ```bash
   npm run build
   ```

### Run the Services

1. Run the Back-end Service

   After building, use the ```docker run``` command to run the back-end:

   Example:

   ```bash
   docker run --restart=always -d -p 8080:8080 infoharvest
   ```

2. Run the Front-end Service

   After building, deploy the ```out``` directory to a web server.

   Example: Using Nginx as a proxy:

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

## Feedback

If you have any suggestions or [issues](https://github.com/dafengzhen/infoharvest/issues) ↗, please submit an Issue on
GitHub. Your feedback is welcome!

## License

InfoHarvest follows the [MIT](https://opensource.org/licenses/MIT) license.
