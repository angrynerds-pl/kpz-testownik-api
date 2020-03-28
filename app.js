const home = require('./routes/home');
const express = require('express');
const app = express();

app.use('/', home)

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});