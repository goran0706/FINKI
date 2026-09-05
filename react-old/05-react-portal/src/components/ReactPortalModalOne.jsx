import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* 
  Another nice feature React is something called a Portal. 
  You can think of the portal as a separate mount point (the actual DOM node which your app is put into) for your React app.
*/

const Modal = ({ children }) => {
  const elRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
