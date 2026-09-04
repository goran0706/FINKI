import { dogsSlice } from '../features/dogs/dogsSlice'
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [dogsSlice.reducerPath]: dogsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(dogsSlice.middleware)
  },
})

export type RootState = ReturnType<typeof store.getState> // Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch // Inferred type: {counter: CounterState, dogs: DogsState}
