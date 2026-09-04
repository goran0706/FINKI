import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { decrement, increment, incrementByAmount, incrementAsync, reset } from './counterSlice'

export function Counter() {
  const [incrementAmount, setIncrementAmount] = useState<number>(0)

  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  const handleReset = () => dispatch(reset())
  const handleDecrement = () => dispatch(decrement())
  const handleIncrement = () => dispatch(increment())

  const handleIncrementByAmount = () => dispatch(incrementByAmount(incrementAmount))
  const handleIncrementAsync = () => dispatch(incrementAsync(incrementAmount))

  return (
    <div className='card'>
      <p>Count is: {count}</p>
      <div>
        <label htmlFor='incrementAmount'>Set increment amount:</label>
        <input
          type='number'
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
        />
      </div>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleIncrementByAmount}>Increment By {incrementAmount}</button>
      <button onClick={handleIncrementAsync}>Increment Async {incrementAmount}</button>
    </div>
  )
}
