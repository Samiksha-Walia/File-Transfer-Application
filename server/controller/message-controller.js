import Message from "../models/Message.js";
import Conversation from '../models/Conversation.js';
//import message from "../models/Message.js";


export const newMessage = async (request, response) => {
    try {
        console.log('Received message data:', request.body); // Debug log

        const { text, type, files, senderId, receiverId, conversationId } = request.body;
        
        if (!conversationId || !senderId || !receiverId) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        // Validate files array for file type messages
        if (type === 'file') {
            if (!Array.isArray(files) || files.length === 0) {
                return response.status(400).json({ error: 'Files array is required for file type messages' });
            }

            // Validate each file object
            for (const file of files) {
                if (!file.url || !file.name || !file.type) {
                    return response.status(400).json({ 
                        error: 'Invalid file object structure',
                        required: { url: 'string', name: 'string', type: 'string' },
                        received: file
                    });
                }
            }
        }

        // Ensure file URLs are using the correct format
        let processedFiles = files;
        if (type === 'file' && Array.isArray(files)) {
            processedFiles = files.map(file => {
                let url = file.url;
                const filename = url.split('/').pop();
                
                // Always use /api/file/ format for consistency
                url = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/file/${filename}`;
                
                console.log('Processing file URL:', {
                    original: file.url,
                    processed: url,
                    filename
                });
                
                return { ...file, url };
            });
        }

        const messageData = {
            conversationId,
            senderId,
            receiverId,
            type,
            text: text || '',
            files: type === 'file' ? processedFiles : []
        };

        console.log('Creating message with data:', messageData); // Debug log

        const newMessage = new Message(messageData);
        await newMessage.save();
        
        // Update conversation with preview
        const preview = type === 'text' 
            ? text 
            : `File: ${files[0].name}${files.length > 1 ? ` (+${files.length - 1} more)` : ''}`;
            
        await Conversation.findByIdAndUpdate(
            conversationId,
            { message: preview }
        );
        
        response.status(200).json(newMessage);
    } catch (error) {
        console.error("Error in newMessage:", error);
        console.error("Error details:", error.errors); // Log validation errors
        response.status(500).json({ 
            error: 'Failed to create message',
            details: error.message,
            validationErrors: error.errors
        });
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
