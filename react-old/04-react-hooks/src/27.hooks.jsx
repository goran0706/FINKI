import {
  Suspense,
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

const UseRef = () => {
  const ref = useRef(0);
  const handleClick = () => {
    ref.current = ref.current + 1;
    alert("You clicked " + ref.current + " times!");
  };
  return (
    <div>
      <div>useRef</div>
      <button className="btn btn-primary outline" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
};

const UseState = () => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((count) => count + 1);
  };
  return (
    <div>
      <div>useState</div>
      <button className="btn btn-primary outline" onClick={handleClick}>
        Click Me
      </button>
      <p>{"You clicked " + count + " times!"}</p>
    </div>
  );
};

// Action Types
const COUNT = "COUNT";
const INCREMENT_STEP = "INCREMENT_STEP";
const DECREMENT_STEP = "DECREMENT_STEP";

// Action Creators
const incrementCount = { type: COUNT, payload: null };
const incrementStep = { type: INCREMENT_STEP, payload: 1 };
const decrementStep = { type: DECREMENT_STEP, payload: 1 };

// Reducer
const countReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case COUNT:
      return { ...state, count: state.count + state.step };
    case INCREMENT_STEP:
      return { ...state, step: state.step + payload };
    case DECREMENT_STEP:
      return { ...state, step: state.step - payload };
    default:
      return state;
  }
};

// Initial state
const initialCount = {
  count: 0,
  step: 1,
};

const UseReducer = () => {
  const [state, dispatch] = useReducer(countReducer, initialCount);
  const handleCountClick = (dispatch) => dispatch(incrementCount);
  const handleIncrementStep = (dispatch) => dispatch(incrementStep);
  const handleDecrementStep = (dispatch) => dispatch(decrementStep);
  return (
    <div>
      <div>useReducer</div>
      <div className="d-flex gap-1">
        <button
          className="btn btn-primary outline"
          onClick={() => handleCountClick(dispatch)}
        >
          Click Me
        </button>
        <button
          className="btn btn-primary outline"
          onClick={() => handleIncrementStep(dispatch)}
        >
          Increment step {state.step}
        </button>
        <button
          className="btn btn-primary outline"
          onClick={() => handleDecrementStep(dispatch)}
        >
          Decrement step {state.step}
        </button>
      </div>
      <p>{"You clicked " + state.count + " times!"}</p>
    </div>
  );
};

const UseDebounce = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <p>Debounced: {debouncedInputValue}</p>
    </>
  );
};

const UseDefer = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <p>query={deferredQuery}</p>
      </Suspense>
    </>
  );
};

const UseEffectCleanUp = () => {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (count > 1) return;
      setCount((count) => count + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 1) return;
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div>
      <p>current count is {count}</p>
      <p>{seconds} seconds have elapsed since mounting.</p>
    </div>
  );
};

const Hooks = () => {
  return (
    <div>
      <h1>Hooks</h1>
      <div className="container d-flex flex-column gap-2">
        <UseRef />
        <UseState />
        <UseReducer />
        <UseDebounce />
        <UseDefer />
        <UseEffectCleanUp />
      </div>
    </div>
  );
};

export default Hooks;
