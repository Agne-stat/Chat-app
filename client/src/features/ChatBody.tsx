import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { UserMessageProps } from "./types";

const ChatBody: React.FC<UserMessageProps> = ({ userMessage }) => {
  const chatDivInner = useRef<HTMLUListElement>(null);
  const chatDivOuter = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatDivOuter.current && chatDivInner.current) {
      const innerHeight = chatDivInner.current.clientHeight;

      chatDivOuter.current.scrollTo({
        top: innerHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [userMessage]);

  return (
    <div
      className="relative overflow-scroll overflow-x-hidden mb-5 md:w-5/12 md:m-auto no-scrollbar"
      ref={chatDivOuter}
    >
      <ul className="relative" ref={chatDivInner}>
        <Message userMessage={userMessage} />
      </ul>
    </div>
  );
};

export default ChatBody;
