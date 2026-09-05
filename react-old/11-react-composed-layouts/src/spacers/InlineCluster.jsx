import styled from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const justifyAlignMap = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
};

const InlineCluster = styled.div`
  --gutter: ${(props) => spacingMap[props.gutter] ?? spacingMap.lg};
  display: flex;
  flex-wrap: wrap;
  gap: var(--gutter);

  justify-content: ${(props) =>
    justifyAlignMap[props.justify] ?? justifyAlignMap.start};

  align-items: ${(props) =>
    justifyAlignMap[props.align] ?? justifyAlignMap.start};
`;

const InlineClusterApp = () => {
  return (
    <InlineCluster gutter="xl" justify="end" align="center">
      <div className="bg-success">Box 1</div>
      <div className="bg-danger">Box 2</div>
      <div className="bg-success">Box 3</div>
      <div className="bg-danger">Box 4</div>
      <div className="bg-success">Box 5</div>
      <div className="bg-danger">Box 6</div>
    </InlineCluster>
  );
};

export default InlineClusterApp;
