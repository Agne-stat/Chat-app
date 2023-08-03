const express = require("express");
const app = express();
const router = express.Router();

// Use the JSON middleware to parse incoming JSON data
app.use(express.json());

// Define the route to store chat messages
router.post("/sendMessage", (req, res) => {
  const { sender, message, timestamp } = req.body;

  if (!sender || !message || !timestamp) {
    return res.status(400).json({ error: "Incomplete message data" });
  }

  const messagesRef = db.collection("messages");

  // Add the message to the Firestore collection
  messagesRef
    .add({
      sender,
      message,
      timestamp,
    })
    .then((docRef) => {
      console.log("Message successfully written with ID: ", docRef.id);
      res.status(201).json({ message: "Message sent successfully" });
    })
    .catch((error) => {
      console.error("Error writing message: ", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});

// Use the router for the '/api' path
app.use("/api", router);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
