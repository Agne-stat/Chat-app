import React from "react";

const ChatBottom: React.FC<{ isTypingText: string }> = ({ isTypingText }) => {
  return (
    <>
      <p className="flex h-10 text-gray-400 md:w-5/12 md:m-auto">
        {isTypingText}
      </p>
      <div className="md:w-5/12 mt-10 md:m-auto">
        <a className="h-10 bg-accent p-2 w-14 rounded-2xl" href="/">
          Leave Room
        </a>
      </div>
    </>
  );
};

export default ChatBottom;
