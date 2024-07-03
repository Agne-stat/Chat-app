import React, { useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import AllUsers from "./AllUsers";
import { ChatHeaderProps } from "./types";

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatRoom,
  uniqueUsersArray,
}) => {
  const [showAllChatUsers, setShowAllChatUsers] = useState(false);

  const showUsersPopup = () => {
    setShowAllChatUsers(!showAllChatUsers);
  };

  return (
    <div className="p-5 bg-primary text-white text-center text-lg font-bold rounded-lg flex justify-between items-center relative">
      <a href="/" className="">
        <Button
          text="Back"
          className="w-auto h-full rounded-3xl border border-gray bg-primary text-sm py-1 px-1"
        />
      </a>
      <Title text={chatRoom!} className="text-white text-base" />
      <Button
        text="Users"
        className="w-auto h-full rounded-3xl border border-gray bg-primary text-sm py-1 px-1"
        onClick={showUsersPopup}
      />
      {showAllChatUsers && <AllUsers uniqueUsersArray={uniqueUsersArray} />}
    </div>
  );
};

export default ChatHeader;
