import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./App";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState([{}]);
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const userName = user?.email;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const chatRoom = urlParams.get("room");

  useEffect(() => {
    const newSocket = io("ws://localhost:3000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userName, chatRoom });
    // newSocket.on("roomUsers", ({ room, users }) => {
    //   console.log(room, users);
    // });
    newSocket.on("message", (message: string) => {
      setUserMessage((userMessage) => [...userMessage, message]);
    });

    if (chatRoom?.startsWith("Room")) {
      return setRoom(chatRoom);
    } else {
      setRoom("Instant Room");
    }

    return () => {
      newSocket.off("message");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3000/rooms/${chatRoom}`).then((res) => {
      console.log("Room DATA: ", res.data.messages);
      const messagesArray = res.data.messages;
      messagesArray.map((item: any) => {
        setUserMessage((userMessage) => [
          ...userMessage,
          {
            username:
              userName === `${item.username}` ? "Me: " : `${item.username}`,
            text: `${item.message}` || "",
          },
        ]);
      });
    });
  }, [chatRoom]);

  const handleForm = (e: any) => {
    e.preventDefault();
    //Emit message to serve
    if (socket) socket.emit("chatMessage", e.target.message.value);

    setUserMessage((userMessage) => [
      ...userMessage,
      {
        username: `Me: `,
        text: `${e.target.message.value}` || "",
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col place-content-between">
      <div className="m-12">
        <h1 className="text-xl mb-5">{room}</h1>
        <ul>
          {userMessage.map((message, index) => (
            <li key={index} className="flex flex-col">
              <p className="mr-5">{message.username}</p>
              {!!message.text && (
                <div className="bg-gray-300 bg-opacity-25 h-auto p-2 max-w-md w-auto">
                  {message.text}
                </div>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleForm} className="flex ">
          <input
            type="text"
            placeholder="Enter Message"
            required
            name="message"
          />
          <button type="submit" className="h-10 bg-teal-600 p-2 w-14 mt-5">
            Send
          </button>
        </form>
      </div>
      <div className="m-12">
        <a className="h-10 bg-teal-600 p-2 w-14" href="/">
          Leave Room
        </a>
      </div>
    </div>
  );
};

export default Chat;
