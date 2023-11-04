import React from "react";
import { ComponentsProps } from "./types";

const Text: React.FC<ComponentsProps> = ({ text, className }) => (
  <p className={`${className} flex`}>{text}</p>
);

export default Text;
