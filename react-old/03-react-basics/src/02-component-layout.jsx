// 1. Data (props and/or state)
// 2. Logic (event handlers and/or render logic)
// 3. Appearance (JSX)

import { useState } from "react";

const TypicalComponentLayout = () => {
  // code to store component state (data)
  const [state, setState] = useState();
  console.log(state, setState);

  // code to compute values we want to show in our JSX
  const title = "Typical Component Layout";
  const item1 = "Data (props and/or state)";
  const item2 = "Logic (event handlers and/or render logic)";
  const item3 = "Appearance (JSX)";

  // code we want this component to show
  return (
    <div>
      <h1>{title}</h1>
      <ol>
        <li>{item1}</li>
        <li>{item2}</li>
        <li>{item3}</li>
      </ol>
    </div>
  );
};

export default TypicalComponentLayout;
