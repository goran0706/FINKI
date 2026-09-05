import { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <div className="header">{children}</div>;
};

export default Header;
