import { useContext, useRef, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./App";
import useId from "react-uuid";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState<null | string>(null);

  const roomId = useRef(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setRedirect(`/chat?room=${chatRoom}`);
  };
  if (redirect) return <Navigate to={redirect} replace={true} />;

  const joinInstantRoom = () => {
    const id = useId();
    setRedirect(`/chat?room=${id}`);
  };

  const joinRoomById = (e: any) => {
    e.preventDefault();
    const id = roomId.current!.value;
    setRedirect(`/chat?room=${id}`);
  };

  return (
    <div className="h-screen">
      <div className="h-screen flex flex-col">
        <div className="flex place-content-between mb-20 align-bottom m-12">
          <h1>Hi, {user?.displayName}</h1>
          <div className="flex flex-col">
            <p>{user?.email}</p>
            <button onClick={() => auth?.signOut()}>Logout</button>
          </div>
        </div>

        <div className="m-12">
          <h2 className="flex place-content-center text-xl">Join Chat Room</h2>
          <div className="flex place-content-between mt-20">
            <div className="self-end">
              <form onSubmit={handleSubmit}>
                <div>
                  <select
                    name="room"
                    onChange={(e) => setChatRoom(e.target.value)}
                  >
                    <option>Select room</option>
                    <option value="Room_01">Room 01</option>
                    <option value="Room_02">Room 02</option>
                    <option value="Room_03">Room 03</option>
                  </select>
                </div>
                <button className="h-10  bg-teal-600 p-2 ">Join Room</button>
              </form>
            </div>
            <button
              onClick={joinInstantRoom}
              className="self-end h-10 bg-teal-600 p-2 "
            >
              Join Instant Room
            </button>
            <form onSubmit={joinRoomById}>
              <div>
                <input placeholder="Insert room id" ref={roomId}></input>
              </div>
              <button className="h-10 bg-teal-600 p-2 ">Join room by id</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
