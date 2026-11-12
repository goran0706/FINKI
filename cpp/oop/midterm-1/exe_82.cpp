#include <iostream>
#include <cstring>
using namespace std;

class IceCream {
private:
    char *name;
    char madeOf[100];
    float price;
    int discount;

public:
    IceCream(const char *name = "", const char *madeOf = "", const float price = 0, const int discount = 0) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        strcpy(this->madeOf, madeOf);
        this->price = price;
        this->discount = discount;
    }

    IceCream(const IceCream &other) {
        this->name = new char[strlen(other.name) + 1];
        strcpy(this->name, other.name);
        strcpy(this->madeOf, other.madeOf);
        this->price = other.price;
        this->discount = other.discount;
    }

    IceCream &operator=(const IceCream &other) {
        if (this != &other) {
            delete [] this->name;
            this->name = new char[strlen(other.name) + 1];
            strcpy(this->name, other.name);
            strcpy(this->madeOf, other.madeOf);
            this->price = other.price;
            this->discount = other.discount;
        }
        return *this;
    }

    ~IceCream() {
        delete [] this->name;
    }

    char *getName() {
        return this->name;
    }

    char *getMadeOf() {
        return this->madeOf;
    }

    float getPrice() {
        return this->price;
    }

    int getDiscount() {
        return this->discount;
    }

    void setDiscount(const int discount) {
        if (discount > 0 && discount < 100) {
            this->discount = discount;
        }
    }

    IceCream &operator ++() {
        this->discount += 5;
        return *this;
    }

    IceCream &operator +(const char *array) {
        this->price += 10;
        char *temp = new char [strlen(name) + strlen(array) + 4];
        strcpy(temp, name);
        strcat(temp, " + ");
        strcat(temp, array);
        delete [] name;
        name = temp;
        return *this;
    }

    void setName(char *name) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
    }
};

ostream &operator<<(ostream &os, IceCream &obj) {
    os << obj.getName() << ": " << obj.getMadeOf() << " " << obj.getPrice();
    if (obj.getDiscount() > 0) {
        float newPrice = obj.getPrice() - (obj.getDiscount() * obj.getPrice() / 100);
        os << " (" << newPrice << ")";
    }

    return os;
}

class IceCreamShop {
private:
    char name[50];
    IceCream *iccream;
    int n;

public:
    IceCreamShop(const char *name = "") {
        strcpy(this->name, name);
        n = 0;
        iccream = new IceCream[n];
    }

    // IceCreamShop(const IceCreamShop &other) {
    //     strcpy(this->name, other.name);
    //     n=other.n;
    //     iccream = new IceCream[n];
    //     iccream = other.iccream;
    // }
    IceCreamShop(const IceCreamShop &other) {
        strcpy(this->name, other.name);
        this->n = other.n;
        delete [] iccream;
        iccream = new IceCream[n];
        for (int i = 0; i < n; i++) {
            iccream[i] = other.iccream[i];
        }
    }

    IceCreamShop &operator=(const IceCreamShop &other) {
        if (this != &other) {
            strcpy(this->name, other.name);
            this->n = other.n;
            delete [] iccream;
            iccream = new IceCream[n];
            for (int i = 0; i < n; i++) {
                iccream[i] = other.iccream[i];
            }
        }
        return *this;
    }

    ~IceCreamShop() {
        delete [] iccream;
    }

    IceCreamShop &operator +=(const IceCream &other) {
        IceCream *temp = new IceCream[n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = iccream[i];
        }
        temp[n] = other;
        delete [] iccream;
        iccream = temp;
        n++;
        return *this;
    }

    char *getName() {
        return name;
    }

    int getN() {
        return n;
    }

    IceCream *getICCream() {
        return iccream;
    }
};

ostream &operator<<(ostream &os, IceCreamShop &obj) {
    os << obj.getName() << endl;
    for (int i = 0; i < obj.getN(); i++) {
        os << obj.getICCream()[i] << endl;
    }
    return os;
}

int main() {
    // IceCream ice = IceCream ("Sladoled", "Mleko i nes dr", 30);
    // IceCream ice2 = ice;
    // // ice.setDiscount(30);
    // // ++ice;
    // // cout<<ice.getDiscount()<<endl;
    // //
    // // ice+("smth");
    //  cout<<ice;
    // cout<<endl;
    // cout<<ice2;

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
        cout << "OPERATOR <<" << endl;
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
        //cin >> discount;
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

        cin >> discount;
        ic1.setDiscount(discount);
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
