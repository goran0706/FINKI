#include <iostream>
#include <cstring>
using namespace std;

enum typeC {
  standard, loyal, vip
};

class Customer {
protected:
  char name[50];
  char email[50];
  typeC type;
  static int discount;
  static int addedDiscount;
  int userDiscount;
  int number;

public:
  Customer(const char *name = "", const char *email = "", typeC type = standard, int number = 0) {
    strcpy(this->name, name);
    strcpy(this->email, email);
    this->type = type;
    this->number = number;
    // if (this->type == loyal) {
    //   this->userDiscount = discount;
    // }
    // else if (this->type == vip) {
    //   this->userDiscount = addedDiscount + discount;
    // }
    this->userDiscount = 0;
  }

  Customer(const Customer &other) {
    strcpy(this->name, other.name);
    strcpy(this->email, other.email);
    this->type = other.type;
    this->number = other.number;
    this->userDiscount = other.userDiscount;
  }

  Customer &operator=(const Customer &other) {
    if (this != &other) {
      strcpy(this->name, other.name);
      strcpy(this->email, other.email);
      this->type = other.type;
      this->number = other.number;
      this->userDiscount = other.userDiscount;
    }
    return *this;
  }

  ~Customer() {
  }

  friend ostream &operator<<(ostream &os, Customer &customer) {
    os << customer.name << endl;
    os << customer.email << endl;
    os << customer.number << endl;
    if (customer.type == standard) {
      os << "standard ";
    } else if (customer.type == vip) {
      os << "vip ";
      customer.userDiscount = discount + addedDiscount;
    } else if (customer.type == loyal) {
      os << "loyal ";
      customer.userDiscount = discount;
    }
    os << customer.userDiscount << endl;
    return os;
  }

  void setDiscount1(int n) {
    Customer::discount = n;
  }

  void setDiscount2(int n) {
    Customer::addedDiscount = n;
  }

  const char *getEmail() const {
    return email;
  }

  typeC getType() const {
    return type;
  }

  int getNumber() const {
    return number;
  }

  void setType(typeC t) {
    type = t;
  }
};

int Customer::discount = 10;
int Customer::addedDiscount = 20;

class UserExistsException : exception {
private:
  char message[100];

public:
  UserExistsException(const char *message = "") {
    strcpy(this->message, message);
  }

  void print() {
    cout << message << endl;
  }
};

class FINKI_bookstore {
private:
  Customer *array;
  int n;

public:
  FINKI_bookstore(Customer *array = nullptr, int n = 0) {
    this->n = n;
    this->array = new Customer[n];
    for (int i = 0; i < n; i++) {
      if (array) {
        this->array[i] = array[i];
      } else {
        this->array[i] = Customer();
      }
    }
  }

  FINKI_bookstore(const FINKI_bookstore &other) {
    this->n = other.n;
    this->array = new Customer[n];
    for (int i = 0; i < n; i++) {
      this->array[i] = other.array[i];
    }
  }

  FINKI_bookstore &operator=(const FINKI_bookstore &other) {
    if (this != &other) {
      delete [] this->array;
      this->n = other.n;
      this->array = new Customer[n];
      for (int i = 0; i < n; i++) {
        this->array[i] = other.array[i];
      }
    }
    return *this;
  }

  ~FINKI_bookstore() {
    delete[] this->array;
  }

  FINKI_bookstore &operator +=(const Customer &other) {
    for (int i = 0; i < n; i++) {
      if (strcmp(array[i].getEmail(), other.getEmail()) == 0) {
        throw UserExistsException("The user already exists in the list!");
      }
    }
    Customer *temp = new Customer[n + 1];
    for (int i = 0; i < n; i++) {
      temp[i] = array[i];
    }
    temp[n] = other;
    n++;
    delete[] array;
    array = temp;
    return *this;
  }

  void update() {
    for (int i = 0; i < n; i++) {
      if (array[i].getType() == standard && array[i].getNumber() > 5) {
        array[i].setType(loyal);
      } else if (array[i].getType() == loyal && array[i].getNumber() > 10) {
        array[i].setType(vip);
      }
    }
  }

  friend ostream &operator<<(ostream &os, const FINKI_bookstore &f) {
    for (int i = 0; i < f.n; i++) {
      cout << f.array[i];
    }
    return os;
  }

  void setCustomers(Customer *ar, int num) {
    this->array = new Customer[num];
    this->n = num;
    for (int i = 0; i < num; i++) {
      this->array[i] = ar[i];
    }
  }
};

int main() {
  int testCase;
  cin >> testCase;

  char name[50];
  char email[50];
  int tC;
  int discount;
  int numProducts;


  if (testCase == 1) {
    cout << "===== Test Case - Customer Class ======" << endl;
    cin.get();
    cin.getline(name, 50);
    cin.getline(email, 50);
    cin >> tC;
    cin >> numProducts;
    cout << "===== CONSTRUCTOR ======" << endl;
    Customer c(name, email, (typeC) tC, numProducts);
    cout << c;
  }

  if (testCase == 2) {
    cout << "===== Test Case - Static Members ======" << endl;
    cin.get();
    cin.getline(name, 50);
    cin.getline(email, 50);
    cin >> tC;
    cin >> numProducts;
    cout << "===== CONSTRUCTOR ======" << endl;
    Customer c(name, email, (typeC) tC, numProducts);
    cout << c;

    c.setDiscount1(5);

    cout << c;
  }

  if (testCase == 3) {
    cout << "===== Test Case - FINKI-bookstore ======" << endl;
    FINKI_bookstore fc;
    int n;
    cin >> n;
    Customer customers[50];
    for (int i = 0; i < n; ++i) {
      cin.get();
      cin.getline(name, 50);
      cin.getline(email, 50);
      cin >> tC;
      cin >> numProducts;
      Customer c(name, email, (typeC) tC, numProducts);
      customers[i] = c;
    }

    fc.setCustomers(customers, n);

    cout << fc << endl;
  }

  if (testCase == 4) {
    cout << "===== Test Case - operator+= ======" << endl;
    FINKI_bookstore fc;
    int n;
    cin >> n;
    Customer customers[50];
    for (int i = 0; i < n; ++i) {
      cin.get();
      cin.getline(name, 50);
      cin.getline(email, 50);
      cin >> tC;
      cin >> numProducts;
      Customer c(name, email, (typeC) tC, numProducts);
      customers[i] = c;
    }

    fc.setCustomers(customers, n);
    cout << "OPERATOR +=" << endl;
    cin.get();
    cin.getline(name, 50);
    cin.getline(email, 50);
    cin >> tC;
    cin >> numProducts;
    Customer c(name, email, (typeC) tC, numProducts);
    try {
      fc += c;
    } catch (UserExistsException &e) {
      e.print();
    }

    cout << fc;
  }

  if (testCase == 5) {
    cout << "===== Test Case - operator+= (exception) ======" << endl;
    FINKI_bookstore fc;
    int n;
    cin >> n;
    Customer customers[50];
    for (int i = 0; i < n; ++i) {
      cin.get();
      cin.getline(name, 50);
      cin.getline(email, 50);
      cin >> tC;
      cin >> numProducts;
      Customer c(name, email, (typeC) tC, numProducts);
      customers[i] = c;
    }

    fc.setCustomers(customers, n);
    cout << "OPERATOR +=" << endl;
    cin.get();
    cin.getline(name, 50);
    cin.getline(email, 50);
    cin >> tC;
    cin >> numProducts;
    Customer c(name, email, (typeC) tC, numProducts);
    try {
      fc += c;
    } catch (UserExistsException &e) {
      e.print();
    }

    cout << fc;
  }

  if (testCase == 6) {
    cout << "===== Test Case - update method  ======" << endl << endl;
    FINKI_bookstore fc;
    int n;
    cin >> n;
    Customer customers[50];
    for (int i = 0; i < n; ++i) {
      cin.get();
      cin.getline(name, 50);
      cin.getline(email, 50);
      cin >> tC;
      cin >> numProducts;
      Customer c(name, email, (typeC) tC, numProducts);
      customers[i] = c;
    }

    fc.setCustomers(customers, n);

    cout << "Update:" << endl;
    fc.update();
    cout << fc;
  }
  return 0;
}
