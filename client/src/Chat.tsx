import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./App";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState<
    { username: string; text: string }[]
  >([{ username: "", text: "" }]);
  const [room, setRoom] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTypingText, setIsTypingText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
        console.log("timeOut");
      }, 3000);
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
    setIsLoading(true);
    axios
      .get(`${VITE_BE_URL}/rooms/${chatRoom}`)
      .then((res) => {
        const messagesArray = res.data.messages;
        console.log(messagesArray);

        messagesArray.map((item: any) => {
          setUserMessage((userMessage) => [
            ...userMessage,
            {
              username:
                userName === `${item.username}` ? "Me" : `${item.username}`,
              text: `${item.message}` || "",
            },
          ]);
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
    if (socket) socket.emit("chatMessage", e.target.message.value);

    setUserMessage((userMessage) => [
      ...userMessage,
      {
        username: `Me`,
        text: `${e.target.message.value}` || "",
      },
    ]);
  };

  const handleUserTyping = () => {
    socket!.emit("typing", chatRoom, userName);
  };

  return (
    <div className="h-full flex flex-col place-content-between opacity-90 p-5">
      <h1 className="text-xl mb-5 md:w-5/12 m-auto">{room}</h1>

      {/* {isError && (
        <div className="text-xl m-12 text-gray-400"> This room is empty</div>
      )} */}
      {isLoading ? (
        <div className="text-xl m-12 text-gray-400"> Loading...</div>
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
                <p className="mr-5">{message.username}</p>
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
      <form onSubmit={handleForm} className="flex md:w-5/12 m-auto">
        <input
          type="text"
          placeholder="Enter Message"
          required
          name="message"
          onInput={handleUserTyping}
        />
        <button
          type="submit"
          className="h-10 bg-primary p-2 w-14 mt-5 rounded-2xl"
        >
          Send
        </button>
      </form>
      <p className="flex h-10 text-gray-400 md:w-5/12 m-auto">{isTypingText}</p>
      <div className="md:w-5/12 m-auto mt-10 ">
        <a className="h-10 bg-primary p-2 w-14 rounded-2xl" href="/">
          Leave Room
        </a>
      </div>
    </div>
  );
};

export default Chat;
