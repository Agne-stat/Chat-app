import React from "react";
import Text from "../components/Text";
import { AllUsersProps } from "./types";

const AllUsers: React.FC<AllUsersProps> = ({ uniqueUsersArray }) => (
  <div className="absolute w-80 flex flex-col bg-white z-20 p-4 top-14 right-0 shadow-md rounded-md">
    {uniqueUsersArray.map((item) => (
      <Text text={item} className="text-sm" key={item} />
    ))}
  </div>
);

export default AllUsers;
