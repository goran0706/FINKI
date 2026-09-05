import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Alert = ({ children, timeMS = 10000, status = "info" }) => {
  const elRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const alertRoot = document.getElementById("alert");
    alertRoot.appendChild(elRef.current);

    const id = setTimeout(() => alertRoot.removeChild(elRef.current), timeMS);

    return () => {
      alertRoot.removeChild(elRef.current);
      clearTimeout(id);
    };
  }, [timeMS]);

  return createPortal(
    <div className={`alert ${status}`}>{children}</div>,
    elRef.current
  );
};

export default Alert;
