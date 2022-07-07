const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname : {
        type: String,
        default: "",
    },
    lastname : {
        type: String,
        default: "",
    },
    email : {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password : {
        type: String,

    },
    token : {
        type: String,
    }
})

module.exports = mongoose.model('user', userSchema);