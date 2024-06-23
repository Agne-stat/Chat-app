import React from "react";
import { MessageInputProps } from "./types";
import { iconChatButton } from "../images";

const MessageInput: React.FC<MessageInputProps> = ({
  handleUserTyping,
  inputValue,
  setInputValue,
  handleForm,
}) => (
  <div className="w-80 h-12 rounded-3xl border border-gray flex justify-between">
    <input
      type="text"
      name="message"
      onInput={handleUserTyping}
      className="h-full rounded-l-3xl px-4 w-60"
      placeholder="Enter message"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <button onClick={handleForm}>
      <img src={iconChatButton} />
    </button>
  </div>
);

export default MessageInput;
