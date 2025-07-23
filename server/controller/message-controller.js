import Message from "../models/Message.js";
import Conversation from '../models/Conversation.js';
//import message from "../models/Message.js";


export const newMessage = async (request, response) => {
    const { text, type, file, senderId, receiverId, conversationId } = request.body;

    const messageData = {
        conversationId,
        senderId,
        receiverId,
        type,
        text
    };

    if (type === "file") {
        messageData.text = text;   // Save file info here
    } else {
        messageData.text = text;   // Save text message here
    }

    const newMessage = new Message(messageData);

    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(
            conversationId,
            { message: type === "text" ? text : "File" }  // Optional: show 'File' as preview
        );
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        console.error("Error in newMessage:", error);
        response.status(500).json(error.message);
    }
};


export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error.message);
    }

}
