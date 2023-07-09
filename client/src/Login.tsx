import { useState, useEffect } from "react";
import { Navigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [chatRoom, setChatRoom] = useState("");
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    // const id = localStorage.getItem("gameUser-id");
    // if (id === null) {
    //   console.log("not loged in");
    // } else {
    //   setRedirect("/home");
    // }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    console.log(chatRoom);

    localStorage.setItem("chat-user", username);
    localStorage.setItem("chat-room", chatRoom);

    setRedirect("/chat");
  };
  if (redirect) return <Navigate to={redirect} replace={true} />;

  return (
    <main>
      <div>
        <div>
          <h1>Login</h1>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Room</label>
              <select name="room" onChange={(e) => setChatRoom(e.target.value)}>
                <option>Select room</option>
                <option value="Room 01">Room 01</option>
                <option value="Room 02">Room 02</option>
                <option value="Room 03">Room 03</option>
              </select>
            </div>
            <div>{!!chatRoom && <button>Join Room</button>}</div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
