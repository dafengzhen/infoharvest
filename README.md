# InfoHarvest

[![LICENSE](https://img.shields.io/github/license/dafengzhen/infoharvest)](https://github.com/dafengzhen/infoharvest/blob/main/LICENSE)

Infoharvest is a bookmark management tool that enables users to collect and store interesting online content for easy access and management.

[简体中文](./README.zh.md)

## Introduction

Similar to browser bookmarks, InfoHarvest aims to enhance the bookmarking experience by adding additional information such as descriptions, while still maintaining simplicity and avoiding excessive clutter. Unlike note-taking or blogging platforms, InfoHarvest focuses solely on the collection and
organization of information.

Collecting valuable information can be challenging, especially when it comes to "harvesting" content that is personally relevant. With InfoHarvest, you can effectively maintain and manage your collection of useful resources.

## Key Features

InfoHarvest addresses the following common scenarios:

1. **Adding Descriptions**: Unlike traditional bookmarks that only provide a title and URL, InfoHarvest allows users to add descriptions to their bookmarks. This feature enables users to provide context and remember why they bookmarked a particular resource.

2. **Controlled Hierarchy**: InfoHarvest avoids deep nesting of bookmarks, which can make them difficult to find and manage. By controlling the hierarchy, users can easily navigate and locate their bookmarks without getting lost in complex folder structures.

3. **Synchronization and Centralization**: InfoHarvest provides a centralized platform for bookmark management, overcoming the challenge of scattered bookmarks across different browsers or accounts. With InfoHarvest, you can synchronize and access your bookmarks from multiple devices and browsers.

## Features

- **Private Deployment**: InfoHarvest supports self-hosted deployment, allowing users to maintain full control over their bookmark data and ensuring privacy.

- **Keyword Search**: InfoHarvest offers a robust search functionality, empowering users to quickly find specific bookmarks using keywords or tags.

- **Enhanced Bookmark Information**: Apart from titles and URLs, InfoHarvest allows users to enrich their bookmarks with additional information such as descriptions, categories, and tags. This feature enables better organization and context for each bookmark.

- **Bookmark History**: InfoHarvest keeps track of bookmark history, allowing users to revisit previously accessed resources and keep a record of their browsing activities.

- **Import and Export**: InfoHarvest supports the import and export of bookmarks, making it easy to migrate from other bookmarking tools or share bookmarks with others.

- **Browser Bookmark Parsing**: InfoHarvest provides the ability to parse browser bookmarks, allowing users to conveniently import their existing bookmarks from supported browsers.

## Quick Start

Welcome to InfoHarvest, a bookmark management tool. InfoHarvest offers a free cloud environment where you can try out the online version of the tool.

### Quick Experience

If you prefer to deploy the Bookmark Management Tool on your own server, please refer to the instructions for private deployment below.

## Local Development

InfoHarvest is developed using [NestJS 10](https://nestjs.com) and [Next.js 14](https://nextjs.org)、[DaisyUI](https://daisyui.com). It is designed for single-user management without the need for an administrative backend. The database used is MySQL 8. The architecture follows a frontend-backend
separation, with the "web" directory belonging to the frontend UI.

Below are the steps to set up and run InfoHarvest for local development:

### Start Backend Service

1. First, clone this repository by running the following command:

   ```bash
   git clone https://github.com/dafengzhen/infoharvest.git
   ```

2. Navigate to the cloned repository directory and modify the configuration file (.env) for the backend service. This file primarily includes the database configuration.

3. Once the configuration is completed, prepare to run the backend service. Install the dependencies using npm:

   ```bash
   npm install
   ```

4. Start the service. By default, it runs on port 8080:

   ```bash
   npm run dev
   ```

   Note: You can also modify the app.listen function in the src/main.ts file to change the port.

5. Refer to the package.json file for other available commands.

6. For easier debugging, the Insomnia file ```src/resource/http_insomnia.json``` is provided.

   Insomnia is an open-source, cross-platform API client that is very convenient for API debugging. You can download it from [Github](https://github.com/Kong/insomnia).

   After downloading, import the provided ```src/resource/http_insomnia.json``` file to start debugging and developing the Infoharvest service.

### Start Frontend Service

1. Go to the "web" directory:

   ```bash
   cd web
   ```

2. Install the dependencies using npm:

   ```bash
   npm install
   ```

3. Start the frontend service. By default, it runs on port 3000:

   ```bash
   npm run dev
   ```

   Note: You can modify the port by editing the relevant configuration in the src/main.ts file under the "app.listen" section.

4. Refer to the package.json file for other available commands.

   These are the steps to set up and run InfoHarvest for local development.

## Private Deployment

InfoHarvest utilizes Docker for deployment, reducing the complexity of environment setup.

### Clone Repository

Clone the repository using the following command:

```shell
git clone https://github.com/dafengzhen/infoharvest.git
```

### Prerequisites

Make sure you have MySQL 8 installed and create a database based on the ```.env``` configuration file in the repository directory. For example, the default database name is ```infoHarvest```.

### Build Backend Service

1. Update the ```.env``` configuration file with the necessary database information.

2. Run the following command in the current directory to build the backend service:

   ```shell
   docker build infoharvest .
   ```

   By default, the backend service will run on port 8080.

### Build Frontend Service

1. Navigate to the ```web``` folder:

   ```shell
   cd web
   ```

2. Update the ```web/.env``` configuration file with the required API information.

3. Run the following command in the current directory to build the frontend service:

   ```shell
   docker build infoharvest-web .
   ```

   By default, the frontend service will run on port 3000.

### Run the Services

Once the backend and frontend services are built, you can run the services using the ```docker run``` command.

For example

```bash
docker run --restart=always -d -p 8080:8080 infoharvest
```

```bash
docker run --restart=always -d -p 3000:3000 infoharvest-web
```

## Feedback

For feedback, questions, or support, please [open an issue](https://github.com/dafengzhen/infoharvest/issues) ↗ on GitHub.

## License

InfoHarvest is released under the [MIT License](https://opensource.org/licenses/MIT)
