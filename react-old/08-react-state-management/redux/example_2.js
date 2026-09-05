import { createStore } from "redux";

// Action Types
const DEPOSIT = "DEPOSIT";
const WITHDRAW = "WITHDRAW";

// Action Creators
const actions = {
  deposit: (account, amount) => ({
    type: WITHDRAW,
    payload: { account, amount },
  }),
  withdraw: (account, amount) => ({
    type: WITHDRAW,
    payload: { account, amount },
  }),
};

// Initial State
const initialState = {
  customers: [
    { account: 1, amount: 0 },
    { account: 2, amount: 0 },
    { account: 3, amount: 0 },
  ],
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT:
      return {
        ...state,
        customers: state.customers.map((customer) => {
          return customer.account === action.payload.account
            ? { ...customer, amount: customer.amount + action.payload.amount }
            : customer;
        }),
      };
    case WITHDRAW:
      return {
        ...state,
        customers: state.customers.map((customer) => {
          return customer.account === action.payload.account
            ? { ...customer, amount: customer.amount - action.payload.amount }
            : customer;
        }),
      };
    default:
      return state;
  }
};

// Store
const store = createStore(reducer, initialState);
console.log(store.getState().customers);

const { deposit, withdraw } = actions;
store.dispatch(deposit(3, 100));
store.dispatch(deposit(3, 100));
store.dispatch(deposit(3, 100));
store.dispatch(deposit(3, 100));
store.dispatch(withdraw(3, 300));

console.log(store.getState().customers);
