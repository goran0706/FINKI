import React, { useState } from "react";

interface ItemProps {
  item: string;
  active: boolean;
  onClick: () => void;
}

interface ListProps {
  heading: string;
  items: string[];
  selectedIndex: number;
  onSelectedIndex: (item: number) => void;
}

const ListItem = ({ item, active, onClick }: ItemProps) => (
  <li className={`list-group-item ${active && "active"}`} onClick={onClick}>
    {item}
  </li>
);

const ListGroup = (props: ListProps) => {
  const { heading, items, selectedIndex, onSelectedIndex } = props;
  return (
    <div className="container">
      <h1>{heading}</h1>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <ListItem
            key={index}
            item={item}
            active={selectedIndex === index}
            onClick={() => onSelectedIndex(index)}
          />
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const items: string[] = ["Item 1", "Item 2", "Item 3"];

  const selected = items[selectedIndex];

  return (
    <div className="container">
      <ListGroup
        heading="List Group"
        items={items}
        selectedIndex={selectedIndex}
        onSelectedIndex={(index) => setSelectedIndex(index)}
      />
      <h2 className="my-3">Selected: {selected}</h2>
    </div>
  );
};

export default App;
