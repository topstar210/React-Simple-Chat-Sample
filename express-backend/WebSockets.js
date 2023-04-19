let users = [];
let messages = [];
let _this = null;

class WebSockets {
    constructor() {
        _this = this;
    }

    connection(client) {
        let  currentRoomId;

        client.on("disconnect", () => {
            users = users.filter((user) => user.socketId !== client.id);
            global.io.to(currentRoomId).emit('current-users', { users });
        });

        client.on("join-group", (room, username) => {
            users = users.filter((user) => user.socketId !== client.id);
            users.push({
                socketId: client.id,
                username,
                roomId: room
            });
            client.join(room);
            currentRoomId = room;

            const roomUsers = users.filter((user) => user.roomId === room);
            messages = [...messages, {
                username: username,
                message: "joined the game"
            }];
            global.io.to(room).emit('current-users', { users: roomUsers, messages });
            console.log(username, " joined the game");
        });

        client.on("send-message", (message, sender) => {
            messages = [...messages, {
                username: sender,
                message: message
            }];
            global.io.to(currentRoomId).emit('get-messages', messages)
        })
    }
}

export default new WebSockets();