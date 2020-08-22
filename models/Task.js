const moongose = require('mongoose');

const TaskSchema = moongose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now()
    },
    project: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'Project'
    }
});

module.exports = moongose.model('Task', TaskSchema);