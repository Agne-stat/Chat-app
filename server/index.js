const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");
const key = require("./key.json");
const FieldValue = require("firebase-admin").firestore.FieldValue;
const dotenv = require("dotenv");
const { instrument } = require("@socket.io/admin-ui");
const {
  userJoin,
  getCurrentUser,
  userDisconnect,
  getRoomUsers,
} = require("./utils");
const router = require("./router.js");
const db = require("./firestore.js");

const app = express();
const server = http.createServer(app);
const PORT = 3000;
server.listen(PORT, () => console.log("Server running"));
app.use(cors());
dotenv.config();

// const router = express.Router();
app.use("/", router);
// Use the JSON middleware to parse incoming JSON data
app.use(express.json());

///****** SOCKETS ******///
const formatMessage = (username, text) => {
  return {
    username,
    text,
  };
};

const chatName = "Chat Bot: ";

const FE_URL = process.env.FE_URL;
const io = new socketio.Server(server, {
  cors: {
    origin: [FE_URL, "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  // mode: "development",
});

io.on("connection", (socket) => {
  //user connect to the room
  socket.on("joinRoom", ({ userName, chatRoom }) => {
    const user = userJoin(socket.id, userName, chatRoom);

    socket.join(user.chatRoom);

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
  socket.on("chatMessage", (message, callback) => {
    callback("Error from BE");
    const user = getCurrentUser(socket.id);

    if (!user) {
      return;
    }
    socket.broadcast
      .to(user.chatRoom)
      .emit("message", formatMessage(`${user.userName}: `, message));

    const roomRef = db.collection("rooms").doc(user.chatRoom);

    roomRef
      .set(
        {
          messages: FieldValue.arrayUnion({
            username: user.userName,
            message: message,
          }),
        },
        { merge: true }
      )
      .then(() => {
        console.log("Document succesfully written!");
      })
      .catch((error) => {
        console.log("Error writting document: ", error);
      });
  });

  socket.on("typing", (chatRoom, userName) => {
    socket.broadcast.to(chatRoom).emit("typing", userName);
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
