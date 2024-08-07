import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { UserMessageProps } from "./types";

const ChatBody: React.FC<UserMessageProps> = ({ userMessage }) => {
  const chatDivInner = useRef<HTMLUListElement>(null);
  const chatDivOuter = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatDivOuter.current && chatDivInner.current) {
      const innerHeight = chatDivInner.current.scrollHeight;

      chatDivOuter.current.scrollTo({
        top: innerHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [userMessage]);

  return (
    <div
      className="flex-1 p-5 overflow-y-auto bg-blue-50 relative overflow-scroll overflow-x-hidden"
      ref={chatDivOuter}
    >
      <ul className="relative h-96" ref={chatDivInner}>
        <Message userMessage={userMessage} />
      </ul>
    </div>
  );
};

export default ChatBody;
