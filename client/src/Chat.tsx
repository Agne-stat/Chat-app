import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./App";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState<
    { username: string; text: string }[]
  >([{ username: "", text: "" }]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTypingText, setIsTypingText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [allChatUsers, setAllChatUsers] = useState<string[]>([""]);
  const [showAllChatUsers, setShowAllChatUsers] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // const [isError, setIsError] = useState(false);

  const userName = user?.email;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const chatRoom = urlParams.get("room");
  let timeOut: ReturnType<typeof setTimeout>;
  const chatDivInner = useRef<HTMLUListElement>(null);
  const chatDivOuter = useRef<HTMLDivElement>(null);

  const { VITE_BE_URL } = import.meta.env as Record<string, string | undefined>;

  useEffect(() => {
    if (chatDivOuter.current && chatDivInner.current) {
      const innerHeight = chatDivInner.current.clientHeight;

      chatDivOuter.current.scrollTo({
        top: innerHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [userMessage]);

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

  const uniqueUsersArray = [...new Set(allChatUsers)];

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

  const showUsersPopup = () => {
    setShowAllChatUsers(!showAllChatUsers);
  };

  return (
    <div className="h-full flex flex-col place-content-between opacity-90 p-5">
      <div className="mb-5 md:w-5/12 md:m-auto flex place-content-between align-middle relative">
        <h1 className="text-xl">{chatRoom}</h1>
        <p className="text-accent cursor-pointer" onClick={showUsersPopup}>
          Users
        </p>
        {showAllChatUsers && (
          <div className="absolute w-80 flex flex-col bg-white z-20 shadow-md rounded-2xl p-2">
            {uniqueUsersArray.map((item) => (
              <p key={item} className="text-sm">
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="text-xl text-gray-400 md:w-5/12 m-auto">Loading...</div>
      ) : (
        <div
          className="relative overflow-scroll overflow-x-hidden md:w-5/12 m-auto"
          ref={chatDivOuter}
        >
          <ul className="relative" ref={chatDivInner}>
            {userMessage.map((message, index) => (
              <li
                key={index}
                className={`${
                  message.username === "Me" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <p className="mr-5">
                  <span className="p-2 text-text">
                    {new Date().toLocaleString()}
                  </span>
                  {message.username}
                </p>
                {!!message.text && (
                  <div
                    className={` ${
                      message.username === "Me" ? "bg-white" : "bg-primary"
                    } h-auto p-2 max-w-xs w-max rounded-2xl shadow-md mb-5`}
                  >
                    {message.text}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form className="flex md:w-5/12  justify-between md:m-auto">
        <input
          type="text"
          placeholder="Enter Message"
          name="message"
          onInput={handleUserTyping}
          className="w-4/5"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="h-10 bg-primary p-2 w-14 mt-5 rounded-2xl"
          onClick={handleForm}
        >
          Send
        </button>
      </form>
      <p className="flex h-10 text-gray-400 md:w-5/12 md:m-auto">
        {isTypingText}
      </p>
      <div className="md:w-5/12 mt-10 md:m-auto">
        <a className="h-10 bg-accent p-2 w-14 rounded-2xl" href="/">
          Leave Room
        </a>
      </div>
    </div>
  );
};

export default Chat;
