import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import Profile from "./Profile";

const firebaseConfig = {
  apiKey: "AIzaSyA3r5a1xAkywQbpxxetTZwmBU8P7ojAj5g",
  authDomain: "chat-app-d6c29.firebaseapp.com",
  databaseURL:
    "https://chat-app-d6c29-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-app-d6c29",
  storageBucket: "chat-app-d6c29.appspot.com",
  messagingSenderId: "715940747828",
  appId: "1:715940747828:web:0214531c70491e924e4861",
};

const authUiConfig: firebaseui.auth.Config = {
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  signInFlow: "popup",
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export const AuthContext = React.createContext<{
  user: User | null;
  auth: Auth | null;
}>({
  user: null,
  auth: null,
});

const App = () => {
  const [user, setUser] = useState<null | User>(null);

  const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  const auth = getAuth(app);
  // const defaultStorage = getStorage();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  if (!user) {
    return <StyledFirebaseAuth firebaseAuth={auth} uiConfig={authUiConfig} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
