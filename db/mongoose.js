var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/elaundry', { useMongoClient: true });

mongoose.connect('mongodb://yash:yash123@ds123372.mlab.com:23372/washcare', {
    useMongoClient: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// mongodb://yash:yash123@ds123372.mlab.com:23372/washcare
// mongodb://localhost:27017/elaundry
module.exports = { mongoose };
