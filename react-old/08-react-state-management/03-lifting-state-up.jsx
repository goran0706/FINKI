// Lifting state
import * as React from 'react';

function Name() {
  const [name, setName] = React.useState('');
  return (
    <div>
      <label htmlFor='name'>Name: </label>
      <input
        id='name'
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </div>
  );
}

function FavoriteAnimal({ animal, onAnimalChange }) {
  return (
    <div>
      <label htmlFor='animal'>Favorite Animal: </label>
      <input id='animal' value={animal} onChange={onAnimalChange} />
    </div>
  );
}

function Display({ animal }) {
  return <div>{`Your favorite animal is: ${animal}!`}</div>;
}

function App() {
  // Lifting State Up
  const [animal, setAnimal] = React.useState('');
  // Collocating State --> https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster
  // const [name, setName] = React.useState("");

  return (
    <form>
      <Name />
      <FavoriteAnimal
        animal={animal}
        onAnimalChange={(event) => setAnimal(event.target.value)}
      />
      <Display animal={animal} />
    </form>
  );
}

export default App;
