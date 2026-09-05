import { useState } from "react";
import { createPortal } from "react-dom";

const Modal = () => {
  const [show, setShow] = useState(true);
  const toggle = () => setShow((s) => !s);

  if (!show) {
    return null;
  }

  const el = (
    <div className="box">
      <button onClick={toggle}>aaaaaaaa{show ? "Hide" : "Show"}</button>
      <div className="modal">
        <h2>Modal</h2>
        <div>
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );

  return createPortal(el, document.querySelector("#modal"));
};

export default Modal;
