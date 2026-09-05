import React from "react";

const Term = () => {
  return <div>Term</div>;
};

const Description = () => {
  return <div>Description</div>;
};

const NamespacedComponent = ({ children }) => {
  return <div>{children}</div>;
};

NamespacedComponent.Term = Term;
NamespacedComponent.Description = Description;

const ExampleUsage = () => {
  return (
    <NamespacedComponent>
      <NamespacedComponent.Term />
      <NamespacedComponent.Description />
    </NamespacedComponent>
  );
};

export default NamespacedComponent;
