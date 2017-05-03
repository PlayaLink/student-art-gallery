var mongoose = require('mongoose');



var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    artpiece: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artpiece'
        },
        name: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
