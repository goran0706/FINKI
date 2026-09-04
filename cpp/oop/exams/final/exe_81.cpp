#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class except : exception {
private:
    char message[100];
    int discount;

public:
    except(const char *msg = "", int discount = 0) {
        strcpy(message, msg);
        this->discount = discount;
    }

    void print() {
        cout << message << discount << endl;
    }
};

class IceCream {
private:
    char *name;
    char ingredients[100];
    float price;
    int discount;

public:
    IceCream(const char *name = "", const char *ingredients = "", float price = 0) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        strcpy(this->ingredients, ingredients);
        this->price = price;
        this->discount = 0;
    }

    IceCream(const IceCream &other) {
        this->name = new char [strlen(other.name) + 1];
        strcpy(this->name, other.name);
        strcpy(this->ingredients, other.ingredients);
        this->price = other.price;
        this->discount = other.discount;
    }

    IceCream &operator=(const IceCream &other) {
        if (this != &other) {
            delete [] this->name;
            this->name = new char [strlen(other.name) + 1];
            strcpy(this->name, other.name);
            strcpy(this->ingredients, other.ingredients);
            this->price = other.price;
            this->discount = other.discount;
        }
        return *this;
    }

    ~IceCream() {
        delete [] this->name;
    }

    //name: ingredients price [discounted price]

    friend ostream &operator <<(ostream &os, const IceCream &icc) {
        float discountPrice = icc.price - ((icc.price / 100) * icc.discount);
        os << icc.name << ": " << icc.ingredients << " " << icc.price;
        if (icc.discount > 0) {
            os << " (" << discountPrice << ")";
        }
        return os;
    }

    IceCream &operator++() {
        this->discount = this->discount + 5;
        return *this;
    }

    IceCream &operator +(char *array) {
        char temp[strlen(name) + strlen(array) + 4];
        strcpy(temp, name);
        strcat(temp, " + ");
        strcat(temp, array);
        delete [] name;
        name = new char [strlen(temp) + 1];
        strcpy(name, temp);
        this->price = this->price + 10;
        return *this;
    }

    void setDiscount(int discount) {
        if (discount < 0 || discount > 100) {
            throw except("Invalid discount value: ", discount);
        } else {
            this->discount = discount;
        }
    }

    void setName(char *name) {
        delete [] this->name;
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
    }
};

class IceCreamShop {
private:
    char name[50];
    IceCream *array;
    int n;

public:
    IceCreamShop(const char *name = "") {
        strcpy(this->name, name);
        array = nullptr;
        n = 0;
    }

    IceCreamShop(const IceCreamShop &other) {
        strcpy(this->name, other.name);
        this->n = other.n;
        array = new IceCream[other.n];
        for (int i = 0; i < other.n; i++) {
            array[i] = other.array[i];
        }
    }

    IceCreamShop &operator=(const IceCreamShop &other) {
        if (this != &other) {
            delete [] this->array;
            strcpy(this->name, other.name);
            this->n = other.n;
            array = new IceCream[other.n];
            for (int i = 0; i < other.n; i++) {
                array[i] = other.array[i];
            }
        }
        return *this;
    }

    ~IceCreamShop() {
        delete [] array;
    }

    IceCreamShop &operator +=(IceCream &ice) {
        IceCream *temp = new IceCream [n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = array[i];
        }
        temp[n] = ice;
        delete [] array;
        array = temp;
        n++;
        return *this;
    }

    friend ostream &operator <<(ostream &os, const IceCreamShop &icc) {
        cout << icc.name << endl;
        for (int i = 0; i < icc.n; i++) {
            cout << icc.array[i] << endl;
        }
        return os;
    }
};


int main() {
    char name[100];
    char ingr[100];
    float price;
    int discount;

    int testCase;

    cin >> testCase;
    cin.get();
    if (testCase == 1) {
        cout << "====== TESTING IceCream CLASS ======" << endl;
        cin.getline(name, 100);
        cin.getline(ingr, 100);
        cin >> price;
        cin >> discount;
        cout << "CONSTRUCTOR" << endl;
        IceCream ic1(name, ingr, price);
        ic1.setDiscount(discount);
        cin.get();
        cin.getline(name, 100);
        cin.getline(ingr, 100);
        cin >> price;
        cin >> discount;
        IceCream ic2(name, ingr, price);
        ic2.setDiscount(discount);
        cout << "OPERATOR &lt;&lt;" << endl;
        cout << ic1 << endl;
        cout << ic2 << endl;
        cout << "OPERATOR ++" << endl;
        ++ic1;
        cout << ic1 << endl;
        cout << "OPERATOR +" << endl;
        IceCream ic3 = ic2 + "chocolate";
        cout << ic3 << endl;
    } else if (testCase == 2) {
        cout << "====== TESTING IceCream CONSTRUCTORS ======" << endl;
        cin.getline(name, 100);
        cin.getline(ingr, 100);
        cin >> price;
        cout << "CONSTRUCTOR" << endl;
        IceCream ic1(name, ingr, price);
        cout << ic1 << endl;
        cout << "COPY CONSTRUCTOR" << endl;
        IceCream ic2(ic1);
        cin.get();
        cin.getline(name, 100);
        ic2.setName(name);
        cout << ic1 << endl;
        cout << ic2 << endl;
        cout << "OPERATOR =" << endl;
        ic1 = ic2;
        cin.getline(name, 100);
        ic2.setName(name);
        cout << ic1 << endl;
        cout << ic2 << endl;
        cout << "TESTING EXCEPTION" << endl;
        cin >> discount;
        // your exception handling code
        try {
            ic1.setDiscount(discount);
        } catch (except &e) {
            e.print();
        }
    } else if (testCase == 3) {
        cout << "====== TESTING IceCreamShop ======" << endl;
        char icsName[50];
        cin.getline(icsName, 100);
        cout << "CONSTRUCTOR" << endl;
        IceCreamShop ics(icsName);
        int n;
        cin >> n;
        cout << "OPERATOR +=" << endl;
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name, 100);
            cin.getline(ingr, 100);
            cin >> price;
            IceCream ic(name, ingr, price);
            ics += ic;
        }
        cout << ics;
    } else if (testCase == 4) {
        cout << "====== TESTING IceCreamShop CONSTRUCTORS ======" << endl;
        char icsName[50];
        cin.getline(icsName, 100);
        IceCreamShop ics(icsName);
        int n;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            cin.get();
            cin.getline(name, 100);
            cin.getline(ingr, 100);
            cin >> price;
            IceCream ic(name, ingr, price);
            ics += ic;
        }
        IceCream x("FINKI fruits", "strawberry ice cream, raspberry ice cream, blueberry ice cream", 60);
        IceCreamShop icp = ics;
        ics += x;
        cout << ics << endl;
        cout << icp << endl;
    }


    return 0;
}
