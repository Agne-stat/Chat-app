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
    <div className="mb-5 md:w-5/12 md:m-auto flex place-content-between align-middle relative">
      <Title text={chatRoom!} className="text-text text-xl" />
      <Button
        text="Users"
        className="text-text w-auto"
        onClick={showUsersPopup}
      />
      {showAllChatUsers && <AllUsers uniqueUsersArray={uniqueUsersArray} />}
    </div>
  );
};

export default ChatHeader;
