import styled from "styled-components";
import { InlineCluster } from "../spacers/InlineCluster";
import { Stack } from "../spacers/Stack";
import { Button } from "./Button";
import { PadBox } from "./PadBox";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const Cover = styled.div.attrs(({ children, top, bottom }) => {
  return {
    children: (
      <>
        {top && <div>{top}</div>}
        <div data-cover-child>{children}</div>
        {bottom && <div>{bottom}</div>}
      </>
    ),
  };
})`
  display: grid;
  gap: ${(props) => spacingMap[props.gutter] ?? spacingMap.lg};
  min-block-size: ${(props) => props.minHeight ?? "100vh"};
  grid-template-rows: ${({ top, bottom }) =>
    top && bottom
      ? "auto 1fr auto"
      : top
      ? "auto 1fr"
      : bottom
      ? "1fr auto"
      : "1fr"};

  > [data-cover-child] {
    align-self: center;
  }
`;

const CoverApp = () => {
  return (
    <Cover
      as={PadBox}
      padding="lg"
      top={
        <InlineCluster gutter="xl" justify="end">
          <div>Home</div>
          <div>Blog</div>
          <div>About</div>
          <div>Contact</div>
        </InlineCluster>
      }
      bottom={
        <InlineCluster gutter="lg" justify="center">
          <a href="/#">Keep scrolling</a>
        </InlineCluster>
      }
    >
      <Stack>
        <h1>Heading</h1>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae tempore
          voluptas nulla suscipit consequuntur voluptate neque dolor repudiandae
          corporis eius tenetur eaque incidunt explicabo, pariatur harum unde
          dicta dolores reiciendis.
        </span>
        <InlineCluster gutter="lg">
          <Button>Get started</Button>
          <Button>Sign In</Button>
        </InlineCluster>
      </Stack>
    </Cover>
  );
};

export default CoverApp;
