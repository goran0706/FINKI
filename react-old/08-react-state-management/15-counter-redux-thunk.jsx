/* eslint-disable react/prop-types */
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { useCallback, useEffect } from 'react';

// Action Types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const RESET = 'RESET';
const TODO_LOADED = 'TODO_LOADED';

// Action Creators
const increment = (step) => ({ type: INCREMENT, payload: step });
const decrement = (step) => ({ type: DECREMENT, payload: step });
const reset = () => ({ type: RESET, payload: 0 });
const todosLoaded = (todos) => ({ type: TODO_LOADED, payload: todos });
const fetchTodos = () => async (dispatch) => {
  const url = 'https://jsonplaceholder.typicode.com/todos';
  const { data } = await axios.get(url);
  dispatch(todosLoaded(data));
};

// Initial State
const initialState = { count: 0, todos: [] };

// Count Reducer
const countReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case INCREMENT:
      createStore;
      return { ...state, count: state.count + payload };
    case DECREMENT:
      return { ...state, count: state.count - payload };
    case RESET:
      return { ...state, count: payload };
    case TODO_LOADED:
      return { ...state, todos: payload };
    default:
      return state;
  }
};

// Map state to props
const mapStateToProps = (state) => ({ count: state.count, todos: state.todos });

// Map dispatch to props
const mapDispatchToProps = (dispatch) => ({
  increment: (step) => dispatch(increment(step)),
  decrement: (step) => dispatch(decrement(step)),
  reset: (value) => dispatch(reset(value)),
  fetchTodos: () => dispatch(fetchTodos()),
});

const Counter = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ increment, decrement, reset }) => (
  <div className='d-flex gap-1'>
    <button className='btn btn-primary' onClick={() => decrement(1)}>
      Decrement
    </button>
    <button className='btn btn-secondary' onClick={() => reset(0)}>
      Reset
    </button>
    <button className='btn btn-primary' onClick={() => increment(1)}>
      Increment
    </button>
  </div>
));

const CounterDisplay = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ count }) => {
  return <h1>Count is: {count}</h1>;
});

// Redux Thunk
const Todos = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ todos, fetchTodos }) => {
  const getTodos = useCallback(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  return (
    <div>
      <button className='btn btn-primary' onClick={() => fetchTodos()}>
        Refresh Todos
      </button>
      <ul>
        {todos?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
});

// Store
// const store = createStore(countReducer);
const store = createStore(countReducer, applyMiddleware(thunk));

// Redux Provider
const CounterReduxApp = () => {
  return (
    <Provider store={store}>
      <Counter />
      <CounterDisplay />
      <Todos />
    </Provider>
  );
};

export default CounterReduxApp;
