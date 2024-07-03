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
      <div className="w-chatBody p-5 shadow-md rounded-lg text-center bg-white">
        <div className="flex justify-between items-center mb-5">
          <Title text="Join Chat Room" className="text-2xl m-0" />
          {user?.photoURL ? (
            <img
              onClick={() => setRedirect(`/profile`)}
              src={user.photoURL}
              className="rounded-t-full rounded-b-full h-10 w-10 cursor-pointer"
            />
          ) : (
            <div
              onClick={() => setRedirect(`/profile`)}
              className="bg-primary text-white rounded-full w-profile h-10 flex justify-center items-center text-lg cursor-pointer"
            >
              {userFirstNameLetter}
            </div>
          )}
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
