// Define class Pasta that has info for:
//
// name (dynamically allocated array of characters),
// price (float),
// discount (integer in percents) initial value 0.
// calories (integer)
//
// In the class implement:
//
// needed constructors and destructors (see the usage in the main function) (5 points)
//
// method print() for printing the data on the OS in the following format:
//
// name calories price (price on discount)
//
// – part in the price on discount is printed only if the pasta has discount (the value of discount is larger than zero) (5 points)
// method dby5() for decreasing the discount for 5% (5 points)
// method light() - from pasta is subtracted integer of calories, the name of the new pasta wet by concatenating Light to the old name, calories are subtracted for the passed value, and the price is decreased by 20%. (10 points)
// method void setDiscount(int discount) that can change the value of the discount. (10 points)
// method void setName(char* name) that changes the name of the pasta. (5 points)
//
// Create class ItalianRestaurant that has:
//
// name (max of 50 chars)
// dynamically allocated array of objects from class Pasta
// number of pasta (integer).
//
// Implement in the class:
//
// needed constructors and destructors (see the usage in the main function)
// method add(Pasta& p) for adding new object from class Pasta in the array (10 points)
// method print() for printing a list of all pasta in the restaurant. First is printed the name of the restaurant, and then all pasta in new lines. (5 points)
// method void setPasta(int i, Pasta &p) that changes the pasta at index i in the array with pasta object p (5 points)
//
// For example:
// Input 	Result
//
// 3
// Gino
// 3
// Bolognese
// 200
// 493
// Carbonara
// 220
// 307
// QuatroFormagi
// 300
// 375
//
//
//
// ====== TESTING Italian Restaurant ======
// CONSTRUCTOR
// Add
// Gino
// Bolognese 493 200
// Carbonara 307 220
// QuatroFormagi 375 300

#include <iostream>
#include <cstring>
using namespace std;

class Pasta {
private:
    char *name;
    float price;
    int discount;
    int calories;

    void copy(const Pasta &c) {
        name = new char[strlen(c.name) + 1];
        strcpy(name, c.name);
        price = c.price;
        discount = c.discount;
        calories = c.calories;
    }

public:
    Pasta(const char *nm = "", float p = 0, int c = 0) {
        name = new char[strlen(nm) + 1];
        strcpy(name, nm);
        price = p;
        calories = c;
        discount = 0;
    }

    Pasta(const Pasta &c) {
        copy(c);
    }

    Pasta &operator=(const Pasta &c) {
        if (this == &c) return *this;
        delete [] name;
        copy(c);
        return *this;
    }

    void print() {
        cout << name << " ";
        cout << calories << " ";
        cout << price << " ";
        if (discount > 0) {
            cout << "(" << price * (100 - discount) / 100 << ")";
        }
    }

    void setName(char *n) {
        delete [] name;
        name = new char[strlen(n) + 1];
        strcpy(name, n);
    }

    void dby5() {
        discount -= 5;
    }

    Pasta light(int ca) {
        char *oldName = name;
        char *nn = new char[strlen(oldName) + 6];
        strcat(nn, oldName);
        strcat(nn, "Light");
        float nprice = price * 0.8;
        int ncalories = calories - ca;
        Pasta res(nn, nprice, ncalories);
        res.discount = 0;
        return res;
    }

    void setDiscount(int d) {
        if (d >= 0 && d <= 100)
            discount = d;
    }

    ~Pasta() {
        delete [] name;
    }
};

class ItalianRestaurant {
private:
    char name[50];
    Pasta *pasta;
    int n;

    void copy(const ItalianRestaurant &cs) {
        strcpy(name, cs.name);
        n = cs.n;
        pasta = new Pasta[n];
        for (int i = 0; i < n; ++i) {
            pasta[i] = cs.pasta[i];
        }
    }

public:
    ItalianRestaurant(char *nm) {
        strcpy(name, nm);
        pasta = NULL;
        n = 0;
    }

    ItalianRestaurant(const ItalianRestaurant &cs) {
        copy(cs);
    }

    ItalianRestaurant &operator=(const ItalianRestaurant &cs) {
        if (this == &cs) return *this;
        delete [] pasta;
        copy(cs);
        return *this;
    }

    ~ItalianRestaurant() {
        delete [] pasta;
    }

    void add(Pasta &c) {
        Pasta *tmp = pasta;
        pasta = new Pasta[n + 1];
        for (int i = 0; i < n; ++i) {
            pasta[i] = tmp[i];
        }
        pasta[n] = c;
        ++n;
        delete [] tmp;
    }

    void print() {
        cout << name << endl;
        for (int i = 0; i < n; ++i) {
            pasta[i].print();
            cout << endl;
        }
    }

    void setPasta(int i, Pasta &c) {
        pasta[i] = c;
    }
};

int main() {
    char name[100];
    float price;
    int discount;
    int calories;

    int testCase;

    cin >> testCase;

    if (testCase == 1) {
        cout << "====== TESTING Pasta CLASS ======" << endl;
        cin >> name;
        cin >> price;
        cin >> discount;
        cin >> calories;
        cout << "CONSTRUCTOR" << endl;
        Pasta c1(name, price, calories);
        c1.setDiscount(discount);
        cin >> name;
        cin >> price;
        cin >> discount;
        cin >> calories;
        Pasta c2(name, price, calories);
        c2.setDiscount(discount);
        cout << "Print" << endl;
        c1.print();
        cout << endl;
        c2.print();
        cout << endl;
        cout << "Decrease by 5" << endl;
        c1.dby5();
        c1.print();
        cout << endl;
        cout << "Calories" << endl;
        int ca;
        cin >> ca;
        Pasta c3 = c1.light(ca);
        c3.print();
        cout << endl;
    } else if (testCase == 2) {
        cout << "====== TESTING Pasta CONSTRUCTORS ======" << endl;
        cin >> name;
        cin >> price;
        cin >> discount;
        cin >> calories;
        cout << "CONSTRUCTOR" << endl;
        Pasta c1(name, price, calories);
        c1.print();
        cout << endl;
        cout << "COPY CONSTRUCTOR" << endl;
        Pasta c2(c1);
        cin >> name;
        c2.setName(name);
        c1.print();
        cout << endl;
        c2.print();
        cout << endl;
        cout << "OPERATOR =" << endl;
        c1 = c2;
        cin >> name;
        c2.setName(name);
        c1.print();
        cout << endl;
        c2.print();
        cout << endl;
    } else if (testCase == 3) {
        cout << "====== TESTING Italian Restaurant ======" << endl;
        char csName[50];
        cin >> csName;
        cout << "CONSTRUCTOR" << endl;
        ItalianRestaurant cs(csName);
        int n;
        cin >> n;
        cout << "Add" << endl;
        for (int i = 0; i < n; ++i) {
            cin >> name;
            cin >> price;
            cin >> calories;
            Pasta c(name, price, calories);
            cs.add(c);
        }
        cs.print();
        cout << endl;
    } else if (testCase == 4) {
        cout << "====== TESTING Italian Restaurant CONSTRUCTORS ======" << endl;
        char csName[50];
        cin >> csName;
        ItalianRestaurant cs(csName);
        int n;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            cin >> name;
            cin >> price;
            cin >> calories;
            Pasta c(name, price, calories);
            cs.add(c);
        }
        Pasta x("Funghi", 260, 275);
        ItalianRestaurant cp = cs;
        cs.setPasta(0, x);
        cs.print();
        cout << endl;
        cp.print();
        cout << endl;
    }


    return 0;
}
