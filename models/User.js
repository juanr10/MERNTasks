const moongose = require('mongoose');

const UsersSchema = moongose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    register: {
        type: Date,
        default: Date.now()
    }
});

module.exports = moongose.model('User', UsersSchema);