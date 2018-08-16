var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://yash:yash123@ds123372.mlab.com:23372/washcare', { useMongoClient: true });

// mongodb://yash:yash123@ds123372.mlab.com:23372/washcare
// mongodb://localhost:27017/elaundry
module.exports = {mongoose};
