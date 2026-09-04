import styled from "styled-components";

const Container = styled.div`
  width: 480px;
  margin: 0 auto;
  background-color: bisque;
  border: 2px solid gray;
  border-radius: 6px;
`;

const Title = styled.h1`
  color: blueviolet;
`;

const CssInJs = () => {
  return (
    <Container>
      <Title>CSS</Title>
    </Container>
  );
};

export default CssInJs;
