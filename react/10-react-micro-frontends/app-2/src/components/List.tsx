import { ReactNode } from "react";

type ListProps<T> = {
  items: T[];
  renderItems: (items: T) => ReactNode;
};

const List = <T,>({ items, renderItems }: ListProps<T>) => {
  return <div>{items.map((i) => renderItems(i))}</div>;
};

export default List;
