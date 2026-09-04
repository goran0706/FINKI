import { ReactNode, createContext, useContext, useState } from "react";

interface ValueContextProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const ValueContext = createContext<ValueContextProps | undefined>(undefined);

const ValueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState(100);

  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
};

const useValue = (): ValueContextProps => {
  const context = useContext(ValueContext);
  if (!context) {
    throw new Error("Must be used within a ValueProvider");
  }
  return context;
};

const DisplayValue = () => {
  const { value } = useValue();
  return <p>Value: {value}</p>;
};

const ReactContext = () => {
  return (
    <ValueProvider>
      <DisplayValue />
    </ValueProvider>
  );
};

export default ReactContext;
