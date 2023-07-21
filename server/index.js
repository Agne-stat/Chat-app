const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());

const PORT = 3000;

const formatMessage = (username, text) => {
  return {
    username,
    text,
  };
};

const chatName = "Chat Bot: ";

const users = [];

// join user to chat
const userJoin = (id, userName, chatRoom) => {
  const user = { id, userName, chatRoom };

  console.log(users);
  users.push(user);
  return user;
};

// get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//user disconnects
const userDisconnect = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get room users
const getRoomUsers = (chatRoom) => {
  return users.filter((user) => user.chatRoom === chatRoom);
};

server.listen(PORT, () => console.log("Server running"));
const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  //user connect to the room
  socket.on("joinRoom", ({ userName, chatRoom }) => {
    const user = userJoin(socket.id, userName, chatRoom);

    socket.join(user.chatRoom);
    console.log(user);

    socket.emit("message", formatMessage(chatName, "Welcome"));

    //When user connects, does not show for THE user that is connecting
    socket.broadcast
      .to(user.chatRoom)
      .emit(
        "message",
        formatMessage(chatName, `${user.userName} has joined the chat!`)
      );

    //send users and room info
    io.to(user.chatRoom).emit("roomUsers", {
      room: user.chatRoom,
      users: getRoomUsers(user.chatRoom),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    socket.broadcast
      .to(user.chatRoom)
      .emit("message", formatMessage(`${user.userName}: `, message));
  });

  //When user disconnects
  socket.on("disconnect", () => {
    const user = userDisconnect(socket.id);

    if (user) {
      io.to(user.chatRoom).emit(
        "message",
        formatMessage(chatName, `${user.userName} has left the chat`)
      );

      //send users and room info
      io.to(user.chatRoom).emit("roomUsers", {
        room: user.chatRoom,
        users: getRoomUsers(user.chatRoom),
      });
    }
  });
});
