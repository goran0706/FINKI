// Да се дефинира класа Product за која се чува информација за:
//
// име на продукт (низа од карактери)
// набавна цена (цел број)
// продажна цена (цел број)
// За класата да се дефинираат следните методи:
//
// default конструктор
// конструктор со аргументи
// copy конструктор
// int profit() метод што ја враќа добивката (продажна - набавна цена)
// void display() метод за печатење на производ во формат ИМЕ - ПРОФИТ
//
// Потоа дефинирајте класа Company за која се чува информација за:
//
// име (низа од карактери)
// низа од продукти (динамички алоцирана низа од објекти од класата Product)
// број на елементи во низата (цел број)
// За класата да се дефинираат следните методи:
//
// default конструктор
// конструктор со аргументи
// copy конструктор
// деструктор
// оператор =
// int totalProfit() метод за пресметување на профит
// void display() метод за печатење на информации за компанијата во формат
// ИМЕ
// производ1
// .
// .
// производN
// профит
// void addNewProduct(Product p) метод за додавање на нов производ
// void deleteProduct(Product p) метод за бришење на производот р

#include "iostream"
#include "cstring"
using namespace std;

class Product {
private:
    char name[100];
    int originalCost;
    int sellingPrice;

public:
    Product(char *name = "", int originalCost = 0, int sellingPrice = 0) {
        strcpy(this->name, name);
        this->originalCost = originalCost;
        this->sellingPrice = sellingPrice;
    }

    Product(const Product &p) {
        strcpy(this->name, p.name);
        this->originalCost = p.originalCost;
        this->sellingPrice = p.sellingPrice;
    }

    int profit() {
        return sellingPrice - originalCost;
    }

    void display() {
        cout << name << " - " << profit();
    }

    const char *getName() const {
        return name;
    }
};

class Company {
private:
    char name[100];
    Product *products;
    int n;

public:
    Company() {
    }

    Company(char *name, Product *products, int n) {
        strcpy(this->name, name);
        this->products = new Product[n];
        for (int i = 0; i < n; ++i) {
            this->products[i] = products[i];
        }
    }

    Company(const Company &c) {
        strcpy(this->name, c.name);
        this->products = new Product[c.n];
        for (int i = 0; i < c.n; ++i) {
            this->products[i] = c.products[i];
        }
    }

    Company &operator =(const Company &c) {
        if (this != &c) {
            delete[]products;
            strcpy(this->name, c.name);
            this->products = new Product[c.n];
            for (int i = 0; i < c.n; ++i) {
                this->products[i] = c.products[i];
            }
        }
        return *this;
    }

    ~Company() {
        delete[]products;
    }

    int totalProfit() {
        int suma = 0;
        for (int i = 0; i < n; ++i) {
            suma += products[i].profit();
        }
        return suma;
    }

    void display() {
        cout << name << endl;
        for (int i = 0; i < n; ++i) {
            products[i].display();
        }
        cout << totalProfit() << endl;
    }

    void addNewProduct(Product p) {
        Product *tmp = new Product[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = products[i];
        }
        tmp[n++] = p;
        delete[]products;
        products = tmp;
    }

    void deleteProduct(Product p) {
        Product *tmp = new Product[n + 1];
        int counter = 0;
        for (int i = 0; i < n; ++i) {
            if (strcmp(products[i].getName(), p.getName()) == 0) {
                continue;
            } else {
                tmp[counter++] = products[i];
            }
        }
        tmp[n++] = p;
        delete[]products;
        products = tmp;
        n--;
    }
};

int main() {
    int check;
    cin >> check;
    if (check == 0) {
        cout << "--- Testing Product class ---" << endl;
        Product p1;
        char name[100];
        cin >> name;
        p1 = Product(name, 80, 111);
        Product p2 = p1;
        p2.display();
    }
    Product products[100];
    for (int i = 0; i < 7; i++) {
        char name[100];
        int originalCost;
        int sellingPrice;
        cin >> name >> originalCost >> sellingPrice;
        products[i] = Product(name, originalCost, sellingPrice);
    }
    if (check == 1) {
        cout << "--- Testing Company class ---" << endl;
        char cmpName[100];
        cin >> cmpName;
        Company company;
        company = Company(cmpName, products, 7);
        company.display();
    }
    if (check == 2) {
        cout << "--- Testing addNewProduct() and deleteProduct() method ---" << endl;
        char n[100];
        cin >> n;
        Product p = Product(n, 29, 49);
        char cmpName[100];
        cin >> cmpName;
        Company company;
        company = Company(cmpName, products, 7);
        company.addNewProduct(p);
        company.display();
        company.deleteProduct(p);
        company.display();
    }
}
