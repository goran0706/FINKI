#include <iostream>
#include <cstring>
using namespace std;

class Pasta {
private:
    char *name;
    float price;
    int discount;
    int calories;

public:
    Pasta(const char *name = "", float price = 0, int calories = 0) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        this->price = price;
        this->discount = 0;
        this->calories = calories;
    }

    Pasta(const Pasta &p) {
        this->name = new char [strlen(p.name) + 1];
        strcpy(this->name, p.name);
        this->price = p.price;
        this->discount = p.discount;
        this->calories = p.calories;
    }

    Pasta &operator=(const Pasta &p) {
        if (this != &p) {
            delete [] this->name;
            this->name = new char [strlen(p.name) + 1];
            strcpy(this->name, p.name);
            this->price = p.price;
            this->discount = p.discount;
            this->calories = p.calories;
        }
        return *this;
    }

    ~Pasta() {
        delete [] this->name;
    }

    void print() {
        if (discount > 0) {
            float newPrice = price - ((price / 100) * discount);
            cout << name << " " << calories << " " << price << " (" << newPrice << ")" << endl;
        } else {
            cout << name << " " << calories << " " << price << " " << endl;
        }
    }

    void dby5() {
        discount = discount - 5;
    }

    Pasta light(int c) {
        char *temp = new char [strlen(name) + 6];
        strcpy(temp, name);
        strcat(temp, "Light");
        name = new char [strlen(temp) + 1];
        strcpy(name, temp);
        calories = calories - c;
        price = price - ((price / 100) * 20);
        discount = 0;
        return *this;
    }

    void setDiscount(int discount) {
        this->discount = discount;
    }

    void setName(char *name) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
    }
};

class ItalianRestaurant {
private:
    char name[50];
    Pasta *array;
    int n;

public:
    ItalianRestaurant(const char *name = "") {
        strcpy(this->name, name);
        array = nullptr;
        n = 0;
    }

    ItalianRestaurant(const ItalianRestaurant &it) {
        strcpy(this->name, it.name);
        array = new Pasta[it.n];
        n = it.n;
        for (int i = 0; i < n; i++) {
            array[i] = it.array[i];
        }
    }

    ItalianRestaurant &operator=(const ItalianRestaurant &it) {
        if (this != &it) {
            delete [] array;
            strcpy(this->name, it.name);
            array = new Pasta[it.n];
            n = it.n;
            for (int i = 0; i < n; i++) {
                array[i] = it.array[i];
            }
        }
        return *this;
    }

    ~ItalianRestaurant() {
        delete [] array;
    }

    void add(Pasta &p) {
        //ItalianRestaurant
        Pasta *temp = new Pasta [n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = array[i];
        }
        temp[n] = p;
        delete [] array;
        array = temp;
        n++;
        //return *this;
    }

    // ItalianRestaurant add (Pasta &p) {
    //     //ItalianRestaurant
    //     Pasta *temp = new Pasta [n+1];
    //     for (int i=0;i<n;i++) {
    //         temp[i]=array[i];
    //     }
    //     temp[n]=p;
    //     delete [] array;
    //     array=temp;
    //     n++;
    //     return *this;
    // }
    void print() {
        cout << name << endl;
        for (int i = 0; i < n; i++) {
            array[i].print();
        }
    }

    void setPasta(int i, Pasta &p) {
        array[i] = p;
    }
};

int main() {
    // Pasta p=Pasta ("Nekoja pasta",150,400);
    // Pasta p1=p;
    // Pasta p2 =Pasta ("Proverka",400,800);
    // //p.setDiscount(5);
    // //p.dby5();
    // //p.setName ("Nekoja pasta123");
    // //p.light (100);
    // p.print();
    // p1.print();
    // p2.print();
    //
    // cout<<"--------------------------------"<<endl;
    // ItalianRestaurant it=ItalianRestaurant("Restaurant");
    //
    // it.add(p);
    // it.add(p1);
    // it.setPasta(1,p2);
    // it.print();


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
        //cout << endl;
        c2.print();
        //cout << endl;
        cout << "Decrease by 5" << endl;
        c1.dby5();
        c1.print();
        //cout << endl;
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
        //cout << endl;
        cout << "COPY CONSTRUCTOR" << endl;
        Pasta c2(c1);
        cin >> name;
        c2.setName(name);
        c1.print();
        //cout << endl;
        c2.print();
        //cout << endl;
        cout << "OPERATOR =" << endl;
        c1 = c2;
        cin >> name;
        c2.setName(name);
        c1.print();
        //cout << endl;
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
