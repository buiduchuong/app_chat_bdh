const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const messageSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sentAt: {
        type: Number,
        // required: true
    },
})

const Message = mongoose.model('message', messageSchema);
module.exports = Message;