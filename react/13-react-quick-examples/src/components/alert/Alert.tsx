import { useState } from "react";
import styles from "./Alert.module.css";

type Props = {
  type: "info" | "warning" | "error";
  title: string;
  description: string;
};

const Alert = ({ type, title, description }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = () => setOpen((isOpen) => !isOpen);

  return (
    <div>
      <button onClick={toggle}>Toggle Alert</button>
      {open && (
        <div className={`${styles[type]} ${styles.alert}`}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default Alert;
