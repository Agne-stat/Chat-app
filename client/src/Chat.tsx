import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./App";
// import debounce from "lodash.debounce";
// import throttle from "lodash.throttle";

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
    console.log(VITE_BE_URL);

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
                userName === `${item.username}` ? "Me: " : `${item.username}`,
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
        username: `Me: `,
        text: `${e.target.message.value}` || "",
      },
    ]);
  };

  const handleUserTyping = () => {
    socket!.emit("typing", userName);
  };

  return (
    <div className="h-full flex flex-col place-content-between ">
      {/* {isError && (
        <div className="text-xl m-12 text-gray-400"> This room is empty</div>
      )} */}
      {isLoading ? (
        <div className="text-xl m-12 text-gray-400"> Loading...</div>
      ) : (
        <div
          className="m-12 relative overflow-scroll overflow-x-auto "
          ref={chatDivOuter}
        >
          <h1 className="text-xl mb-5">{room}</h1>
          <ul className="relative" ref={chatDivInner}>
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
      )}
      <div className="m-12">
        <a className="h-10 bg-teal-600 p-2 w-14" href="/">
          Leave Room
        </a>
      </div>
    </div>
  );
};

export default Chat;
