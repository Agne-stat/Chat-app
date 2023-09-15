import { useContext, useRef, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./App";
import useId from "react-uuid";
// import axios from "axios";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState<null | string>(null);

  const roomId = useRef<HTMLInputElement>(null);

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
    <div className="h-screen bg-white bg-opacity-90">
      <div className="h-screen flex flex-col w-6/12 m-auto ">
        <div className="flex place-content-between mb-20 align-bottom m-12">
          <div className="flex flex-col text-text w-72 m-auto items-end">
            <h1 className="text-text">Hi, {user?.displayName}</h1>
            <button onClick={() => auth?.signOut()}>Logout</button>
          </div>
        </div>

        <div className="m-12">
          <>
            <h2 className="flex place-content-center text-3xl text-background">
              Join Chat Room
            </h2>
            <div className="flex flex-col mt-20 w-72 m-auto ">
              <div className="self-end w-full mb-5 rounded shadow-md">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="w-full">
                    <select
                      name="room"
                      onChange={(e) => setChatRoom(e.target.value)}
                      className="w-full"
                    >
                      <option>Select room</option>
                      <option value="room_01">Room 01</option>
                      <option value="room_02">Room 02</option>
                      <option value="room_03">Room 03</option>
                    </select>
                  </div>
                  <button className="h-10  bg-primary p-2 w-full">
                    Join Room
                  </button>
                </form>
              </div>
              <button
                onClick={joinInstantRoom}
                className="self-end h-10 bg-primary p-2 w-full mb-5 shadow-md"
              >
                Join Instant Room
              </button>
              <form onSubmit={joinRoomById} className="w-full mb-5 shadow-md">
                <div className="w-full">
                  <input
                    placeholder="Insert room id"
                    ref={roomId}
                    className="w-full"
                  ></input>
                </div>
                <button className="h-10 bg-primary p-2 w-full">
                  Join room by id
                </button>
              </form>
            </div>
          </>
          {/* <button className="h-10 bg-teal-600 p-2 mt-40" onClick={joinLastRoom}>
            Join last Room
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
