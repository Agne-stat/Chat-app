import React from "react";
import Button from "../components/Button";
import Text from "../components/Text";
import { ChatBottomProps } from "./types";

const ChatBottom: React.FC<ChatBottomProps> = ({ isTypingText }) => (
  <>
    <Text
      text={isTypingText}
      className="text-gray-400 h-10 md:w-5/12 md:m-auto"
    />
    <div className="md:w-5/12 mt-10 md:m-auto">
      <a href="/" className="w-20 ">
        <Button
          text="Leave Room"
          className="w-auto rounded-2xl border border-primary px-4 py-2 bg-white"
        />
      </a>
    </div>
  </>
);

export default ChatBottom;
