import { ReactNode } from "react";

type Props<Data> = {
  data: Data[];
  renderItem?: (item: Data) => ReactNode;
} & React.ComponentPropsWithoutRef<"ul">;

export function RenderProps<Data>({ data, renderItem }: Props<Data>) {
  return (
    <ul>
      {data.map((item) => {
        if (renderItem) {
          return renderItem(item);
        }
      })}
    </ul>
  );
}

export default RenderProps;
