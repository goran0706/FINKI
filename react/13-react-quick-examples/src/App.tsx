import "./App.css";
import RenderProps from "./components/reusable-components/RenderProps";

const App = () => {
  return (
    <div>
      <hr />
      {/* <RouterV5 />  */}
      {/* <RouterV6 /> */}
      {/* <RouterV6Migration /> */}
      {/* <PropDrilling /> */}
      {/* <ReactContext /> */}
      {/* <Redux /> */}
      {/* <Zustand /> */}
      {/* <RestfulAPI /> */}

      {/* <SpreadingProps label="Click Me!" onClick={() => alert("Clicked!")} /> */}
      <RenderProps
        data={[
          { id: 1, name: "John" },
          { id: 2, name: "Jane" },
        ]}
        renderItem={(item) => (
          <li key={item.id}>
            <p>{item.name}</p>
          </li>
        )}
      />

      {/* <hr />
      <Alert type="info" title="Info" description="This is an info" />
      <Alert type="warning" title="Warning" description="This is a warning" />
      <Alert type="error" title="Error" description="This is an error" />

      <hr />
      <Hooks />

      <hr />
      <Css />
      <CssModules />
      <CssInJs />
      <UtilityFirstCss /> */}
    </div>
  );
};

export default App;
