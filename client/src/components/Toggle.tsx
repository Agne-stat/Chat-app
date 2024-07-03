import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useId from "react-uuid";
import axios from "axios";
import { AuthContext } from "../App";

export const Toggle: React.FC = ({}) => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState<null | string>(null);
  const [usersRooms, setUsersRooms] = useState<{ room: string | null }[]>([
    { room: null },
  ]);

  const { VITE_BE_URL } = import.meta.env as Record<string, string | undefined>;

  useEffect(() => {
    axios
      .get(`${VITE_BE_URL}/saveRooms/${user?.email}`)
      .then((res) => {
        setUsersRooms(res.data.rooms.reverse());
      })
      .catch(() => {})
      .finally(() => {});
  }, [chatRoom]);

  if (redirect) return <Navigate to={redirect} replace={true} />;

  const joinRoom = (id: string, e?: any) => {
    console.log(id);

    if (!!e) {
      e.preventDefault();
    }
    if (!!id) {
      const updatedId = id.toLocaleLowerCase();
      setRedirect(`/chat?room=${updatedId}`);
    }
  };

  return (
    <div className="overflow-y-auto w-full">
      <div className="w-full h-12 rounded-3xl mt-6 mb-6 shadow-md mx-1">
        <button
          onClick={() => handleTabClick("tab1")}
          className={`h-full rounded-3xl ${
            activeTab === "tab2"
              ? "bg-white font-semibold w-half"
              : "bg-gray w-half"
          }`}
        >
          Your saved
        </button>
        <button
          onClick={() => handleTabClick("tab2")}
          className={`h-full rounded-3xl  ${
            activeTab === "tab1"
              ? "bg-white font-semibold w-half "
              : "bg-gray w-half"
          }`}
        >
          Discover new
        </button>
      </div>
      <div>
        {activeTab === "tab1" && (
          <div className="h-80">
            {!!usersRooms.length ? (
              usersRooms.map((room, index) => (
                <div
                  onClick={() => setRedirect(`/chat?room=${room.room}`)}
                  key={index}
                  className={`flex place-content-start rounded-3xl bg-white w-80 cursor-pointer my-2 h-14 shadow-lg mx-1`}
                >
                  <p className="flex object-start self-center px-5">
                    {room.room}
                  </p>
                </div>
              ))
            ) : (
              <div className="w-80 flex justify-center">
                You don't have saved rooms yet
              </div>
            )}
            {/* {usersRooms.reverse().map((room, index) => (
              <div
                onClick={() => setRedirect(`/chat?room=${room.room}`)}
                key={index}
                className={`flex place-content-start rounded-3xl bg-white w-80 cursor-pointer my-2 h-14 shadow-lg mx-1`}
              >
                <p className="flex object-start self-center px-5">
                  {room.room}
                </p>
              </div>
            ))} */}
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="h-80">
            <form
              onSubmit={(e) => joinRoom(chatRoom, e)}
              className="self-end w-80 mb-9"
            >
              <div className="w-80 h-12 rounded-3xl border border-gray flex justify-between">
                <select
                  name="room"
                  onChange={(e) => setChatRoom(e.target.value)}
                  className="h-full rounded-l-3xl px-4 w-full"
                >
                  <option value="">Select room</option>
                  <option value="room_01">Room 01</option>
                  <option value="room_02">Room 02</option>
                  <option value="room_03">Room 03</option>
                </select>
                <button
                  className={`w-inputButton h-full rounded-3xl border border-gray ${
                    chatRoom && "bg-primary text-white"
                  }`}
                >
                  Join
                </button>
              </div>
            </form>
            <button
              className={`w-full h-12 rounded-3xl border border-gray bg-accent text-white"
              `}
              onClick={() => joinRoom(useId())}
            >
              Join Instant Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
