import { styled } from "styled-components";

const spacingMap = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  xxl: "4rem",
};

const Columns = styled.div`
  --columns: ${({ columns = 1 }) => columns};
  display: grid;
  gap: ${(props) => spacingMap[props.gutter] ?? spacingMap.lg};
  grid-template-columns: repeat(var(--columns), 1fr);
`;

const Column = styled.div`
  grid-column: span min(${({ $span = 1 }) => $span}, var(--columns));
`;

const Form = () => {
  return (
    <Columns columns={6}>
      <Column $span={3}>
        <input type="text" placeholder="1" />
      </Column>
      <Column $span={3}>
        <input type="text" placeholder="2" />
      </Column>
      <Column $span={4}>
        <input type="text" placeholder="3" />
      </Column>
      <Column $span={6}>
        <input type="text" placeholder="4" />
      </Column>
      <Column $span={2}>
        <input type="text" placeholder="5" />
      </Column>
      <Column $span={2}>
        <input type="text" placeholder="6" />
      </Column>
      <Column $span={2}>
        <input type="text" placeholder="6" />
      </Column>
      <Column $span={1}>
        <input type="text" placeholder="6" />
      </Column>
      <Column $span={1}>
        <input type="text" placeholder="6" />
      </Column>
      <Column $span={1}>
        <input type="text" placeholder="6" />
      </Column>
    </Columns>
  );
};

export default Form;
