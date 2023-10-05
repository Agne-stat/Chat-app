import React from "react";
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
          <p className="mr-5">{message.username}</p>
          {!!message.text && (
            <div
              className={` ${
                message.username === "Me" ? "bg-white" : "bg-primary"
              } h-auto p-2 max-w-xs w-max rounded-2xl shadow-md mb-5`}
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
