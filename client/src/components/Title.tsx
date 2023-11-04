import React from "react";
import { ComponentsProps } from "./types";

const Title: React.FC<ComponentsProps> = ({ text, className }) => (
  <p className={`${className} flex text-2xl`}>{text}</p>
);
export default Title;
