import React from "react";
import Text from "../components/Text";
import { UserMessageProps } from "./types";

const Message: React.FC<UserMessageProps> = ({ userMessage }) => {
  return (
    <>
      {userMessage.map((message, index) => (
        <li
          key={index}
          className={`${
            message.username === "Me" ? "items-end" : "items-start"
          } flex flex-col`}
        >
          <Text text={message.username} className="mr-5" />
          {!!message.text && (
            <div
              className={` ${
                message.username === "Me" ? "bg-white" : "bg-accent"
              } h-auto px-4 py-2 max-w-xs w-max rounded-2xl shadow-md mb-5`}
            >
              {message.text}
            </div>
          )}
        </li>
      ))}
    </>
  );
};

export default Message;
