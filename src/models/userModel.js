const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName:  {
        type: String,
        required: true,
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
},
{
    timestamps: true
});

const userModel = module.exports = mongoose.model('user', schema);