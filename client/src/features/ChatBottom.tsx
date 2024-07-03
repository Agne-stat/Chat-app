import React from "react";
import Text from "../components/Text";
import { ChatBottomProps } from "./types";

const ChatBottom: React.FC<ChatBottomProps> = ({ isTypingText }) => (
  <Text
    text={isTypingText}
    className="text-gray-400 h-10 md:w-5/12 md:m-auto px-5"
  />
);

export default ChatBottom;
