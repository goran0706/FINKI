import { useId } from "react";

function LabelInputPair() {
  const id = useId();

  return (
    <div style={{ marginBottom: "50px" }}>
      <label htmlFor={id}>
        Click on this label and it will highlight the input {id}
      </label>
      <br />
      <input type="text" id={id} placeholder={`input id ${id}`} />
    </div>
  );
}

export default function UseIdComponent() {
  return (
    <>
      <LabelInputPair />
      <LabelInputPair />
      <LabelInputPair />
      <LabelInputPair />
    </>
  );
}
