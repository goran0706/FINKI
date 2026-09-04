class Product {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

class ProductItem {
  constructor(product) {
    this.product = product;
  }

  render() {
    const prodEl = document.createElement('li');
    prodEl.className = 'product-item';
    prodEl.innerHTML = `
      <p>Id: ${this.product.id}, Title: ${this.product.title}, Price: $${this.product.price}</p>
      <button>Add To Card</button>
    `;
    const addCartButton = prodEl.querySelector('button');
    addCartButton.addEventListener('click', () => Shop.addToCart(this.product));
    return prodEl;
  }
}

class ProductList {
  products = [
    new Product(0, 'JavaScript - The Complete Guide', 50),
    new Product(1, 'React.js - The Complete Guide', 50),
  ];

  render() {
    const prodList = document.getElementById('product-list');
    prodList.innerHTML = '';

    this.products.forEach(prod => {
      const productItem = new ProductItem(prod);
      const prodEl = productItem.render();
      prodList.append(prodEl);
    });
  }
}

class ShoppingCart {
  items = [];

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.items = updatedItems;
  }

  checkout() {
    const items = this.items.map(prod => '\n' + prod.title);
    alert('You bought the following products:' + items.toString());
  }

  render() {
    const shoppingCart = document.getElementById('shopping-cart');
    const shoppingList = document.getElementById('shopping-list');
    shoppingList.innerHTML = '';
    this.items.forEach(prod => {
      const productItem = new ProductItem(prod);
      const prodEl = productItem.render();
      shoppingList.append(prodEl);
    });
    const checkoutBtnEl = document.createElement('button');
    checkoutBtnEl.textContent = 'Checkout';
    checkoutBtnEl.addEventListener('click', this.checkout.bind(this));
    shoppingCart.append(checkoutBtnEl);
  }
}

class Shop {
  static cart;

  static init() {
    const prodList = new ProductList();
    prodList.render();

    this.cart = new ShoppingCart();
    this.cart.render();
  }

  static addToCart(product) {
    this.cart.addProduct(product);
  }
}

class App {
  static init() {
    Shop.init();
  }
}

App.init();
