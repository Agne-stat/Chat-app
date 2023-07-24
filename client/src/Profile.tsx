import { useContext, useRef, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./App";
import useId from "react-uuid";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState<null | string>(null);
  const [formIsVisible, setFormIsVisible] = useState(false);

  const roomId = useRef(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setRedirect(`/chat?room=${chatRoom}`);
  };
  if (redirect) return <Navigate to={redirect} replace={true} />;

  const joinInstantRoom = () => {
    const id = useId();
    console.log(id);
    setRedirect(`/chat?room=${id}`);
  };

  const joinRoomById = (e: any) => {
    e.preventDefault();
    const id = roomId.current!.value;
    setRedirect(`/chat?room=${id}`);
  };

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
              <label>Select room</label>
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

        <button onClick={joinInstantRoom}>Join Instant Room</button>
        <form onSubmit={joinRoomById}>
          <div>
            <input placeholder="Insert room id" ref={roomId}></input>
          </div>
          <button>Join room by id</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
