const express = require("express");
const router = express.Router();
const db = require("./firestore.js");

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

module.exports = router;
