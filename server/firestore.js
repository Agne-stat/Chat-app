const admin = require("firebase-admin");
const key = require("./key.json");

// seting up firestore
admin.initializeApp({
  credential: admin.credential.cert(key),
});
const db = admin.firestore();

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

module.exports = db;
