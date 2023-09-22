<p align="center">
<h1>URL Shortener and Redirection APP</h1>
</p>

## Prerequisite
*  Node.js v16 or higher
*  NPM v8.19.4 or higher
*  mysql
*  Copy `.env.template` to `.env`

## Environment variables
Make sure update the DB configurations based on your mysql database
```
NODE_ENV=dev
PORT=8000

# Add a value (integer) to DELAY_MS to fake a delay based on ms
DELAY_MS=0

APP_URL=http://localhost:3000

# DB Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_TYPE=mysql
DATABASE_NAME=db_demo_atlantis
DATABASE_USERNAME=root
DATABASE_PASSWORD=

```

## Database
Import the database in your mysql using `db_demo_atlantis.sql` file under the project root directory. *Note: Consider adding migration technique to populate the database and tables.*

## How to run?
1. Make sure you have `.env` file in under your project root directory and **values** are updated accordingly
2. Run `npm i` to install all the dependencies
3. Make sure the database is online and accessible
4. Run `npm run start:dev` to run the application. The default port used is `PORT=8000`
   * Note: `PORT=8000 default app` | `PORT=8001 app1` | `PORT=8002 app2` | `PORT=8003 app3`
   * To run another concurrent app, run `PORT=8001 npm run start:dev` and so on...
