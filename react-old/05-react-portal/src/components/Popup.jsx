import { createPortal } from "react-dom";

const Popup = () => {
  const el = (
    <div className="popup">
      <h2>Portal</h2>
      <div>
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    </div>
  );

  return createPortal(el, document.querySelector("#popup"));
};

export default Popup;
