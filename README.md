# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

InfoHarvest is a bookmark management tool that enables users to collect and store interesting online content for easy access and management.

[简体中文](./README.zh.md)

## Differences

The difference between InfoHarvest and browser bookmarks is:

1. **Adding more extra information**: InfoHarvest allows users to add tags, descriptions, and other information to bookmarks.

2. **Non-nested hierarchical structure**: InfoHarvest avoids deep nesting of bookmarks, making them easier to find and manage.

3. **Synchronization and centralized management**: InfoHarvest provides a centralized platform for managing bookmarks, solving the problem of bookmarks being scattered across different browsers or accounts.

## Features

- **Private deployment**：InfoHarvest supports private deployment, giving users full control over their bookmark data.

- **Keyword search**：InfoHarvest offers powerful search capabilities, allowing users to quickly find bookmarks by keywords.

- **Multiple names and links**：InfoHarvest supports adding multiple names and links to a single bookmark, rather than just one title and URL.

- **Bookmark history**：InfoHarvest provides a feature to record the history of bookmarks, allowing users to review previously updated content.

## Quick Start

If you want to deploy InfoHarvest on your own server or experience local development, please read on.

## Local Development

InfoHarvest is developed using [NestJS 10](https://nestjs.com) and [Next.js 14](https://nextjs.org), [Shadcn-ui](https://ui.shadcn.com).

It is designed for single-user management and uses MySQL 8 as the database; it employs a front-end and back-end separation architecture.

The root directory belongs to the back-end service, built with Docker; the web directory belongs to the front-end UI, built with Static Exports.

Below are the steps for local development:

### Start the Back-end Service

1. First, clone the repository using the following command:

   ```bash
   git clone https://github.com/dafengzhen/infoharvest.git
   ```

2. Enter the cloned repository directory and modify the startup configuration (.env) file, mainly configuring the database connection information.

3. After configuring, prepare to run the service. Install dependencies using npm:

   ```bash
   npm install
   ```

4. Start the service; the default startup port is 8080:

   ```bash
   npm run dev
   ```

   Note: You can modify the startup port as needed by changing the port in the app.listen function in the src/main.ts file.

5. Other commands can be found in the package.json file.

### Start the Front-end Service

1. Enter the web folder:

   ```bash
   cd web
   ```

2. Install dependencies using npm:

   ```bash
   npm install
   ```

3. Start the service; the default startup port is 3000:

   ```bash
   npm run dev
   ```

   Note: You can modify the startup port as needed by checking the related configurations in the scripts section of the package.json file.

4. Other commands can be found in the package.json file.

   The above steps outline the setup and startup of the InfoHarvest development environment locally.

## Private Deployment

InfoHarvest back-end is deployed using Docker to minimize complex environment configuration issues.

InfoHarvest front-end uses static export, meaning it can be deployed and hosted on any web server that serves HTML/CSS/JS static assets.

### Clone the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/dafengzhen/infoharvest.git
```

### Preparation

Make sure you have installed the MySQL 8 database and created a database name in advance as specified in the ```.env``` configuration file in the repository directory. For example, the default database name is ```infoHarvest```.

### Build the Back-end Service

1. Update the ```.env``` configuration file with database and other information.

2. Build the back-end service in the current directory by running the following command:

   ```bash
   docker build -t infoharvest .
   ```

   By default, the back-end service will run on port 8080.

### Build the Front-end Service

1. Enter the `web` folder:

   ```bash
   cd web
   ```

2. Update the `web/.env` configuration file with API and other information.

3. Build the front-end service in the current directory:

   The build will output to the `out` directory.

   ```bash
   npm run build
   ```

### Run the Services

1. Run the Back-end Service

   After building the back-end, run the service using the docker run command.

   For example:

   ```bash
   docker run --restart=always -d -p 8080:8080 infoharvest
   ```

2. Run the Front-end Service

   After building the front-end, you can place the out directory on your web server.

   For example: Using Nginx as a proxy, here is an example configuration:

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

## Related Feedback

If you have any suggestions, please [open an issue](https://github.com/dafengzhen/infoharvest/issues) ↗ on GitHub. Feel free to communicate and improve.

## License

InfoHarvest is released under the [MIT](https://opensource.org/licenses/MIT) license.
