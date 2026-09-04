#include <cstring>
#include <iostream>
using namespace std;

class Pizza {
protected:
  char name[20];
  char ing[100];
  float price;

public:
  Pizza(const char *name = "", const char *ing = "", const float price = 0) {
    strcpy(this->name, name);
    strcpy(this->ing, ing);
    this->price = price;
  }

  Pizza(const Pizza &p) {
    strcpy(this->name, p.name);
    strcpy(this->ing, p.ing);
    this->price = p.price;
  }

  Pizza &operator=(const Pizza &p) {
    if (this != &p) {
      strcpy(this->name, p.name);
      strcpy(this->ing, p.ing);
      this->price = p.price;
    }
    return *this;
  }

  ~Pizza() {
  }

  virtual float Price() const = 0;

  virtual bool operator<(const Pizza &p) =0;

  float getPrice() const {
    return Price();
  }

  virtual void print(ostream &os) const = 0;

  friend ostream &operator<<(ostream &os, const Pizza &p) {
    p.print(os);
    return os;
  }
};

enum Size {
  small, large, family
};

class FlatPizza : public Pizza {
private:
  Size size;

public:
  FlatPizza(const char *name = "", const char *ing = "", const float price = 0, Size size = small) : Pizza(
    name, ing, price) {
    this->size = size;
  }

  FlatPizza(const FlatPizza &p) : Pizza(p) {
    this->size = p.size;
  }

  FlatPizza &operator=(const FlatPizza &p) {
    if (this != &p) {
      Pizza::operator=(p);
      this->size = p.size;
    }
    return *this;
  }

  ~FlatPizza() {
  }

  float Price() const {
    if (this->size == small) {
      return this->price * 1.1;
    } else if (this->size == large) {
      return this->price * 1.2;
    } else if (this->size == family) {
      return this->price * 1.3;
    }
  }

  void print(ostream &os) const override {
    os << name << ": " << ing << ", ";
    if (size == small) {
      os << "small";
    } else if (size == large) {
      os << "large";
    } else if (size == family) {
      os << "family";
    }
    os << " - " << Price();
    os << endl;
  }

  bool operator<(const Pizza &p) override {
    return Price() < p.getPrice();
  }
};

class FoldedPizza : public Pizza {
private:
  bool flover;

public:
  FoldedPizza(const char *name = "", const char *ing = "", const float price = 0, bool flover = true) : Pizza(
    name, ing, price) {
    this->flover = flover;
  }

  FoldedPizza(const FoldedPizza &p) : Pizza(p) {
    this->flover = p.flover;
  }

  FoldedPizza &operator=(const FoldedPizza &p) {
    if (this != &p) {
      Pizza::operator=(p);
      this->flover = p.flover;
    }
    return *this;
  }

  ~FoldedPizza() {
  }

  float Price() const {
    if (flover == true) {
      return price * 1.1;
    } else {
      return price * 1.3;
    }
  }

  void print(ostream &os) const override {
    os << name << ": " << ing << ", ";
    if (flover) {
      os << "wf";
    } else {
      os << "nwf";
    }
    os << " - " << Price();
    os << endl;
  }

  bool operator<(const Pizza &p) override {
    return Price() < p.getPrice();
  }

  void setWhiteFlour(bool f) {
    this->flover = f;
  }
};

void expensivePizza(Pizza **array, int n) {
  float maxPrice = 0;
  int index = 0;
  for (int i = 0; i < n; i++) {
    if (array[i]->Price() > maxPrice) {
      maxPrice = array[i]->Price();
      index = i;
    }
  }
  cout << *array[index] << endl;
}

int main() {
  int test_case;
  char name[20];
  char ingredients[100];
  float inPrice;
  Size size;
  bool whiteFlour;

  cin >> test_case;
  if (test_case == 1) {
    // Test Case FlatPizza - Constructor, operator <<, price
    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    FlatPizza fp(name, ingredients, inPrice);
    cout << fp;
  } else if (test_case == 2) {
    // Test Case FlatPizza - Constructor, operator <<, price
    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    int s;
    cin >> s;
    FlatPizza fp(name, ingredients, inPrice, (Size) s);
    cout << fp;
  } else if (test_case == 3) {
    // Test Case FoldedPizza - Constructor, operator <<, price
    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    FoldedPizza fp(name, ingredients, inPrice);
    cout << fp;
  } else if (test_case == 4) {
    // Test Case FoldedPizza - Constructor, operator <<, price
    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    FoldedPizza fp(name, ingredients, inPrice);
    fp.setWhiteFlour(false);
    cout << fp;
  } else if (test_case == 5) {
    // Test Cast - operator <, price
    int s;

    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    cin >> s;
    FlatPizza *fp1 = new FlatPizza(name, ingredients, inPrice, (Size) s);
    cout << *fp1;

    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    cin >> s;
    FlatPizza *fp2 = new FlatPizza(name, ingredients, inPrice, (Size) s);
    cout << *fp2;

    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    FoldedPizza *fp3 = new FoldedPizza(name, ingredients, inPrice);
    cout << *fp3;

    cin.get();
    cin.getline(name, 20);
    cin.getline(ingredients, 100);
    cin >> inPrice;
    FoldedPizza *fp4 = new FoldedPizza(name, ingredients, inPrice);
    fp4->setWhiteFlour(false);
    cout << *fp4;

    cout << "Lower price: " << endl;
    if (*fp1 < *fp2)
      cout << fp1->Price() << endl;
    else cout << fp2->Price() << endl;

    if (*fp1 < *fp3)
      cout << fp1->Price() << endl;
    else cout << fp3->Price() << endl;

    if (*fp4 < *fp2)
      cout << fp4->Price() << endl;
    else cout << fp2->Price() << endl;

    if (*fp3 < *fp4)
      cout << fp3->Price() << endl;
    else cout << fp4->Price() << endl;
  } else if (test_case == 6) {
    // Test Cast - expensivePizza
    int num_p;
    int pizza_type;

    cin >> num_p;
    Pizza **pi = new Pizza *[num_p];
    for (int j = 0; j < num_p; ++j) {
      cin >> pizza_type;
      if (pizza_type == 1) {
        cin.get();
        cin.getline(name, 20);

        cin.getline(ingredients, 100);
        cin >> inPrice;
        int s;
        cin >> s;
        FlatPizza *fp = new FlatPizza(name, ingredients, inPrice, (Size) s);
        cout << (*fp);
        pi[j] = fp;
      }
      if (pizza_type == 2) {
        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FoldedPizza *fp =
            new FoldedPizza(name, ingredients, inPrice);
        if (j % 2)
          (*fp).setWhiteFlour(false);
        cout << (*fp);
        pi[j] = fp;
      }
    }

    cout << endl;
    cout << "The most expensive pizza:\n";
    expensivePizza(pi, num_p);
  }
  return 0;
}
