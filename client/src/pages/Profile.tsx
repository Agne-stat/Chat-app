import { useContext } from "react";
import { AuthContext } from "../App";
import Button from "../components/Button";
import Text from "../components/Text";

export const Profile = () => {
  const { user, auth } = useContext(AuthContext);

  console.log("user", user);

  return (
    <div className="font-sans m-0 p-0 bg-white text-gray-800 flex justify-center items-center h-screen">
      <div className="w-chatBody shadow-md rounded-lg text-center bg-white h-5/6 p-5">
        <div className="flex flex-col justify-between items-center mb-5">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <Text text={`Hi, ${user?.displayName}`} className="mb-2 w-full" />
              <Text text={user?.email} className="mb-2 w-full" />
            </div>
            {user?.photoURL && (
              <img
                src={user.photoURL}
                className="rounded-t-full rounded-b-full"
              />
            )}
          </div>

          <div className="w-full text-center text-lg font-bold rounded-lg flex justify-between items-center ">
            <a href="/">
              <Button
                text="Back"
                className="w-auto h-full rounded-3xl border border-primary bg-white text-sm py-1 px-1 text-primary"
              />
            </a>
            <Button
              text="Logout"
              onClick={() => auth?.signOut()}
              className="w-auto bg-white text-primary px-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
