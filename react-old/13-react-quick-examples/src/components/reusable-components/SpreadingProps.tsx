import { ComponentPropsWithoutRef } from "react";

type Props = {
  label: string;
} & ComponentPropsWithoutRef<"button">;

const SpreadingProps = ({ label, ...buttonProps }: Props) => {
  return <button {...buttonProps}>{label}</button>;
};

export default SpreadingProps;
