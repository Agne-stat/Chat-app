import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

export const InputField: React.FC = () => {
  const [redirect, setRedirect] = useState<null | string>(null);
  const [roomId, setroomId] = useState<string | null>(null);

  const roomIdref = useRef<HTMLInputElement>(null);

  const joinRoom = (id: string, e?: any) => {
    if (!!e) {
      e.preventDefault();
    }
    if (!!id) {
      const updatedId = id.toLocaleLowerCase();
      setRedirect(`/chat?room=${updatedId}`);
    }
  };

  if (redirect) return <Navigate to={redirect} replace={true} />;

  return (
    <div className="w-full h-12 rounded-3xl border border-gray flex justify-between mx-1">
      <input
        className="h-full rounded-l-3xl px-4 w-full focus:outline-none"
        placeholder="Enter chat room ID"
        ref={roomIdref}
        onChange={() => setroomId(roomIdref.current!.value)}
      />
      <button
        className={`w-inputButton h-full rounded-3xl border border-gray ${
          roomId && "bg-primary text-white"
        }`}
        onClick={(e) => joinRoom(roomId!, e)}
      >
        Join
      </button>
    </div>
  );
};
