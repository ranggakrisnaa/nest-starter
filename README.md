# NestJS Starter Pack

This is a basic starter project for building APIs with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

## Features

-   **NestJS Framework**: Scalable, efficient, and TypeScript-ready.
-   **Authentication**: Basic setup for user authentication (JWT-based).
-   **API Documentation**: Swagger UI integration for easy API documentation.
-   **Database**: Prisma ORM integrated for database management.
-   **Validation**: Class-validator integrated for request validation.
-   **Error Handling**: Global error handling using interceptors.
-   **Testing**: Setup for unit and end-to-end (e2e) testing.
-   **Environment Configuration**: Manage configurations via `.env` files.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/) (v18-lts)
-   [pnpm](https://pnpm.io/id/) (v9)
-   [PostgreSQL](https://www.postgresql.org/) or any other SQL database (optional, based on the database you're using)
-   [Prisma](https://www.prisma.io/) for database management

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ranggakrisnaa/nest-starter.git
    cd nest-starter
    ```
    
2. Install the dependencies:

   Install all required packages:
    ```bash
    pnpm install
    ```
    
3. Set up environment variables:
   
   Create a .env file in the root directory and add the following environment variables:
    ```bash
    DB_USER=XXXX
    DB_PASSWORD=XXXX
    DB_HOST=XXXX
    DB_PORT=XXXX
    DB_NAME=XXXX
    ```
    
4. Generate Prisma client:

    After setting up the environment variables, generate the Prisma client:
    ```bash
    npx prisma generate
    ```

5. Add new schema prisma:

   Modify your schema prisma and add model to create new migration.
    
6. Run database migrations:

   Apply the migrations to your database:
          ```bash
    pnpm migrate
    ```

7. Start the application:

   To start the application in development mode, use:
       ```bash
    pnpm start:dev
    ```
    By default, the API will be available at http://localhost:3000.
