export interface MessageInputProps {
  handleUserTyping: () => void;
  inputValue: string;
  setInputValue: (e: string) => void;
  handleForm: (e: any) => void;
  handleKeyDown: (e: any) => void;
}

export interface AllUsersProps {
  uniqueUsersArray: string[];
}

export interface ChatHeaderProps extends AllUsersProps {
  chatRoom: string | null;
}

export interface UserMessageProps {
  userMessage: { username: string; text: string }[];
}

export interface ChatBottomProps {
  isTypingText: string;
}
