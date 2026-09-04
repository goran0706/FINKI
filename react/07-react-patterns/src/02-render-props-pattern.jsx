import { Fragment } from "react";

const RenderAnything = ({ render }) => {
  if (typeof render === "function") {
    return render();
  }
  return null;
};

const RenderList = ({ items, render }) => {
  return (
    <div>
      <p>Render Props Pattern - Generic List</p>
      {items.map((i) => render(i))}
    </div>
  );
};

export const DemoUsage = () => {
  return (
    <Fragment>
      <RenderAnything render={() => <h2>Render Props Pattern</h2>} />
      <RenderList items={[1, 2, 3, 4]} render={(n) => <p key={n}>{n}</p>} />
    </Fragment>
  );
};
