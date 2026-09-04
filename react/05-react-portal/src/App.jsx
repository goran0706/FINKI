import "./App.css";
import Alert from "./components/Alert";
import NoPortalExample from "./components/NoPortalExample";
import PortalExample from "./components/PortalExample";
import Modal from "./components/ReactPortalModalOne";
import ModalApp from "./components/ReactPortalModalTwo";
import SidebarApp from "./components/Sidebar";

function App() {
  return (
    <>
      <NoPortalExample />
      <PortalExample />
      <SidebarApp />
      <Modal>
        <h1>Modal</h1>
        <div>I am a modal component</div>
        <button>OK</button>
        <button>Close</button>
      </Modal>
      <ModalApp />

      <Alert status="info" timeMS={3000}>
        Transaction failed
      </Alert>
      <Alert status="error" timeMS={4000}>
        Transaction failed
      </Alert>
      <Alert status="success" timeMS={5000}>
        Transaction failed
      </Alert>
    </>
  );
}

export default App;
