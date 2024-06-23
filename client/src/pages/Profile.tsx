import { useContext } from "react";
import { AuthContext } from "../App";
import Button from "../components/Button";
import Text from "../components/Text";

export const Profile = () => {
  const { user, auth } = useContext(AuthContext);

  // const userFirstNameLetter = user?.displayName?.slice(0, 1).toUpperCase();

  return (
    <div className="h-screen bg-white bg-opacity-90 overflow-y-auto">
      <Text text={`Hi, ${user?.displayName}`} className="mb-2 w-full" />
      <Text text={user?.email} className="mb-2 w-full" />
      {user?.photoURL && (
        <img src={user.photoURL} className="rounded-t-full rounded-b-full" />
      )}
      <Button
        text="Logout"
        onClick={() => auth?.signOut()}
        className="w-auto bg-white text-primary px-0"
      />
    </div>
  );
};

// function uploadImage() {
//   const imageInput = document.getElementById("imageInput");

//   // Get the selected file
//   const file = imageInput.files[0];

//   if (file) {
//     // Create a reference for the image in Firebase Storage
//     const imageRef = storage.child("user_images/" + file.name);

//     // Upload the file to Firebase Storage
//     imageRef
//       .put(file)
//       .then((snapshot) => {
//         // Get the download URL of the uploaded image
//         snapshot.ref.getDownloadURL().then((downloadURL) => {
//           // Save the download URL to Firestore under the user's collection
//           const userCollection = db.collection("users").doc("USER_ID"); // Replace 'USER_ID' with the actual user ID
//           userCollection
//             .update({
//               image: downloadURL,
//             })
//             .then(() => {
//               console.log("Image uploaded and URL saved to Firestore.");
//             })
//             .catch((error) => {
//               console.error("Error saving image URL to Firestore:", error);
//             });
//         });
//       })
//       .catch((error) => {
//         console.error("Error uploading image to Firebase Storage:", error);
//       });
//   }
// }
