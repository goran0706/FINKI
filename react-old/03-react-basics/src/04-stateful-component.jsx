import { useEffect, useState } from "react";

const StatefulComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setTitle("Stateful Component");
      setDescription("Stateful Component holding own local state");
    }, 1000);

    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default StatefulComponent;
