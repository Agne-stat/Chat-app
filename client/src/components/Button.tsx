import React from "react";
import { ComponentsProps } from "./types";

const Button: React.FC<ComponentsProps> = ({ text, className, onClick }) => (
  <button
    onClick={onClick}
    className={`${className} bg-accent rounded-2xl self-end h-10 cursor-pointer px-4 py-2 hover:bg-opacity-70`}
  >
    {text}
  </button>
);

export default Button;
