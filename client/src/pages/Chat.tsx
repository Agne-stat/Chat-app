import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../App";
import ChatBody from "../features/ChatBody";
import ChatBottom from "../features/ChatBottom";
import ChatHeader from "../features/ChatHeader";
import Loader from "../features/Loader";
import MessageInput from "../features/MessageInput";

export const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState<
    { username: string; text: string }[]
  >([{ username: "", text: "" }]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTypingText, setIsTypingText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [allChatUsers, setAllChatUsers] = useState<string[]>([""]);
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);

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
      console.log("message: ", message);
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
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsError(false);
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

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleForm(e);
    }
  };

  return (
    <div className="font-sans m-0 p-0 bg-white text-gray-800 flex justify-center items-center h-screen">
      <div className="w-chatBody shadow-md rounded-lg text-center bg-white h-auto">
        <ChatHeader chatRoom={chatRoom} uniqueUsersArray={uniqueUsersArray} />
        {isError && (
          <div className="text-xl text-gray-400 md:w-5/12 m-auto"></div>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <ChatBody userMessage={userMessage} />
            <MessageInput
              handleUserTyping={handleUserTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleKeyDown={handleKeyDown}
              handleForm={(e) => handleForm(e)}
            />
          </>
        )}
        <ChatBottom isTypingText={isTypingText} />
      </div>
    </div>
  );
};
