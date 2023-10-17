const {Server} = require("socket.io");
const Messages = require("../model/messege-schema");
const Group = require("../model/group-schema");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
    socket.on("send_message", async (data) => {
        socket.to(data.groupId?.trim()).emit("receive_message", data);
        const saveMsg = new Messages({
                name: data.name,
                text: data.text,
                group: data.groupId.trim(),
              });
              await saveMsg.save().then(async () => {
                await Group.findByIdAndUpdate(data.groupId, {
                  messageUpdate: new Date(),
                });
              });
      });
    // socket.on("messages", async (data) => {
    //   socket.emit("messages", data);

    //   const saveMsg = new Messages({
    //     name: data.name,
    //     text: data.text,
    //     group: data.groupId,
    //   });
    //   await saveMsg.save().then(async () => {
    //     await Group.findByIdAndUpdate(data.groupId, {
    //       messageUpdate: new Date(),
    //     });
    //   });
    // });

    // socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

    // socket.on("disconnect", () => {
    //   console.log("😪: A user disconnected");
    //   socket.disconnect();
    // });
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
  });
}

module.exports = initializeSocket;



// const socketIO = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });
//   let users = [];
  
//   socketIO.on("connection", (socket) => {
//     // console.log(`⚡: ${socket.id} user just connected!`);
//     //sends the message to all the users on the server
//     socket.on("messages", async (data) => {
//       socket.emit("messages", data);
//       //Adds the new user to the list of users
//       // users.push(data.name);
  
//       //Sends the list of users to the client
//       // socketIO.emit('newUserResponse', users);
  
//       const saveMsg = new Messages({
//         name: data.name,
//         text: data.text,
//         group: data.groupId,
//       });
//       await saveMsg
//         .save()
//         .then(async () => {
//           await Group.findByIdAndUpdate(data.groupId, {
//             messageUpdate: new Date(),
//           });
//         })
//     });
  
//     socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));
  
//     socket.on("disconnect", () => {
//       console.log("😪: A user disconnected");
//       //Updates the list of users when a user disconnects from the server
//       users = users.filter((user) => user.socketID !== socket.id);
//       //Sends the list of users to the client
//       socketIO.emit("newUserResponse", users);
//       socket.disconnect();
//     });
//   });