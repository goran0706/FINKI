import './App.css'
import { Counter } from './features/counter/Counter'
import { Dogs } from './features/dogs/Dogs'

function App() {
  return (
    <div className='App'>
      <h1>Vite + React + Redux-Toolkit</h1>
      <Counter />
      <Dogs />
    </div>
  )
}

export default App
