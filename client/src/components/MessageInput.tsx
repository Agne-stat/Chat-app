import React from "react";
import { MessageInputProps } from "./types";

const MessageInput: React.FC<MessageInputProps> = ({
  handleUserTyping,
  inputValue,
  setInputValue,
  handleForm,
}) => {
  return (
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
      <button
        className="h-10 bg-primary p-2 w-14 mt-5 rounded-2xl"
        onClick={handleForm}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
