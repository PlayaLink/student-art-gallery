var mongoose = require('mongoose');

var artpieceSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Artpiece", artpieceSchema);
