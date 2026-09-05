import styled from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const PadBox = styled.div`
  padding: ${(props) => {
    return []
      .concat(props.padding)
      .map((pad) => spacingMap[pad])
      .join(" ");
  }};
`;

const PadBoxApp = () => {
  return (
    <div className="bg-success">
      <PadBox padding={["lg", "xxl", "xl"]}>
        <div className="bg-danger">Box 2</div>
      </PadBox>
    </div>
  );
};

export default PadBoxApp;
