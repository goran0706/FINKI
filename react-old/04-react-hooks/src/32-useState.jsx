/* eslint-disable react/prop-types */
import { useState } from "react";

const reset = (value, callback) => callback(value);
const decrement = (step, callback) => callback((prev) => prev - step);
const increment = (step, callback) => callback((prev) => prev + step);

const CountAction = ({ label, action, ...rest }) => {
  return (
    <button onClick={action} {...rest}>
      {label}
    </button>
  );
};

const CountResetAction = ({ initCount, setCount }) => {
  const callback = () => reset(initCount, setCount);
  return <CountAction label="Reset" action={callback} />;
};

const CountDecrementAction = ({ step, setCount }) => {
  const callback = () => decrement(step, setCount);
  return <CountAction label="Decrement" action={callback} />;
};

const CountIncrementAction = ({ step, setCount }) => {
  const callback = () => increment(step, setCount);
  return <CountAction label="Increment" action={callback} />;
};

const StepDecrementAction = ({ setCount }) => {
  const callback = () => decrement(1, setCount);
  return <CountAction label="Decrement" action={callback} />;
};

const StepIncrementAction = ({ setCount }) => {
  const callback = () => increment(1, setCount);
  return <CountAction label="Increment" action={callback} />;
};

const CountControls = ({ initCount, step, setCount }) => {
  return (
    <div>
      <p>Count Controls</p>
      <CountResetAction initCount={initCount} setCount={setCount} />
      <CountDecrementAction step={step} setCount={setCount} />
      <CountIncrementAction step={step} setCount={setCount} />
    </div>
  );
};

const StepControls = ({ step, setStep }) => {
  return (
    <div>
      <p>Step Controls: step = {step}</p>
      <StepDecrementAction setCount={setStep} />
      <StepIncrementAction setCount={setStep} />
    </div>
  );
};

const CountDisplay = ({ count }) => {
  return (
    <div>
      <h2>Count Display</h2>
      <p>Count is: {count}</p>
    </div>
  );
};

// Initial value
const initVal = 10;

// Expensive calculation to generate the initial state
const getInitialValue = (init) => {
  const random = Math.floor(Math.random() * init);
  let temp = 0;
  for (let i = init; i--; ) {
    temp += i * random;
  }
  return temp;
};

const UseStateCount = () => {
  const [step, setStep] = useState(1); // manage state using useState hook
  const [count, setCount] = useState(() => getInitialValue(initVal)); // lazy state initialization for expensive init functions

  // If components share the same state value, lift the value up to the closest shared ancestor component in the component tree and pass the state down via props.
  // State is pushed to the most common parent(consumer) component and passed down the child components.
  // The component that holds the state is responsible for managing that state. In this case we delegate the managing of state to the child components.

  return (
    <div className="box">
      <CountDisplay count={count} />
      <CountControls initCount={initVal} step={step} setCount={setCount} />
      <StepControls step={step} setStep={setStep} />
    </div>
  );
};

export default UseStateCount;
