import { Fragment, useEffect, useState } from "react";

const ChildComponent = ({
  message,
  extractValue,
}: {
  message: string;
  extractValue: (value: number) => void;
}) => {
  const [value] = useState(7);

  useEffect(() => {
    extractValue(value);
  }, [extractValue, value]);

  return (
    <div>
      <h1>{message}</h1>
      <p>{value}</p>
    </div>
  );
};

const PropDrilling = () => {
  const [extractedValue, setExtractedValue] = useState(0);
  const extractValue = (value: number) => setExtractedValue(value);

  return (
    <Fragment>
      <ChildComponent message="Prop passed down" extractValue={extractValue} />
      <p>Extracted Value: {extractedValue}</p>
    </Fragment>
  );
};

export default PropDrilling;
