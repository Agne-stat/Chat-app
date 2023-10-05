import React, { useState } from "react";
import AllUsers from "../components/AllUsers";
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
    <div className="mb-5 md:w-5/12 md:m-auto flex place-content-between align-middle relative">
      <h1 className="text-xl">{chatRoom}</h1>
      <p className="text-accent cursor-pointer" onClick={showUsersPopup}>
        Users
      </p>
      {showAllChatUsers && <AllUsers uniqueUsersArray={uniqueUsersArray} />}
    </div>
  );
};

export default ChatHeader;
