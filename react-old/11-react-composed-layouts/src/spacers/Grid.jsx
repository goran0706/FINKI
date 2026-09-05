import styled from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const Grid = styled.div`
  display: grid;
  gap: ${(props) => spacingMap[props.gutter] ?? spacingMap.lg};

  grid-template-columns: repeat(
    auto-fit,
    minmax(min(${(props) => props.minItemWidth}, 100%), 1fr)
  );
`;

const GridApp = () => {
  return (
    <Grid gutter="xl" minitemwidth="24rem">
      <div className="bg-success">Box 1</div>
      <div className="bg-danger">Box 2</div>
      <div className="bg-success">Box 3</div>
      <div className="bg-danger">Box 4</div>
      <div className="bg-success">Box 5</div>
      <div className="bg-danger">Box 6</div>
    </Grid>
  );
};

export default GridApp;
