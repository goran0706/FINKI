import PropTypes from "prop-types";
import { useState } from "react";

const Child = ({ greet, initialText, extractText }) => {
  const [text, setText] = useState(initialText ?? "");

  const handleInputChange = (e) => {
    setText(e.target.value);
    extractText(text);
  };

  return (
    <div>
      <h1>Parent To Child Communication</h1>
      <p>{greet}</p>
      <input type="text" onChange={handleInputChange} value={text} />
    </div>
  );
};

Child.propTypes = {
  greet: PropTypes.string.isRequired,
  initialText: PropTypes.string,
  extractText: (text) => console.log(text),
};

const Parent = () => {
  const onExtractText = (text) => alert(text);
  return (
    <Child greet="Hello!" initialText="Search" extractText={onExtractText} />
  );
};

export default Parent;
