import React from "react";
import { MessageInputProps } from "./types";
import Button from "../components/Button";

const MessageInput: React.FC<MessageInputProps> = ({
  handleUserTyping,
  inputValue,
  setInputValue,
  handleForm,
  handleKeyDown,
}) => (
  <div className="w-80 h-12 rounded-3xl border border-gray flex justify-between m-5">
    <input
      type="text"
      name="message"
      onInput={handleUserTyping}
      className="h-full rounded-l-3xl px-4 w-full focus:outline-none"
      placeholder="Enter message"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
    <Button
      text="Send"
      className="w-inputButton h-full rounded-3xl border border-gray"
      onClick={handleForm}
    />
  </div>
);

export default MessageInput;
