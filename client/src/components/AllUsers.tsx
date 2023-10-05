import React from "react";

const AllUsers: React.FC<{ uniqueUsersArray: string[] }> = ({
  uniqueUsersArray,
}) => {
  return (
    <div className="absolute w-80 flex flex-col bg-white z-20 shadow-md rounded-2xl p-2">
      {uniqueUsersArray.map((item) => (
        <p key={item} className="text-sm">
          {item}
        </p>
      ))}
    </div>
  );
};

export default AllUsers;
