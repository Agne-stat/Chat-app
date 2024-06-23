import React from "react";
import { MessageInputProps } from "./types";
import Button from "../components/Button";

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
    <Button
      text="Send"
      className="bg-white w-20 mt-5 rounded-2xl text-primary"
      onClick={handleForm}
    />
  </div>
);

export default MessageInput;

// const MessageInput: React.FC<MessageInputProps> = ({
//   handleUserTyping,
//   inputValue,
//   setInputValue,
//   handleForm,
// }) => (
//   <form className="flex md:w-5/12  justify-between md:m-auto">
//     <input
//       type="text"
//       placeholder="Enter Message"
//       name="message"
//       onInput={handleUserTyping}
//       className="w-4/5"
//       value={inputValue}
//       onChange={(e) => setInputValue(e.target.value)}
//     />
//     <Button
//       text="Send"
//       className="bg-white w-20 mt-5 rounded-2xl text-primary"
//       onClick={handleForm}
//     />
//   </form>
// );

// export default MessageInput;

// const handleForm = (e: any) => {
//   e.preventDefault();
//   //Emit message to serve
//   if (socket)
//     socket.emit("chatMessage", inputValue, (value: string) => {
//       console.log(value);
//     });
//   if (!!inputValue && inputValue.replace(/\s/g, "") !== "") {
//     setUserMessage((userMessage) => [
//       ...userMessage,
//       {
//         username: `Me`,
//         text: `${inputValue}` || "",
//       },
//     ]);
//     setInputValue("");
//   } else {
//     return;
//   }
// };
// const handleUserTyping = () => {
//   socket!.emit("typing", chatRoom, userName);
// };
