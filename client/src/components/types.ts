export interface MessageInputProps {
  handleUserTyping: () => void;
  inputValue: string;
  setInputValue: (e: string) => void;
  handleForm: (e: any) => void;
}

export interface ChatHeaderProps {
  chatRoom: string | null;
  uniqueUsersArray: string[];
}

export interface UserMessageProps {
  userMessage: { username: string; text: string }[];
}
