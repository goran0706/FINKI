import { Fragment } from "react";
import styled from "styled-components";

/* 
  In React we can style components in many different ways:
  - using inline styles
  - using CSS or Sass file
  - using CSS or Sass modules
  - using css-in-js (styled-components)
  - using utility-first CSS (TailwindCSS)
  - using CSS libraries (MUI, MantineUI, Chakra, AntDesign, etc...)
*/

// * 1. Inline CSS
const InlineStyles = () => (
  <div style={{ display: "flex", placeItems: "center" }}>
    <h1 style={{ color: "crimson" }}>Inline css</h1>
  </div>
);

// * 2. External CSS file
// import './index.css';
const Css = () => (
  <div className="container">
    <h1 className="heading">Css or Sass file</h1>
  </div>
);

// * 3. External CSS module file - note: modules are not default to CSS, its a library
// import './index.module.css';
const CssModule = () => (
  <div className="container">
    <h1 className="heading">Css or Sass module</h1>
  </div>
);

// * 4. CSS in JS
const CssInJs = () => {
  const Heading = styled.h1`
    color: crimson;
  `;

  const Container = styled.div`
    display: flex;
    place-items: center;
  `;

  return (
    <Container>
      <Heading>Css in JS (styled-components)</Heading>
    </Container>
  );
};

const StylingComponents = () => {
  return (
    <Fragment>
      <h1>Styling Components</h1>
      <InlineStyles />
      <Css />
      <CssModule />
      <CssInJs />
    </Fragment>
  );
};

export default StylingComponents;
