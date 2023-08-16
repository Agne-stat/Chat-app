import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./App";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState([{}]);
  const [room, setRoom] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTypingText, setIsTypingText] = useState<string>("");
  const userName = user?.email;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const chatRoom = urlParams.get("room");

  useEffect(() => {
    const newSocket = io("ws://localhost:3000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userName, chatRoom });
    newSocket.on("message", (message: string) => {
      setUserMessage((userMessage) => [...userMessage, message]);
    });

    //User is typing
    newSocket.on("typing", (name) => {
      setIsTypingText(`${name} is typing...`);
      setTimeout(() => {
        setIsTypingText("");
      }, 10000);
    });

    if (chatRoom?.startsWith("room")) {
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

  const handleUserTyping = () => {
    socket!.emit("typing", userName);
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
            onInput={handleUserTyping}
          />
          <button type="submit" className="h-10 bg-teal-600 p-2 w-14 mt-5">
            Send
          </button>
        </form>
        <p className="text-gray-400">{isTypingText}</p>
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
