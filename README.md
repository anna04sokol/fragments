# Fragments

Backend of my fragments service.

## List of Useful Commands

### Lab 1

- `npm init -y`-> creates package.json file
- `npm install`-> installs everything listened in package.json
- `code .` -> open a project in VSCode
- `npm install --save-dev --save-exact prettier`-> prettier installation

* `npm init @eslint/config@latest` -> eslint setup
* `npm audit fix` -> fixes if I have vulnerabilities, gets newer dependencies
* `npm install --save pino pino-pretty pino-http` -> pino setup
* `npm install --save express cors helmet` -> express app setup
* `npm install --save stoppable` -> install the stoppable package
* `npm run lint` -> running eslint to make sure there are no errors
* `node src/server.js ` -> starts the server
* `curl localhost:8080` -> sends request to the server
* `curl -s localhost:8080 | jq` -> pretty-print the JSON
* `curl -i localhost:8080` -> shows body and header HTTP
* `npm start` -> run server normally
* `npm run dev` -> development
* `npm run debug` -> development + debugging

## Notes

- Make sure that the versions are updated
- Do not copy/paste the code, understand it first
- avoid using git add . ; explicitly specify which files to add
- The .mjs extension vs .js indicates to node.js that this is an ES6 Module
- Using a specific filename like .env.debug instead of the generic .env makes it clear this file contains debug/development-specific configuration
- Always check author and githubUrl in src/app.js to match your GitHub account
