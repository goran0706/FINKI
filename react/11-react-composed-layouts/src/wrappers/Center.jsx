import styled from "styled-components";
import { Stack } from "../spacers/Stack";

const Center = styled.div`
  box-sizing: content-box;
  margin-inline-start: auto;
  margin-inline-end: auto;

  max-inline-size: ${({ maxWidth }) => maxWidth};

  ${(props) => props.centerText && "text-align: center;"}

  ${(props) =>
    props.centerChildren &&
    `
  display: flex;
  flex-direction: column;
  align-items: center;
  `}
`;

const CenterApp = () => {
  return (
    <Center
      as={Stack}
      gutter="xl"
      maxwidth="60ch"
      centertext="true"
      centerchildren="true"
    >
      <h2>Hello World</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis saepe
        ipsa asperiores, placeat provident in dolor adipisci et accusantium,
        natus odio, aliquid maxime iste dolorem velit! Ullam reiciendis eaque
        ipsam!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis saepe
        ipsa asperiores, placeat provident in dolor adipisci et accusantium,
        natus odio, aliquid maxime iste dolorem velit! Ullam reiciendis eaque
        ipsam!
      </p>
      <div className="container bg-success">Box</div>
    </Center>
  );
};

export default CenterApp;
