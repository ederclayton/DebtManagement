const mongoose = require('mongoose');
const { mongodbUri } = require('./config');

mongoose.connect(mongodbUri, {
        useUnifiedTopology: true, 
        useNewUrlParser: true ,
        useFindAndModify: false
    })
    .catch(e => {
        const msg = 'ERROR! Could not connect with MongoDB!';
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
    });