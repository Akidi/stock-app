# Project Overview

A SvelteKit application with a PostgreSQL database, powered by Drizzle ORM for migrations and queries. Deployed using Docker for both development and production environments, with automated setup via a PowerShell script.

## Setup for Development

### Prerequisites

- Docker and Docker Compose
- Git
- (Optional) Node.js v20 and pnpm for local dev outside Docker

### Steps

1. **Clone the Repository**

   ```sh
   git clone https://github.com/akidi/app-boilerplate
   cd app-boilerplate
   ```

2. **Run Setup Script**
   - On Windows, execute the PowerShell script to configure environment files and database users:

     ```powershell
     ./setup.ps1
     ```

   - This copies example files, generates random passwords (8-16 chars for dev), updates `init.dev.sql` and `.env` files, and displays the passwords.

3. **Start Development Environment**

   ```sh
   docker-compose up --build -d
   ```

   - Access the app at `http://localhost:5173`.
   - Runs migrations and starts the Vite dev server.

## Setup for Production

1. **Clone the Repository** (if not already done)

   ```sh
   git clone https://github.com/akidi/app-boilerplate
   cd app-boilerplate
   ```

2. **Run Setup Script**
   - Execute the same script as dev:

     ```powershell
     . ./setup.ps1
     ```

   - Generates 32-char passwords for prod, updates `init.prod.sql` and `.env.prod`, and shows them.

3. **Start Production Environment**

   ```sh
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

   - Access the app at `http://localhost:3000`.
   - Runs migrations via a separate container, then starts the built SvelteKit app with `@sveltejs/adapter-node`.

## Database

- **Engine**: PostgreSQL 17
- **Users**:
  - `app_admin`: Admin role with full privileges.
  - `app_api`: Write operations.
  - `app_readonly`: Read-only access.
  - Others: `app_developer`, `app_backup`, `app_auditor` (role-specific).
- **Schema**: Managed in `app/src/lib/db/schema.ts`, with initial setup in `db/init.dev.sql` (dev) and `db/init.prod.sql` (prod).

## Migrations

- **Tool**: Drizzle ORM
- **Process**:
  - Dev: Generate migrations locally with `pnpm drizzle-kit generate:pg` (if needed), stored in `app/drizzle/`.
  - Prod: Applied via a dedicated `migrate` container using pre-generated SQL files from `app/drizzle/`.
- **Setup**: Automated by `setup.ps1`, which aligns passwords across SQL and `.env` files.

## Docker

- **Development**:
  - `docker-compose.yml`: Runs `app` (port `5173`), `db`, and migrations.
  - Command: `pnpm db:migrate && pnpm dev --host`.
- **Production**:
  - `docker-compose.prod.yml`: Runs `app` (port `3000`), `db`, and a separate `migrate` service.
  - Command: `node build/index.js` (after migrations).
- **Files**:
  - `app/Dockerfile`: Multi-stage build for `development` and `production`.
  - `app/Dockerfile.migrate`: Dedicated migration image using `psql`.

## Notes

- **Passwords**: Dev uses shorter passwords for convenience; prod uses 32-char secure passwords.
- **Verify**: Check logs with `docker-compose logs` (dev) or `docker-compose -f docker-compose.prod.yml logs` (prod).
- **Shutdown**: `docker-compose down` (dev) or `docker-compose -f docker-compose.prod.yml down` (prod).
