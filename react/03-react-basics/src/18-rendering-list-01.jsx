import { useState } from "react";

const fruitsBasket = [
  { id: "apple", value: "🍎 apple" },
  { id: "orange", value: "🍊 orange" },
  { id: "grape", value: "🍇 grape" },
];

function App() {
  const [fruits, setFruits] = useState(fruitsBasket);
  const newFruit = { id: "pear", value: "🍐 pear" };

  const addFruit = () => setFruits([...fruits, newFruit]);
  const removeFruit = (id) => setFruits(fruits.filter((f) => f.id !== id));

  return (
    <div>
      <button onClick={addFruit}>Add</button>
      <ul>
        {fruits.map(({ id, value }) => (
          <li key={id}>
            <p>{value}</p>
            <button onClick={() => removeFruit(id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
