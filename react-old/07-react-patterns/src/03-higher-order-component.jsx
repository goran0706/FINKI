/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* 
  A higher-order component (HOC) is an advanced technique in React for reusing component logic. 
  HOCs are not part of the React API, per se. They are a pattern that emerges from React’s compositional nature.

  Concretely, a higher-order component is a function that takes a component and returns a new component.

  Steps:

  1. Write the logic you want to reuse into a component
  2. Create a HOC file and add the HOC scaffold
  3. Move the reusable logic into the HOC
  4. Pass props/config/behavior through to child component
*/

const WrappedComponent = ({ title }) => <p>{title}</p>;
const higherOrderComponent = (Comp, title) => () => <Comp title={title} />;
const EnhancedComponent = higherOrderComponent(WrappedComponent, "Title");

export default EnhancedComponent;
