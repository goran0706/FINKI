import styled from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const Stack = styled.div`
  display: grid;
  gap: ${(props) => spacingMap[props.gutter] ?? spacingMap.lg};
`;

const StackApp = () => {
  return (
    <Stack gutter="xl">
      <Stack gutter="md">
        <h2>Subscribe</h2>
        <p>Subscribe to our newsletter to keep up to date</p>
      </Stack>
      <Stack>
        <Stack gutter="sm">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" />
        </Stack>
        <Stack gutter="sm">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </Stack>
        <button>Subscribe</button>
      </Stack>
    </Stack>
  );
};

export default StackApp;
