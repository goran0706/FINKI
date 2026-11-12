#include "iostream"
#include "cstring"
#define MAX 100
using namespace std;

enum typeC { standard, loyal, vip };

class UserExistsException {
public:
    void message() {
        cout << "The user already exists in the list!" << endl;
    }
};

class Customer {
private:
    char name[101];
    char email[101];
    typeC tc;
    static int discount;
    static int plusDiscount;
    int numProducts;

public:
    static int setDiscount1(int d) {
        discount = d;
    }

    Customer(const char *name = "", const char *email = "", typeC tc = {}, int numProducts = 0) {
        strcpy(this->name, name);
        strcpy(this->email, email);
        this->tc = tc;
        this->numProducts = numProducts;
    }

    friend ostream &operator <<(ostream &out, const Customer &c) {
        out << c.name << endl;
        out << c.email << endl;
        out << c.numProducts << endl;
        if (c.tc == 0) {
            out << "standard 0";
        } else if (c.tc == 1) {
            out << "loyal ";
            out << c.discount;
        } else if (c.tc == 2) {
            out << "vip ";
            out << c.discount + c.plusDiscount;
        }
        return out;
    }

    void update() {
        if (tc == standard && numProducts > 5) {
            tc = loyal;
        } else if (tc == loyal && numProducts > 10) {
            tc = vip;
        }
    }

    friend class FINKI_bookstore;
};

int Customer::plusDiscount = 20;
int Customer::discount = 10;

class FINKI_bookstore {
private:
    Customer *customers;
    int n;

public:
    FINKI_bookstore(int n = 0) {
        for (int i = 0; i < n; ++i) {
            this->customers[i] = customers[i];
        }
        this->n = n;
    }

    FINKI_bookstore(const FINKI_bookstore &f) {
        for (int i = 0; i < f.n; ++i) {
            this->customers[i] = f.customers[i];
        }
        this->n = f.n;
    }

    FINKI_bookstore &operator =(const FINKI_bookstore &f) {
        if (this != &f) {
            delete[]customers;
            for (int i = 0; i < f.n; ++i) {
                this->customers[i] = f.customers[i];
            }
            this->n = f.n;
        }
        return *this;
    }

    ~FINKI_bookstore() {
        delete[]customers;
    }

    FINKI_bookstore &operator +=(const Customer &f) {
        for (int i = 0; i < n; ++i) {
            if (strcmp(customers[i].email, f.email) == 0) {
                throw UserExistsException();
            }
        }
        Customer *tmp = new Customer[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = customers[i];
        }
        tmp[n++] = f;
        delete customers;
        customers = tmp;
        return *this;
    }

    void setCustomers(Customer *c, int br) {
        this->customers = new Customer[br];
        this->n = br;
        for (int i = 0; i < n; ++i) {
            this->customers[i] = c[i];
        }
    }

    void update() {
        for (int i = 0; i < n; ++i) {
            customers[i].update();
        }
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
        cout << c;
        cout << endl;

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
