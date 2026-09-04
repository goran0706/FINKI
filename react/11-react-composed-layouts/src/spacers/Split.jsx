import styled from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const fractions = {
  "1/4": "1fr 3fr",
  "1/3": "1fr 2fr",
  "1/2": "1fr 1fr",
  "2/3": "2fr 1fr",
  "3/4": "3fr 1fr",
};

const Split = styled.div`
  display: grid;
  gap: ${({ gutter }) => spacingMap[gutter] ?? spacingMap.lg};
  grid-template-columns: ${({ fraction }) =>
    fractions[fraction] ?? fractions["1/2"]};
`;

const SplitApp = () => {
  return (
    <Split fraction="1/2" gutter="xl">
      <div className="container bg-success">Box 1</div>
      <div className="container bg-danger">Box 2</div>
    </Split>
  );
};

export default SplitApp;
