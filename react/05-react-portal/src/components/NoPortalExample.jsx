import { useState } from "react";
import Modal from "./Modal";

const NoPortalExample = () => {
  const [showModal, setShowModal] = useState();

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  return (
    <>
      {showModal ? (
        <Modal onClose={onClose}>
          <p>Im a modal dialog</p>
        </Modal>
      ) : (
        <button onClick={onOpen}>Show Modal</button>
      )}
    </>
  );
};

export default NoPortalExample;
