import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import Login from "./Login";

const App = () => {
  // const [userMessage, setUserMessage] = useState([{}]);
  // const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {
  //   const newSocket = io("ws://localhost:3000");
  //   setSocket(newSocket);
  //   newSocket.on("message", (message: string) => {
  //     setUserMessage((userMessage) => [...userMessage, message]);
  //   });

  //   return () => {
  //     newSocket.off("message");
  //     newSocket.close();
  //   };
  // }, []);

  // const handleForm = (e: any) => {
  //   e.preventDefault();

  //   //Emit message to serve
  //   if (socket) socket.emit("chatMessage", e.target.message.value);

  //   setUserMessage((userMessage) => [
  //     ...userMessage,
  //     {
  //       username: "Me: ",
  //       text: `${e.target.message.value}` || "",
  //     },
  //   ]);
  // };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
