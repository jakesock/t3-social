import type { FC } from "react";

interface ContainerProps {
  children: React.ReactNode;
  classNames?: string;
}

export const Container: FC<ContainerProps> = ({ children, classNames = "" }) => {
  return <div className={`m-auto max-w-xl bg-slate-200 ${classNames}`}>{children}</div>;
};
