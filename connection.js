const config = require('config');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://'+config.get('db_host')+':27017/testownik', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
}

