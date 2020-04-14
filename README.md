# kpz-testownik-api

This project was created with Node.js v13.12.0.

## Download the necessary packages
`npm install`.
 
## Set private key as environment variable
`export testownik_jwtPrivateKey=secret`.

## Development server
Run `nodemon app.js` for a dev server. By default server is listening on port number saved in env variable `PORT`,
if not set server will be listening on port `8080`.

## Databbase
Project uses document-oriented database `mongoDB`. After start application conects to `mongodb://testwonik_db_host/testownik` database. Before start you need to specify env variable `testownik_db_host`.
