/* eslint-disable react/prop-types */
const RegularList = ({ items }) => {
  return items.map((item) => <Product key={item.id} product={item} />);
};

const ListRenderProps = ({ items, render }) => {
  return items.map(render);
};

const Product = ({ product }) => {
  return (
    <div>
      <div>Product ID: {product.id}</div>
      <div>Product name: {product.productName}</div>
    </div>
  );
};

const User = ({ user }) => {
  return (
    <div>
      <div>User ID: {user.id}</div>
      <div>Username: {user.username}</div>
    </div>
  );
};

export { ListRenderProps, Product, RegularList, User };
