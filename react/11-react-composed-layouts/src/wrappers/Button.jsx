import styled from "styled-components";
import { PadBox } from "./PadBox";

const Button = styled(PadBox).attrs(() => ({
  as: "button",
  padding: ["sm", "xl"],
}))`
  background: black;
  color: white;
  border: none;
`;

const ButtonApp = () => {
  return <Button onClick={() => alert("clicked")}>Button or Link</Button>;
};

export default ButtonApp;
