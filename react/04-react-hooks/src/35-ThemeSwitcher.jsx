/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

// createContext() lets you create a context that components can provide or read.
// defaultValue: The value that you want the context to have when there is no matching context provider
// in the tree above the component that reads context. If you don’t have any meaningful default value, specify null.
// The default value is meant as a “last resort” fallback. It is static and never changes over time.
const ThemeContext = createContext("light");

// Wrap your components into a context provider to specify the value of this context for all components inside:
// value: The value that you want to pass to all the components reading this context inside this provider, no matter how deep.
// The context value can be of any type.
// A component calling useContext(SomeContext) inside of the provider receives the value of the innermost corresponding context provider above it.
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const Theme = () => {
  // ✅ Recommended way
  const { theme, toggleTheme } = useContext(ThemeContext);

  // 🟡 <ThemeContext.Consumer Legacy way (not recommended)
  //   return (
  //     <ThemeContext.Consumer>
  //       {(theme) => <button className={theme} />}
  //     </ThemeContext.Consumer>
  //   );

  return (
    <div>
      <h1>{theme}</h1>
      <button className={theme} onClick={toggleTheme}>
        ToggleTheme
      </button>
    </div>
  );
};

const ThemeSwitch = () => (
  <ThemeProvider>
    <Theme />
  </ThemeProvider>
);

export default ThemeSwitch;
