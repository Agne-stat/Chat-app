import { useContext, useState } from "react";
import Title from "../components/Title";
import { InputField } from "../components/Input";
import { Toggle } from "../components/Toggle";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

export const Homepage = () => {
  const [redirect, setRedirect] = useState<null | string>(null);
  const { user } = useContext(AuthContext);

  const userFirstNameLetter = user?.displayName?.slice(0, 1).toUpperCase();

  if (redirect) return <Navigate to={redirect} replace={true} />;

  return (
    <div className="font-sans m-0 p-0 bg-white text-gray-800 flex justify-center items-center h-screen">
      {/* <div className="h-screen bg-white bg-opacity-90 overflow-y-auto"> */}
      <div className="w-chatBody p-5 shadow-md rounded-lg text-center bg-white">
        {/* <div className="max-h-screen flex flex-col md:w-5/12 md:m-auto "> */}
        <div className="flex justify-between items-center mb-5">
          {/* <div className="flex place-content-end align-bottom m-12"> */}
          <Title text="Join Chat Room" className="text-2xl m-0" />
          <div
            onClick={() => setRedirect(`/profile`)}
            className="bg-primary text-white rounded-full w-profile h-10 flex justify-center items-center text-lg cursor-pointer"
          >
            {userFirstNameLetter}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col w-full items-center">
            <InputField />
            <Toggle />
          </div>
        </div>
      </div>
    </div>
  );
};

// .join-options button {
//   width: 100%;
//   padding: 15px;
//   font-size: 16px;
//   margin: 10px 0;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   background-color: #f3e5f5;
//   color: #000;
//   transition: background-color 0.3s;
// }
// .join-options button:hover {
//   background-color: #d1c4e9;
// }
// .input-field {
//   margin: 10px 0;
//   width: 100%;
//   padding: 15px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// }
// .rooms {
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
// }
// .room {
//   background-color: #f3e5f5;
//   color: #000;
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   transition: background-color 0.3s;
// }
// .room:hover {
//   background-color: #d1c4e9;
// }

{
  /* <body>
  <div class="container">
    <div class="join-options">
      <select class="input-field">
        <option value="">Select room</option>
      </select>
      <button>Join Room</button>
      <button>Join Instant Room</button>
      <input type="text" class="input-field" placeholder="Insert room id" />
      <button>Join room by id</button>
    </div>
    <div>
      <h3>Your rooms:</h3>
      <div class="rooms">
        <div class="room">R</div>
        <div class="room">R</div>
        <div class="room">T</div>
        <div class="room">2</div>
        <div class="room">R</div>
        <div class="room">R</div>
        <div class="room">C</div>
        <div class="room">3</div>
        <div class="room">6</div>
        <div class="room">5</div>
      </div>
    </div>
  </div>
</body>; */
}
