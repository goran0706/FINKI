import { useEffect, useState } from "react";

const HandlingEvents = () => {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(true);

  // click events
  const dec = () => setCount((c) => c - 1);
  const inc = () => setCount((c) => c + 1);

  // input events (multiple event handlers)
  const handleChange = (e) => setSearch(e.target.value);
  const handleBlur = () => console.log("Blurred");

  // form events
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Current count is: ${count}, Search term is: ${search}`);
  };

  useEffect(() => {
    const loadHandler = () => console.log("Page is loaded!");
    window.addEventListener("load", loadHandler);
    // run clean-up function... remove the event handler
    return () => window.removeEventListener("load", loadHandler);
  });

  useEffect(() => {
    const dblclick = () => alert('double clicked!');
    window.addEventListener('dblclick', dblclick);
    // Perform a clean up remove event listeners
    return () => window.removeEventListener('dblclick', dblclick);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 3000);
    // Perform a clean up remove event listeners
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <h1>Handling Events</h1>
      <div>
        <h2>Handling click events</h2>
        <p>Count is: {count}</p>
        <div>
          <button onClick={dec}>-</button>
          <button onClick={inc}>+</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>Handling form events</h2>
        <div>
          <label htmlFor="search">Search</label>
          <input type="search" value={search} onChange={handleChange} onBlur={handleBlur}/>
        </div>
      </form>
      {visible && <p>Is visible: {visible}</p>}
    </div>
  );
};

export default HandlingEvents;
