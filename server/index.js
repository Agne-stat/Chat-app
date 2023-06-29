const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());

const PORT = 3000;

server.listen(PORT, () => console.log("Server running"));
const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log("Client connected");
  socket.emit("message", "Welcome");

  // //When user connects, does not show for THE user that is connecting
  socket.broadcast.emit("message", "A user has joined the chat!");

  // //When user disconnects
  socket.on("disconnect", () => {
    console.log("disconected");
    io.emit("message", "A user has left the chat");
  });

  //Listen for chatMessage
  socket.on("chatMessage", (message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});
