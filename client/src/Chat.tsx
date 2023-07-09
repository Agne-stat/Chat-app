import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Chat = () => {
  const [userMessage, setUserMessage] = useState([{}]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const userName = localStorage.getItem("chat-user");
  const chatRoom = localStorage.getItem("chat-room");

  useEffect(() => {
    const newSocket = io("ws://localhost:3000");
    setSocket(newSocket);

    console.log(userName, chatRoom);

    newSocket.emit("joinRoom", { userName, chatRoom });
    newSocket.on("roomUsers", ({ room, users }) => {
      console.log(room, users);
    });
    newSocket.on("message", (message: string) => {
      setUserMessage((userMessage) => [...userMessage, message]);
    });

    return () => {
      newSocket.off("message");
      newSocket.close();
    };
  }, []);

  //   const userName = localStorage.getItem("chat-user");
  //   const chatRoom = localStorage.getItem("chat-room");

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
    <div>
      <h1 className="text-xl">{chatRoom}</h1>
      <ul>
        {userMessage.map((message, index) => (
          <li key={index}>
            {message.username}
            {message.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="Enter Message"
          required
          name="message"
        />
        <button type="submit" className="bg-blue-500">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
