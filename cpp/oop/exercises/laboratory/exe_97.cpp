// Да се напише класа Chocolate која ги содржи следните податоци за еден чоколаден производ:
// name - име на чоколадото, низа од најмногу 100 знаци;
// price - стандардна малопродажна цена на еден пакет од чоколадите
// За класата да се напишат default конструктор и конструктор со параметри.
// Да се преоптовари операторот << за да ги печати објектите од класата во следниот формат: [name]: $[price].
//
// Потоа да се дефинира класата ChocolateFactory, која ги содржи следните податоци за фабрика за чоколадо:
//
// products - динамички алоцирана низа од Chocolate објекти
// weeklyProduction - динамички алоцирана низа од цели броеви, така што weeklyProduction[i] означува колку пакети од products[i] фабриката произведува неделно
// numProducts - број на типови чоколади кои фабриката ги нуди.
// За класата да се дефинираат конструктор со параметри, деструктор, како и следните методи:
//
// weeklyIncome() која ја пресметува вкупната вредност на чоколадите кои фабриката ги произведува неделно
// оператори < и > за споредба на две фабрики според неделната заработка
// оператор + кој како резултат дава нова фабрика со комбинираното производство на двете фабрики
// оператор << за печатење на објектот во следниот формат:
// [product0] x [weeklyProduction0]
// [product1] x [weeklyProduction2]
// ...
// [productN] x [weeklyProductionN]
// $[weeklyIncome]/wk
//
// Да не се менува main функцијата.
// Се признаваат и решенија без динамичка алокација на меморија.

#include<iostream>
#include<cstring>
#include <ostream>
using namespace std;
class Chocolate {
private:
    char name[100];
    int price;
public:

    Chocolate(char *name=" ", int price=0) {
        strcpy(this->name,name);
        this->price=price;
    }

    friend ostream & operator<<(ostream &os, const Chocolate &obj) {
        os<<obj.name<<": $"<<obj.price;
        return os;
    }
    int getPrice() const{
        return price;
    }
};
class ChocolateFactory {
private:
    Chocolate *products;
    int *weeklyProduction;
    int numProducts;
public:
    ChocolateFactory(Chocolate *products, int *weeklyProduction, int numProducts) {
        this->products = new Chocolate[numProducts];
        this->weeklyProduction = new int [numProducts];
        this->numProducts=numProducts;
        for (int i=0; i<numProducts; i++) {
            this->products[i] = products[i];
            this->weeklyProduction[i] = weeklyProduction[i];
        }
    }
    ~ChocolateFactory() {
        delete[]products;
        delete[]weeklyProduction;
    }
    int weeklyIncome()const {
        int suma = 0;
        for (int i=0; i<numProducts; i++) {
            suma+=products[i].getPrice() * weeklyProduction[i];
        }
        return suma;
    }
    bool operator<(const ChocolateFactory &other) const{
        return this->weeklyIncome() < other.weeklyIncome();
    }
    bool operator>(const ChocolateFactory &other) const{
        return this->weeklyIncome() > other.weeklyIncome();
    }

    friend ostream& operator<<(ostream& os, const ChocolateFactory& obj) {
        for (int i = 0; i < obj.numProducts; ++i) {
            os << obj.products[i] << " x " << obj.weeklyProduction[i] << endl;
        }
        os << "$" << obj.weeklyIncome() << "/wk" << endl;
        return os;
    }

    ChocolateFactory operator+(const ChocolateFactory& other) const {
        int vkupno = this->numProducts + other.numProducts;
        Chocolate *newProducts = new Chocolate[vkupno];
        int *newProduction = new int[vkupno];

        for (int i = 0; i < this->numProducts; ++i) {
            newProducts[i] = this->products[i];
            newProduction[i] = this->weeklyProduction[i];
        }

        for (int i = 0; i < other.numProducts; ++i) {
            newProducts[this->numProducts + i] = other.products[i];
            newProduction[this->numProducts + i] = other.weeklyProduction[i];
        }

        ChocolateFactory krajno(newProducts, newProduction, vkupno);
        delete[] newProducts;
        delete[] newProduction;
        return krajno;
    }

};
int main() {
    int testCase;
    char name[100];
    int price;

    Chocolate products[100];
    int weeklyProduction[100];

    cin >> testCase;
    if (testCase == 0) {
        cout<<"Testing Chocolate print operator:"<<endl;
        for (int i = 0; i < 10; ++i) {
            cin>>name>>price;
            cout<<Chocolate(name,price)<<endl;
        }
    }
    else if (testCase == 1) {
        cout<<"Testing ChocolateFactory print operator:"<<endl;

        for (int i = 0; i < 10; ++i) {
            cin>>name>>price;
            products[i] = Chocolate(name, price);
            cin>>weeklyProduction[i];
        }

        ChocolateFactory cf(products,weeklyProduction,10);
        cout<<cf<<endl;
    }
    else if (testCase == 2) {
        cout<<"Testing ChocolateFactory comparison operators:"<<endl;

        for (int i = 0; i < 3; ++i) {
            cin>>name>>price>>weeklyProduction[i];
            products[i] = Chocolate(name,price);
        }
        ChocolateFactory cf1 = ChocolateFactory(products,weeklyProduction,3);

        for (int i = 0; i < 4; ++i) {
            cin>>name>>price>>weeklyProduction[i];
            products[i] = Chocolate(name,price);
        }
        ChocolateFactory cf2 = ChocolateFactory(products,weeklyProduction,4);

        cout<<cf1<<cf2;

        cout<<"< operator: "<< (cf1<cf2 ? "PASS" : "FAIL") <<endl;
        cout<<"> operator: "<< (cf2>cf1 ? "PASS" : "FAIL") <<endl;
    }
    else if (testCase == 3) {
        cout<<"Testing ChocolateFactory sum operator:"<<endl;

        for (int i = 0; i < 5; ++i) {
            cin>>name>>price>>weeklyProduction[i];
            products[i] = Chocolate(name,price);
        }
        ChocolateFactory cf1 = ChocolateFactory(products,weeklyProduction,5);
        for (int i = 0; i < 5; ++i) {
            cin>>name>>price>>weeklyProduction[i];
            products[i] = Chocolate(name,price);
        }
        ChocolateFactory cf2 = ChocolateFactory(products,weeklyProduction,5);

        cout<<cf1+cf2;
    }
}