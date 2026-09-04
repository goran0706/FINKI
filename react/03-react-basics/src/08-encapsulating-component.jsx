import { Fragment } from "react";

const EncapsulatingComponent = () => {
  const fragment = true;

  // Encapsulated within the Fragment component that does not create any extra elements
  // <p>EncapsulatingComponent</p>
  // <p>This is an encapsulated component</p>
  if (fragment) {
    return (
      <Fragment>
        <p>EncapsulatingComponent</p>
        <p>This is an encapsulated component</p>
      </Fragment>
    );
  }

  // Encapsulated within the Fragment component that does not create any extra elements
  // <section>
  //   <p>EncapsulatingComponent</p>
  //   <p>This is an encapsulated component</p>
  // </section>;
  return (
    <section>
      <p>EncapsulatingComponent</p>
      <p>This is an encapsulated component</p>
    </section>
  );
};

export default EncapsulatingComponent;
