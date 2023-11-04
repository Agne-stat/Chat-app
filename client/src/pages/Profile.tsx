import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../App";
import useId from "react-uuid";
import Title from "../components/Title";
import Button from "../components/Button";
import Text from "../components/Text";
import axios from "axios";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("");
  const [instantRoomId, setInstantRoomId] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<null | string>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [usersRooms, setUsersRooms] = useState<{ room: string | null }[]>([
    { room: null },
  ]);
  const [cardIsClicked, setCardIsClicked] = useState<number | null>(null);

  const roomId = useRef<HTMLInputElement>(null);
  const { VITE_BE_URL } = import.meta.env as Record<string, string | undefined>;

  useEffect(() => {
    axios
      .get(`${VITE_BE_URL}/saveRooms/${user?.email}`)
      .then((res) => {
        setUsersRooms(res.data.rooms);
      })
      .catch(() => {})
      .finally(() => {});
  }, [chatRoom]);

  if (redirect) return <Navigate to={redirect} replace={true} />;

  const joinRoom = (id: string, e?: any) => {
    if (!!e) {
      e.preventDefault();
    }
    if (!!id) {
      const updatedId = id.toLocaleLowerCase();
      setRedirect(`/chat?room=${updatedId}`);
    }
  };

  const userFirstNameLetter = user?.displayName?.slice(0, 1).toUpperCase();

  return (
    <div className="h-screen bg-white bg-opacity-90">
      <div className="max-h-screen flex flex-col md:w-5/12 md:m-auto ">
        <div className="flex place-content-end align-bottom m-12">
          <div
            onClick={() => setShowUserInfo(!showUserInfo)}
            className={`flex place-content-center rounded-t-full rounded-b-full relative bg-primary  w-10 h-10 self-end text-white cursor-pointer`}
          >
            <p className="flex object-center self-center">
              {userFirstNameLetter}
            </p>
            {showUserInfo && (
              <div className="flex flex-col text-text w-max items-end absolute top-14 right-0 bg-white shadow-md rounded-md p-4">
                <Text
                  text={`Hi, ${user?.displayName}`}
                  className="mb-2 w-full"
                />
                <Button
                  text="Logout"
                  onClick={() => auth?.signOut()}
                  className="w-auto bg-white text-primary px-0"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col m-12">
          <Title text="Join Chat Room" className="place-content-center" />
          <div className="flex flex-col mt-20 w-72 m-auto ">
            <form
              onSubmit={(e) => joinRoom(chatRoom, e)}
              className="self-end w-full mb-9"
            >
              <div className="w-full">
                <select
                  name="room"
                  onChange={(e) => setChatRoom(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select room</option>
                  <option value="room_01">Room 01</option>
                  <option value="room_02">Room 02</option>
                  <option value="room_03">Room 03</option>
                </select>
              </div>
              <Button
                text="Join Room"
                className={`w-full shadow-md ${
                  chatRoom && "bg-primary text-white"
                }`}
              />
            </form>
            <Button
              text="Join Instant Room"
              className="w-full mb-5 shadow-md"
              onClick={() => joinRoom(useId())}
            />
            <form
              onSubmit={(e) => joinRoom(instantRoomId!, e)}
              className="w-full mb-5 "
            >
              <div className="w-full">
                <input
                  placeholder="Insert room id"
                  ref={roomId}
                  onChange={() => setInstantRoomId(roomId.current!.value)}
                  className="w-full"
                />
              </div>
              <Button
                text="Join room by id"
                className={`w-full shadow-md ${
                  instantRoomId && "bg-primary text-white"
                }`}
              />
            </form>
          </div>
          <div className="flex flex-col m-12 mb-0 relative">
            <p>Your rooms: </p>
            <div className="flex overflow-x-scroll overflow-y-hidden no-scrollbar mt-3 w-full h-auto">
              {usersRooms?.map((room, index) => (
                <div
                  onClick={() =>
                    setCardIsClicked(cardIsClicked !== index ? index : null)
                  }
                  key={index}
                  className={`flex place-content-center rounded-t-full rounded-b-full bg-accent w-12 h-12 cursor-pointer mr-3  ${
                    cardIsClicked === index && "bg-primary text-white"
                  }`}
                >
                  <p className="flex object-center self-center px-5">
                    {room.room?.slice(0, 1).toUpperCase()}
                  </p>
                  {cardIsClicked === index && (
                    <div className="flex flex-col text-text w-max items-start absolute bottom-16 left-0 bg-white shadow-md rounded-md p-4">
                      <Text text={room.room!} className="mb-2 w-full" />

                      <Button
                        text="Open room"
                        onClick={() => setRedirect(`/chat?room=${room.room}`)}
                        className="w-auto bg-white text-primary px-0"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
