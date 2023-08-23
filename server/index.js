const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");
const key = require("./key.json");
const FieldValue = require("firebase-admin").firestore.FieldValue;
const dotenv = require("dotenv");

const app = express();
const server = http.createServer(app);
const PORT = 3000;
server.listen(PORT, () => console.log("Server running"));
app.use(cors());
dotenv.config();

const router = express.Router();
app.use("/", router);

// Use the JSON middleware to parse incoming JSON data
app.use(express.json());

// Define the route to store chat messages
router.post("/sendMessage", (req, res) => {
  const username = req.body.username;
  const message = req.body.message;

  if (!username || !message) {
    return res.status(400).json({ error: "Incomplete message data" });
  }

  const messagesRef = db.collection("rooms").doc(id);

  // Add the message to the Firestore collection
  messagesRef
    .add({
      username,
      message,
    })
    .then((docRef) => {
      // console.log("Message successfully written with ID: ", docRef.id);
      res.status(201).json({ message: "Message sent successfully" });
    })
    .catch((error) => {
      console.error("Error writing message: ", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});

///****** FIRESTORE ******///
// seting up firestore
admin.initializeApp({
  credential: admin.credential.cert(key),
});
const db = admin.firestore();

// set data to collection
const collection = db.collection("rooms");
const roomDocRef = collection.doc("room");

roomDocRef
  .set({
    message: "First message",
    user: "User1",
  })
  .then(() => {
    console.log("Document succesfully written!");
  })
  .catch((error) => {
    console.log("Error writting document: ", error);
  });

// get all collections data
const collectionRef = db.collection("rooms");

collectionRef
  .get()
  .then((collections) => {
    collections.forEach((collection) => {
      // console.log(collection.id, "=>", collection.data());
    });
  })
  .catch((error) => {
    console.log("Error writting document: ", error);
  });

// get one collection data
const documentRef = collection.doc("room");

documentRef
  .get()
  .then((document) => {
    // console.log("room data: ", document.data());
  })
  .catch((error) => {
    console.log("Error writting document: ", error);
  });

///****** SOCKETS ******///
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

const FE_URL = process.env.FE_URL;
const io = new socketio.Server(server, {
  // cors: {
  //   origin: FE_URL,
  // },
  cors: {
    origin: FE_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
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
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);

    // console.log("clients", io.clients);
    // // io.clients.forEach
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

    // //User is typing...
    // socket.on("is typing", (user) => {
    //   socket.emit("typing", { userName: user.userName });
    // });
  });

  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
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

// ///****** ENDPOINTS ******///

router.get("/rooms", async (req, res) => {
  // const collectionRef = db.collection("rooms");

  await db
    .collection("rooms")
    .get()
    .then((querySnapshot) => {
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push(doc.data());
      });
      res.json(rooms);
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.get("/rooms/:id", async (req, res) => {
  const id = req.params.id;
  const collectionRef = db.collection("rooms").doc(id.toLowerCase());

  await collectionRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Room does not exist!" });
      }
      res.json(doc.data());
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.get("/health", async (req, res) => {
  res.status(200).json("OK");
});

// router.put("/lastRooms/:id", async (req, res) => {
//   const id = req.params.id;
//   const collectionRef = db.collection("lastRooms");

//   await collectionRef
//     .set(
//       {
//         room: id,
//       },
//       { merge: true }
//     )
//     .then(() => {
//       console.log("Document succesfully written!");
//     })
//     .catch((error) => {
//       console.log("Error writting document: ", error);
//     });
// });
