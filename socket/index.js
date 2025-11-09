import {Server, Socket} from "socket.io";

const io= new Server(9000,{
    cors:{
        origin:'http://localhost:3000'
    }
})

let users=[];

const addUser = (userData, socketId) => {
    !users.some(user => user._id === userData._id) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user._id === userId);
}

io.on('connection',(socket)=>{
    console.log('user connected');

    //connect
   socket.on("addUsers",userData=> {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    socket.on('sendMessage', (data) => {
        console.log('Received message:', data); // Debug log
        const user = getUser(data.receiverId);
        if (user) {
            // Ensure files array is properly structured for file messages
            if (data.type === 'file' && Array.isArray(data.files)) {
                const sanitizedFiles = data.files.map(file => ({
                    url: file.url,
                    name: file.name,
                    type: file.type
                }));
                data.files = sanitizedFiles;
            }
            io.to(user.socketId).emit('getMessage', data);
            console.log('Message sent to user:', user.socketId);
        } else {
            console.log('User not found for receiverId:', data.receiverId);
        }
    });


    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})