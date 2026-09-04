import { ReactNode } from "react";

const Footer = ({ children }: { children: ReactNode }) => {
  return <div className="footer">{children}</div>;
};

export default Footer;
