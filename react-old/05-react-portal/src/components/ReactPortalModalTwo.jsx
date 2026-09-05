import { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const ModalDialog = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid lightgray;
  border-radius: 12px;
  box-shadow: 0 0 12px 2px lightgray;
  margin: 80px auto;
  width: 600px;
  height: 480px;
  padding: 1rem;
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h5`
  font-size: 18px;
  font-weight: 600;
`;

const ModalCloseIcon = styled.button`
  cursor: pointer;
`;

const ModalBody = styled.div`
  font-size: 1rem;
  text-align: justify;
  line-height: 24px;
  width: 100%;
  height: 100%;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
`;

const ModalButton = styled.button`
  margin: 0 4px;
  cursor: pointer;
`;

const Modal = ({ closeModal, openModal }) => {
  return ReactDOM.createPortal(
    <ModalDialog>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalCloseIcon onClick={closeModal}>X</ModalCloseIcon>
        </ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={closeModal}>Cancel</ModalButton>
          <ModalButton onClick={openModal}>Confirm</ModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalDialog>,
    document.querySelector("#modal")
  );
};

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};

const ModalApp = () => {
  // React custom hooks do not share the same state across components using it.
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      {isOpen && <Modal openModal={openModal} closeModal={closeModal} />}
      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
};

export default ModalApp;
