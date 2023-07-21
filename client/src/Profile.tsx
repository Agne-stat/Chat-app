import { useContext, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./App";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState<null | string>(null);
  const [formIsVisible, setFormIsVisible] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setRedirect(`/chat?room=${chatRoom}`);
  };
  if (redirect) return <Navigate to={redirect} replace={true} />;

  console.log("User info-----", user);

  return (
    <div>
      <div>
        <h1>Hi, {user?.displayName}</h1>
        <p>{user?.email}</p>

        <button onClick={() => auth?.signOut()}>Logout</button>

        <div>
          <button onClick={() => setFormIsVisible(true)}>Select Room</button>
        </div>
        {formIsVisible && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Room</label>
              <select name="room" onChange={(e) => setChatRoom(e.target.value)}>
                <option>Select room</option>
                <option value="Room_01">Room 01</option>
                <option value="Room_02">Room 02</option>
                <option value="Room_03">Room 03</option>
              </select>
            </div>
            <button>Join Room</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
