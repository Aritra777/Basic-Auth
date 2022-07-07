const mongoose = require('mongoose');
const {MONGODB_URL} = process.env;


exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        console.log('Connected to MongoDB')
    )
    .catch((errormsg) => {
        console.log(errormsg);
        process.exit(1);
    })
}