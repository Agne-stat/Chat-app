import React from "react";
import Button from "../components/Button";
import { MessageInputProps } from "./types";

const MessageInput: React.FC<MessageInputProps> = ({
  handleUserTyping,
  inputValue,
  setInputValue,
  handleForm,
}) => (
  <form className="flex md:w-5/12  justify-between md:m-auto">
    <input
      type="text"
      placeholder="Enter Message"
      name="message"
      onInput={handleUserTyping}
      className="w-4/5"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <Button
      text="Send"
      className="bg-white w-20 mt-5 rounded-2xl text-primary"
      onClick={handleForm}
    />
  </form>
);

export default MessageInput;
