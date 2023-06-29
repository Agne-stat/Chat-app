import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const App = () => {
  // const [messageFromServer, setMessageFromServer] = useState("");
  const [userMessage, setUserMessage] = useState([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [inputValue, setInputValue] = useState("");

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log(socket);
  //   });
  // }, []);

  useEffect(() => {
    const newSocket = io("ws://localhost:3000");
    setSocket(newSocket);
    newSocket.on("message", (message: string) => {
      console.log(message);
      setUserMessage((userMessage) => [...userMessage, message]);
    });

    return () => {
      newSocket.off("message");
      newSocket.close();
    };
  }, []);

  // setUserMessage((preValue) => [...preValue, message]);

  const handleForm = (e: any) => {
    e.preventDefault();

    //Emit message to serve
    if (socket) socket.emit("chatMessage", e.target.message.value);

    setUserMessage((userMessage) => [
      ...userMessage,
      `You: ${e.target.message.value}`,
    ]);
  };

  return (
    <div>
      <h1 className="text-xl">Chat app</h1>

      <ul>
        {userMessage.map((message, index) => (
          <li key={index}>{message}</li>
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
      {/* <p>{messageFromServer}</p> */}
    </div>
  );
};

export default App;
