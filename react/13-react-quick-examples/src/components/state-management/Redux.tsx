import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

const Counter = () => {
  const value = useSelector((state: RootState) => state.counter.value);
  const { decrement, increment, reset } = counterSlice.actions;
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Counter</h1>
      <p>{value}</p>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(reset())}>0</button>
      </div>
    </div>
  );
};

const Redux = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

export default Redux;
