#include <cstring>
#include <iostream>
#define MAX 100
using namespace std;

enum typeC { standard, loayal, vip };

class UserExistsException {
public:
    void message() {
        cout << "The user already exists in the list!" << endl;
    }
};

class Customer {
protected:
    char name[MAX];
    char email[MAX];
    typeC type;
    static int baseDiscount;
    static int plusDiscount;
    int products;

public:
    Customer() {
        *name = '\0';
        *email = '\0';
        type = standard;
        products = 0;
    }

    Customer(char *name, char *email, typeC type, int product) {
        strcpy(this->name, name);
        strcpy(this->email, email);
        this->type = type;
        this->products = product;
    }

    static int setDiscount1(int d) {
        baseDiscount = d;
    }

    friend ostream &operator <<(ostream &out, const Customer &c) {
        out << c.name << endl;
        out << c.email << endl;
        out << c.products << endl;
        if (c.type == standard) {
            out << "standard 0";
        } else if (c.type == loayal) {
            out << "loyal " << c.baseDiscount;
        } else if (c.type == vip) {
            out << "vip " << c.plusDiscount + c.baseDiscount;
        }
        return out;
    }

    void update() {
        if (type == standard && products > 5) {
            type = loayal;
        } else if (type == loayal && products > 10) {
            type = vip;
        }
    }

    const char *getEmail() const {
        return email;
    }
};

int Customer::baseDiscount = 10;
int Customer::plusDiscount = 20;

class FINKI_bookstore {
private:
    Customer *customers;
    int n;

public:
    FINKI_bookstore() {
        this->n = 0;
        this->customers = new Customer[0];
    }

    FINKI_bookstore(const FINKI_bookstore &f) {
        this->n = f.n;
        this->customers = new Customer[f.n];
        for (int i = 0; i < f.n; ++i) {
            this->customers[i] = f.customers[i];
        }
    }

    FINKI_bookstore &operator =(const FINKI_bookstore &f) {
        if (this != &f) {
            this->n = f.n;
            this->customers = new Customer[f.n];
            for (int i = 0; i < f.n; ++i) {
                this->customers[i] = f.customers[i];
            }
        }
        return *this;
    }

    ~FINKI_bookstore() {
        delete[]customers;
    }

    void setCustomers(Customer *c, int br) {
        this->customers = new Customer[br];
        this->n = br;
        for (int i = 0; i < br; ++i) {
            this->customers[i] = c[i];
        }
    }

    void update() {
        for (int i = 0; i < n; ++i) {
            customers[i].update();
        }
    }

    FINKI_bookstore &operator +=(const Customer &c) {
        for (int i = 0; i < n; ++i) {
            if (strcmp(customers[i].getEmail(), c.getEmail()) == 0) {
                throw UserExistsException();
            }
        }
        Customer *tmp = new Customer[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = customers[i];
        }
        tmp[n++] = c;
        delete[]customers;
        customers = tmp;
        return *this;
    }

    friend ostream &operator <<(ostream &out, const FINKI_bookstore &f) {
        for (int i = 0; i < f.n; ++i) {
            out << f.customers[i] << endl;
        }
        return out;
    }
};

int main() {
    int testCase;
    cin >> testCase;

    char name[MAX];
    char email[MAX];
    int tC;
    int discount;
    int numProducts;


    if (testCase == 1) {
        cout << "===== Test Case - Customer Class ======" << endl;
        cin.get();
        cin.getline(name,MAX);
        cin.getline(email,MAX);
        cin >> tC;
        cin >> numProducts;
        cout << "===== CONSTRUCTOR ======" << endl;
        Customer c(name, email, (typeC) tC, numProducts);
        cout << c;
    }

    if (testCase == 2) {
        cout << "===== Test Case - Static Members ======" << endl;
        cin.get();
        cin.getline(name,MAX);
        cin.getline(email,MAX);
        cin >> tC;
        cin >> numProducts;
        cout << "===== CONSTRUCTOR ======" << endl;
        Customer c(name, email, (typeC) tC, numProducts);
        cout << c << endl;


        c.setDiscount1(5);

        cout << c;
    }

    if (testCase == 3) {
        cout << "===== Test Case - FINKI-bookstore ======" << endl;
        FINKI_bookstore fc;
        int n;
        cin >> n;
        Customer customers[MAX];
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name,MAX);
            cin.getline(email,MAX);
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
        Customer customers[MAX];
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name,MAX);
            cin.getline(email,MAX);
            cin >> tC;
            cin >> numProducts;
            Customer c(name, email, (typeC) tC, numProducts);
            customers[i] = c;
        }

        fc.setCustomers(customers, n);
        cout << "OPERATOR +=" << endl;
        cin.get();
        cin.getline(name,MAX);
        cin.getline(email,MAX);
        cin >> tC;
        cin >> numProducts;
        Customer c(name, email, (typeC) tC, numProducts);
        fc += c;

        cout << fc;
    }

    if (testCase == 5) {
        cout << "===== Test Case - operator+= (exception) ======" << endl;
        FINKI_bookstore fc;
        int n;
        cin >> n;
        Customer customers[MAX];
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name,MAX);
            cin.getline(email,MAX);
            cin >> tC;
            cin >> numProducts;
            Customer c(name, email, (typeC) tC, numProducts);
            customers[i] = c;
        }

        fc.setCustomers(customers, n);
        cout << "OPERATOR +=" << endl;
        cin.get();
        cin.getline(name,MAX);
        cin.getline(email,MAX);
        cin >> tC;
        cin >> numProducts;

        Customer c(name, email, (typeC) tC, numProducts);
        try {
            fc += c;
        } catch (UserExistsException e) {
            e.message();
        }

        cout << fc;
    }

    if (testCase == 6) {
        cout << "===== Test Case - update method  ======" << endl << endl;
        FINKI_bookstore fc;
        int n;
        cin >> n;
        Customer customers[MAX];
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name,MAX);
            cin.getline(email,MAX);
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
