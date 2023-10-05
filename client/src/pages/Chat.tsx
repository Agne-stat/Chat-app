import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../App";
import ChatBody from "../components/ChatBody";
import ChatBottom from "../components/ChatBottom";
import ChatHeader from "../components/ChatHeader";
import Loader from "../components/Loader";
import MessageInput from "../components/MessageInput";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState<
    { username: string; text: string }[]
  >([{ username: "", text: "" }]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTypingText, setIsTypingText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [allChatUsers, setAllChatUsers] = useState<string[]>([""]);
  const [inputValue, setInputValue] = useState("");
  // const [isError, setIsError] = useState(false);

  const userName = user?.email;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const chatRoom = urlParams.get("room");
  let timeOut: ReturnType<typeof setTimeout>;
  const uniqueUsersArray = [...new Set(allChatUsers)];

  const { VITE_BE_URL } = import.meta.env as Record<string, string | undefined>;

  useEffect(() => {
    const newSocket = io(VITE_BE_URL || "");
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userName, chatRoom });

    newSocket.on("message", (message: { username: string; text: string }) => {
      setUserMessage((userMessage) => [...userMessage, message]);
    });

    //User is typing
    newSocket.on("typing", (name) => {
      clearTimeout(timeOut);
      setIsTypingText(`${name} is typing...`);
      timeOut = setTimeout(() => {
        setIsTypingText("");
      }, 3000);
    });

    return () => {
      newSocket.off("message");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${VITE_BE_URL}/rooms/${chatRoom}`)
      .then((res) => {
        const messagesArray = res.data.messages;

        messagesArray.map((item: any) => {
          setUserMessage((userMessage) => [
            ...userMessage,
            {
              username:
                userName === `${item.username}` ? "Me" : `${item.username}`,
              text: `${item.message}` || "",
            },
          ]);

          setAllChatUsers((prevState) => [...prevState, item.username]);
        });
      })
      .catch(() => {
        // setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chatRoom]);

  const handleForm = (e: any) => {
    e.preventDefault();
    //Emit message to serve
    if (socket)
      socket.emit("chatMessage", inputValue, (value: string) => {
        console.log(value);
      });

    if (!!inputValue && inputValue.replace(/\s/g, "") !== "") {
      setUserMessage((userMessage) => [
        ...userMessage,
        {
          username: `Me`,
          text: `${inputValue}` || "",
        },
      ]);
      setInputValue("");
    } else {
      return;
    }
  };

  const handleUserTyping = () => {
    socket!.emit("typing", chatRoom, userName);
  };

  return (
    <div className="h-full flex flex-col place-content-between opacity-90 p-5">
      <ChatHeader chatRoom={chatRoom} uniqueUsersArray={uniqueUsersArray} />
      {isLoading ? <Loader /> : <ChatBody userMessage={userMessage} />}
      <MessageInput
        handleUserTyping={handleUserTyping}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleForm={(e) => handleForm(e)}
      />
      <ChatBottom isTypingText={isTypingText} />
    </div>
  );
};

export default Chat;
