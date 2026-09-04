import { useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";

const PortalExample = () => {
  const [showModal, setShowModal] = useState();

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  return (
    <>
      {showModal ? (
        createPortal(
          <Modal onClose={onClose}>
            <p>Im a modal dialog</p>
          </Modal>,
          document.body
        )
      ) : (
        <button onClick={onOpen}>Show Modal</button>
      )}
    </>
  );
};

export default PortalExample;
