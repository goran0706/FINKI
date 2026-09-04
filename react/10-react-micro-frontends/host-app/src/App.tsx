import { useState } from "react";
import "./App.css";

import Count from "app_one/Count";
import Footer from "app_one/Footer";
import Header from "app_one/Header";
import List from "app_two/List";

function App() {
  const [count, setCount] = useState(0);
  const changeBy = (n: number) => setCount((prev) => prev + n);

  const fruits = ["Apple", "Banana", "Orange"];
  const renderFruit = (fruit: string) => <p>Fruit: {fruit}</p>;

  return (
    <div>
      <div>
        <Header>Header Application 1</Header>
        <Count count={count} changeBy={changeBy} />
        <Footer>Footer Application 1</Footer>
      </div>
      <div>
        <List items={fruits} renderItems={renderFruit} />
      </div>
    </div>
  );
}

export default App;
