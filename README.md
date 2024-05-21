# Admin Dashboard 

Welcome to the Admin Dashboard for Smart Lock Management! This dashboard is designed to help administrators manage user, spaces, devices, and access control for unlocking locks.

Features

  1. User Management: Create, update, and delete user profiles.

  2. Space Management: Manage different spaces.
  
  3. Device Management: Add, update, and monitor devices.

  4. Access Control: Grant and revoke access permissions for users to unlock specific locks.

  5. Monitoring: Track device status and user access on a beautiful board.

## Installation

To install and run the Admin Dashboard, follow these steps:
```
git clone https://github.com/GeniusPRO271/admin-dashboard.git

cd admin-dashboard
```

Install dependencies:
```
pnpm install
```

Set up the environment variables:
Create a .env file in the root directory and add your configuration. Refer to the Configuration section for more details.

Run the application:

```
pnpm dev
```

## Usage

Once the application is running, you can access the dashboard at http://localhost:3000. Log in with your admin credentials to start managing users, spaces, devices, and access controls.

User Management

  - Add User: Navigate to the Users section and click "Create User". Fill in the required details and save.

  - Edit User: Click on a user role to edit his details.

Space Management

  - Add Space: Go to the Spaces section and click "Create Space". Provide the space details and save.

  - Edit Space: Click on a space to update its information.

  - Delete Space: Select a space and click "Delete".

Device Management

  - Sync Device: In the Devices section, click "Sync Device". Wait for the sync to finished and the system will be sync with your tuya account.

Access Control

  - Grant Access: Go to the Board section, choose a user, and select "Add" to add access to the space.

  - Revoke Access: o to the Board section, choose a user, and select "Remove" to remove access to the space.

# Configuration

The application requires certain environment variables to function correctly. Create a .env file in the root directory and add the following variables:

# Database configuration
- POSTGRES_DATABASE=
- POSTGRES_HOST=
- POSTGRES_PASSWORD=
- POSTGRES_PRISMA_URL=
- POSTGRES_URL=
- POSTGRES_URL_NON_POOLING=
- POSTGRES_URL_NO_SSL=
- POSTGRES_USER=

# Authentication configuration
AUTH_SECRET= " $ openssl rand -base64 32 "
