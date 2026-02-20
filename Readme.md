# MTrace: Backend Application

Backend API server for **MTrace Expense Tracker** application - A comprehensive expense tracking and budgeting solution.

## Tech Stack

### Core Technologies

- **Runtime:** Node.js (v18+ / v20 recommended)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM

### Key Dependencies

- **Authentication:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Session Management:** Cookie-based authentication (cookie-parser)
- **CORS:** Configured for multiple origins
- **Logging:** Morgan for HTTP request logging
- **Excel Export:** ExcelJS for generating expense reports
- **GitHub Integration:** Octokit for system information features
- **Utilities:** Lodash, Day.js for date manipulation

### Development Tools

- **Build:** TypeScript Compiler (tsc)
- **Dev Server:** Nodemon with ts-node
- **API Documentation:** Insomnia/OpenAPI specs (see `docs/`)

## Frontend Repository

The corresponding frontend built with React can be found at [expensary](https://github.com/amittras-pal/expensary).

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd money-trace

# Install dependencies
npm install

# Create and configure .env file (see Environment Variables section)
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The server will start at `http://localhost:6400`

## Local Setup for Development

### Prerequisites

- **Node.js:** v18.x or higher (v20.x recommended)
- **Git:** v2.30.x or higher
- **MongoDB:** Local instance or MongoDB Atlas account
- **Code Editor:** Visual Studio Code (recommended)

## Project Structure

```
money-trace/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Database and configuration setup
│   │   └── mongoose.ts
│   ├── constants/            # Application constants and enums
│   ├── controllers/          # Request handlers and business logic
│   ├── middlewares/          # Express middlewares (auth, logging, error handling)
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # API route definitions
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions and helpers
│   ├── env/                  # Environment configuration
│   │   └── config.ts
│   ├── data/                 # Static data (e.g., category seeds)
│   └── assets/               # Static assets (fonts, etc.)
├── docs/                     # API documentation
│   └── API Docs [Insomnia v5].yaml
├── .env                      # Environment variables (create this)
├── dev.ts                    # Development server entry
├── prod.js                   # Production server entry
├── Dockerfile                # Docker configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

### Key Directories

- **controllers/**: Handle HTTP requests and responses, coordinate business logic
- **models/**: Define MongoDB schemas using Mongoose ODM
- **routes/**: Define API endpoints and attach controllers
- **middlewares/**: Authentication, logging, error handling
- **types/**: TypeScript interfaces and type definitions
- **utils/**: Reusable utility functions (aggregators, Excel generators, etc.)JWT_SECRET=your_jwt_secret_key_here
  TOKEN_TTL=7d
  SYS_ADM_SECRET=your_admin_secret_key

  # CORS Origins (comma-separated for multiple origins)

  ORIGINS=http://localhost:5173

  # GitHub Integration (Optional - for system info features)

  OCTO_PK=your_github_private_key
  OCTO_APP_ID=your_github_app_id
  OCTO_INST_ID=your_github_installation_id
  GIT_REPO_OWNER=your_github_username
  GIT_REPO_NAME=your_repository_name

  # Backup Configuration (Optional)

  BACKUP_CLUSTER_URL=mongodb://backup-server-url

  ```

  **Important Notes:**
  - **Required variables:** `DB_URI`, `JWT_SECRET` must be set
  - **JWT_SECRET:** Generate a secure random string (recommended: 64+ characters)
  - **TOKEN_TTL:** JWT token expiration time (e.g., '7d', '24h', '30d')
  - **SYS_ADM_SECRET:** Secret key for administrative operations
  - **GitHub variables:** Only needed if using GitHub integration features
  - **BACKUP_CLUSTER_URL:** Only needed for database backup features
  ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:6400`

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run probe` - Start probe server (health check endpoint)
- `npm start` - Start production server
- `npm run render-postbuild` - Build script for deployment (installs deps + builds)

### Testing the API

Once the server is running, you can test the wake endpoint:

```bash
curl http://localhost:6400/api/wake
# Response: {"message": "Server Ready!"}
```

For complete API documentation, import the Insomnia spec from `docs/API Docs [Insomnia v5].yaml` into [Insomnia API Client](https://insomnia.rest/download).

### Suggested Folder/File Structure:

````
root
|   .env
|   .gitignore
|   nodemon.json
|   package-lock.json
|   package.json
|   Readme.md
|   tsconfig.json
+---.vscode
|       settings.json
\---src
    |   index.ts
    +---config
    |       db.ts
    +---constants
    |       <type>.constants.ts
    +---controllers
    |       <controller_name>.controller.ts
    +---env
    |       config.ts
    +---middlewares
    |       <middleware_name>.middleware.ts
    +---models
    |       <model_name>.model.ts
    +---routes
   Recommended VSCode Extensions

### Essential for Development

| Extension | Publisher | Description | Marketplace Link |
|-----------|-----------|-------------|------------------|
| **ESLint** | Microsoft | JavaScript/TypeScript linter | [View Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |
| **Prettier** | Prettier | Code formatter | [View Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) |
| **GitLens** | GitKraken | Enhanced Git capabilities | [View Extension](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) |
| **Thunder Client** | Thunder Client | API testing (Postman alternative) | [View Extension](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) |
| **Todo Tree** | Gruntfuggly | Highlight TODO/FIXME comments | [View Extension](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) |
| **Error Lens** | Alexander | Inline error/warning display | [View Extension](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) |

### Visual Enhancements (Optional)

| Extension | Publisher | Description | Marketplace Link |
|-----------|-----------|-------------|------------------|
| **Material Icon Theme** | Philipp Kief | File/folder icons | [View Extension](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) |
| **Carbon Product Icons** | Anthony Fu | Application icons | [View Extension](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon) |
| **One Dark Pro** | binaryify | Popular dark theme | [View Extension](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) |

### Recommended VSCode Settings

Add these to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
````

## API Endpoints

The application exposes the following API routes:

- `/api/wake` - Health check endpoint
- `/api/user` - User authentication and profile management
- `/api/expenses` - Expense CRUD operations
- `/api/budget` - Budget management
- `/api/expense-plan` - Expense planning features
- `/api/categories` - Category management
- `/api/export` - Excel export functionality
- `/api/sys-info` - System information (GitHub integration)
- `/api/statistics` - Expense statistics and analytics

For detailed API documentation, refer to `docs/API Docs [Insomnia v5].yaml`

## Docker Support

Build and run the application using Docker:

```bash
# Build the image
docker build -t mtrace-backend .

# Run the container
docker run -p 6400:3000 \
  -e DB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  mtrace-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Common Issues

### MongoDB Connection Issues

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Verify the `DB_URI` format in `.env`

### Port Already in Use

If port 6400 is already in use, change the `PORT` variable in `.env`

### JWT Token Issues

- Ensure `JWT_SECRET` is set and is a strong random string
- Check `TOKEN_TTL` format (e.g., '7d', '24h', '30d')

## License

[Add your license information here]
**Visual Enhancements:**

- Material Icon Theme _[for file/folder icons]_
- Carbon Product Icons _[for application icons]_
- One Dark Pro _[application color theme]_
