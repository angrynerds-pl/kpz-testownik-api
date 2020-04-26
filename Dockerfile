FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV testownik_jwtPrivateKey=secret
ENV testownik_db_host=mongo
EXPOSE 8080

CMD [ "node", "app.js" ]