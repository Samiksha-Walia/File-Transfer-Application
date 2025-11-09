import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['text', 'file'],
        required: true
    },
    files: [{
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    // Ensure URL starts with /api/file/ or http(s)://hostname/api/file/
                    return /^(https?:\/\/[^\/]+)?\/api\/file\/[^\/]+$/.test(v);
                },
                message: props => `${props.value} is not a valid file URL! URLs must use the /api/file/ path.`
            }
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }]
}, { 
    timestamps: true 
})

const Message = mongoose.model('Message', MessageSchema);

export default Message;