# MTrace: Backend Application.

The back end application for the **Mtrace Expense Tracker** application.

## Tech Stack

- `Node.JS`
- `Express`
- `MongoDB`
- Language: `TypeScript`

## Local setup for development

### Prerequisites:

- `Node.JS` version 16.X or higher
- `Git` version 2.30.X or higher
- Preferred Code Editor or IDE _(Suggested: **Visual Studio Code**)_

### Set up:

- Clone the repository onto your local machine,
- In the root directory, run `npm install`
- Create a `.env` file in the root directory and add the following keys to it.

```
PORT=6400
DB_URI=
NODE_ENV=development
JWT_SECRET=
```

**Note:** _The values for `DB_URI` & `JWT_SECRET` variables will be provided separately._

- Run `npm run dev` to start the development server on `http://localhost:6400`

### Suggested Folder/File Structure:

```
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
    |       <router_name>.routes.ts
    \---types
            type_name.ts
```

### Suggested Extensions and Plugins :

_(If using Visual Studio Code)_

**Utilities:**

- GitLens
- Prettier
- Todo Tree
- ESLint

**Visual Enhancements:**

- Material Icon Theme _[for file/folder icons]_
- Carbon Product Icons _[for application icons]_
- One Dark Pro _[application color theme]_
