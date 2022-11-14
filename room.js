const { default: mongoose } = require("mongoose");



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RoomSchema = new Schema({
    user1: {
        type: ObjectId,
        required: true
    }, user2: {
        type: ObjectId,
        required: true
    },

    messages: [{
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
        }
    }]
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;