const socketIo = require('socket.io');
let io;

// function init(httpServer) {
//     io = socketIo(httpServer, {
//         cors: {
//             origin: "*"
//         }
//     })
//     if(!io) {
//         throw new Error("Socket.io not initialized!");
//     }

//     return io;
// }

// module.exports = init;
module.exports = {
    init: (httpServer) => {
        io = socketIo(httpServer, {
            cors: {
                origin: "*"
            }
        })
        return io;
    },
    getIo: () => {
        if(!io) {
            throw new Error('Socket not initialized');
        }
        return io;
    }
};