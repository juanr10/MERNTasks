const moongose = require('mongoose');

const ProjectSchema = moongose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created:{
        type: Date,
        default: Date.now()
    }
});

module.exports = moongose.model('Project', ProjectSchema);