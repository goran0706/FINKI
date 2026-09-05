import { Component } from "react";
import { Provider, connect } from "react-redux";
import { combineReducers, createStore } from "redux";

/* 

  1. Define Actions
  2. Define Action Creators
  3. Create Reducers
  4. Create Store
  5. Wrap App in Provider
  6. Connect Redux State To Component (Map State & Dispatch To Props)

  Flow:
  Call Action Creator --> Action --> Dispatch --> Reducers --> State

  Redux Project Structure:
  /src
    /actions --> contains files related to action creators
    /components --> contains files related to components
    /reducers --> contains files related to reducers
    index.js --> Sets up both the react and redux sides of the app


  For more info visit:
  - https://react-redux.js.org/using-react-redux/connect-mapstate
  - https://react-redux.js.org/using-react-redux/connect-mapdispatch
*/

// TYPES
const TYPES = {
  INC: "INC",
  DEC: "DEC",
  RESET: "RESET",
};

// ACTION CREATORS returning ACTIONS
const ACTIONS = {
  inc: (step) => ({ type: TYPES.INC, payload: step }),
  dec: (step) => ({ type: TYPES.DEC, payload: step }),
  reset: () => ({ type: TYPES.RESET }),
};

// REDUCERS
const countReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case TYPES.INC:
      return { count: state.count + action.payload };
    case TYPES.DEC:
      return { count: state.count - action.payload };
    case TYPES.RESET:
      return { count: 0 };
    default:
      return state;
  }
};

// MERGE REDUCERS
const reducers = combineReducers({
  counter: countReducer,
});

// CREATE STORE
const store = createStore(reducers);

class CounterUsingDispatch extends Component {
  render() {
    const { count, dispatch } = this.props;

    return (
      <div>
        <div>Value: {count}</div>
        <button onClick={() => dispatch(ACTIONS.inc(10))}>Increment</button>
        <button onClick={() => dispatch(ACTIONS.dec(5))}>Decrement</button>
        <button onClick={() => dispatch(ACTIONS.reset())}>Reset</button>
      </div>
    );
  }
}

class CounterUsingMapStateToDispatch extends Component {
  render() {
    const { count, increment, decrement, reset } = this.props;

    return (
      <div>
        <div>Value: {count}</div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }
}

const mapStateToProps = ({ counter }) => {
  return { count: counter.count };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    increment: () => dispatch(ACTIONS.inc(10)),
    decrement: () => dispatch(ACTIONS.dec(5)),
    reset: () => dispatch(ACTIONS.reset()),
  };
};

const CounterDispatchContainer = connect(mapStateToProps)(CounterUsingDispatch);

const CounterMapDispatchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterUsingMapStateToDispatch);

const CounterApp = () => {
  return (
    <Provider store={store}>
      <CounterDispatchContainer />
      <CounterMapDispatchContainer />
    </Provider>
  );
};

export default CounterApp;
