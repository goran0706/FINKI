// Да се напише класа Chocolate која ги содржи следните податоци за еден чоколаден производ:
//      name - име на чоколадото, низа од најмногу 100 знаци;
//      price - стандардна малопродажна цена на еден пакет од чоколадите
//
// За класата да се напишат default конструктор и конструктор со параметри.
// Да се преоптовари операторот << за да ги печати објектите од класата во следниот формат: [name]: $[price].
//
// Потоа да се дефинира класата ChocolateFactory, која ги содржи следните податоци за фабрика за чоколадо:
//      products - динамички алоцирана низа од Chocolate објекти
//      weeklyProduction - динамички алоцирана низа од цели броеви, така што weeklyProduction[i] означува колку пакети од products[i] фабриката произведува неделно
//      numProducts - број на типови чоколади кои фабриката ги нуди.
//
// За класата да се дефинираат конструктор со параметри, деструктор, како и следните методи:
//      weeklyIncome() која ја пресметува вкупната вредност на чоколадите кои фабриката ги произведува неделно
//      оператори < и > за споредба на две фабрики според неделната заработка
//      оператор + кој како резултат дава нова фабрика со комбинираното производство на двете фабрики
//      оператор << за печатење на објектот во следниот формат:
//
// [product0] x [weeklyProduction0]
// [product1] x [weeklyProduction2]
// ...
// [productN] x [weeklyProductionN]
// $[weeklyIncome]/wk

#include <cstring>
#include <iosfwd>
#include <iostream>
using namespace std;

class Chocolate {
private:
    char name[100];
    int price;

public:
    explicit Chocolate(const char *name = "", const int price = 0) {
        strcpy(this->name, name);
        this->price = price;
    }

    const char *getName() const {
        return name;
    }

    int getPrice() const {
        return price;
    }

    void setName(const char *_name) {
        strcpy(this->name, _name);
    }

    void setPrice(const int _price) {
        this->price = _price;
    }

    friend ostream &operator<<(ostream &os, const Chocolate &obj) {
        os << obj.name << ": " << obj.price << endl;
        return os;
    }
};

class ChocolateFactory {
private:
    Chocolate *products;
    int *weeklyProduction;
    int numProducts;

public:
    explicit ChocolateFactory(const Chocolate *products = nullptr, const int *weeklyProduction = nullptr,
                              const int numProducts = 0) {
        this->products = new Chocolate[numProducts];
        for (int i = 0; i < numProducts; i++) {
            this->products[i] = products[i];
        }
        this->weeklyProduction = new int[numProducts];
        for (int i = 0; i < numProducts; i++) {
            this->weeklyProduction[i] = weeklyProduction[i];
        }
        this->numProducts = numProducts;
    }

    ~ChocolateFactory() {
        delete[] this->products;
        delete[] this->weeklyProduction;
    }

    [[nodiscard]] Chocolate *getProducts() const {
        return products;
    }

    void setProducts(Chocolate *_products) {
        this->products = _products;
    }

    [[nodiscard]] int *getWeeklyProduction() const {
        return weeklyProduction;
    }

    void setWeeklyProduction(int *weekly_production) {
        weeklyProduction = weekly_production;
    }

    [[nodiscard]] int getNumProducts() const {
        return numProducts;
    }

    void setNumProducts(const int num_products) {
        numProducts = num_products;
    }

    int weeklyIncome() const {
        int total = 0;
        for (int i = 0; i < numProducts; i++) {
            total += products[i].getPrice() * weeklyProduction[i];
        }
        return total;
    }

    friend ostream &operator<<(ostream &os, const ChocolateFactory &obj) {
        for (int i = 0; i < obj.numProducts; i++) {
            os << obj.products[i].getName() << " x " << obj.weeklyProduction[i] << '\n';
        }
        os << "$" << obj.weeklyIncome() << "/wk" << endl;
        return os;
    }

    bool operator<(const ChocolateFactory &other) const {
        return weeklyProduction < other.weeklyProduction;
    }

    bool operator>(const ChocolateFactory &other) const {
        return weeklyProduction > other.weeklyProduction;
    }

    ChocolateFactory operator+(const ChocolateFactory &other) const {
        const int newProductsCount = numProducts + other.numProducts;
        const auto productsTmp = new Chocolate[newProductsCount];
        const auto weeklyProductionTmp = new int[newProductsCount];

        for (int i = 0; i < numProducts; i++) {
            productsTmp[i] = products[i];
            weeklyProductionTmp[i] = weeklyProduction[i];
        }

        for (int i = 0; i < other.numProducts; i++) {
            productsTmp[numProducts + i] = other.products[i];
            weeklyProductionTmp[numProducts + i] = other.weeklyProduction[i];
        }

        ChocolateFactory result(productsTmp, weeklyProductionTmp, newProductsCount);

        delete[] productsTmp;
        delete[] weeklyProductionTmp;

        return result;
    }
};
