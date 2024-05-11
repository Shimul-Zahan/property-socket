const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        methods: ['get', 'post']
    },
});

let activeUsers = [];

const addUser = (userId, socketId) => {
    console.log(activeUsers);
    const checkUser = activeUsers.some(user => user.userId === userId);
    console.log(checkUser, 'checkUser');
    if (!checkUser) {
        console.log(userId, socketId);
        activeUsers.push({ userId, socketId })
        console.log(activeUsers);
    }
}

const userRemove = (socketId) => {
    activeUsers = activeUsers.filter(user => user.socketId !== socketId);
}


io.on("connection", (socket) => {
    socket.on('addActiveUser', ((userId, userName) => {
        console.log(userId, userName);
        addUser(userId, socket.id);
        io.emit('getActiveUser', activeUsers);
    }))
    socket.on('send-message', (data) => {
        // sendMessageToReciver(data)
        console.log(data);
        io.emit('receive-message', data);
    })
    socket.on('disconnect', () => {
        userRemove(socket.id)
        io.emit('getActiveUser', activeUsers);
    })
});