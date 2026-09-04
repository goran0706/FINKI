import styled, { css } from "styled-components";
import { InlineCluster } from "./InlineCluster";

const responsive = css`
  --switchAt: ${({ switchAt }) =>
    typeof switchAt === "string" ? switchAt : `${switchAt}px`};

  flex-wrap: wrap;

  & > * {
    min-width: fit-content;
    flex-basis: calc((var(--switchAt) - (100% - var(--gutter))) * 999);
  }
`;

const stretchMap = {
  all: `> *  { flex: 1 }`,
  start: `> :first-child { flex: 1 }`,
  end: `> :last-child { flex: 1 }`,
};

const Inline = styled(InlineCluster)`
  flex-wrap: nowrap;
  ${({ stretch }) => {
    if (typeof stretch === "number")
      return `> :nth-child(${stretch + 1}) { flex: 1 }`;

    return stretchMap[stretch] ?? "";
  }}

  ${({ switchAt }) => switchAt && responsive}
`;

const InlineApp = () => {
  return (
    <Inline stretch={1} align="center">
      <div className="bg-success">Box 1</div>
      <div className="bg-danger">Box 2</div>
      <div className="bg-success">Box 3</div>
      <div className="bg-danger">Box 4</div>
      <div className="bg-success">Box 5</div>
      <div className="bg-danger">Box 6</div>
    </Inline>
  );
};

export default InlineApp;
