// Дефинирај класа Product која чува информации за:
//
//     price – цена на производот (double)
//
// За класата Product да се дефинираат следните:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     double finalPrice() – ја враќа цената на производот
//     void print() – печати информации за производот како во тест примерите
//
// Имплементирај друга класа DiscountedProduct која наследува од Product. Оваа класа чува информации за:
//
//     discount – процент на попуст (double)
//
// Крајната цена на производот со попуст се пресметува како:
//
// price - (price * discount / 100)
//
// За класата DiscountedProduct да се дефинираат:
//
//     default конструктор
//     конструктор
//     DiscountedProduct(const Product &p, double discount)
//     copy конструктор
//
// Да се препокријат методите од класата Product:
//
//     finalPrice()
//     print()
//
// Важно:
//
//     Ако discount == 0, тогаш производот не е со попуст и треба да се однесува како обичен Product.
//     Во тој случај, print() треба да се однесува исто како Product::print().
//     При препокривање на методите во DiscountedProduct, мора да се повикаат соодветните методи од базната класа Product.
//
// ирани погоре за класата Kvadrat.
//
// Напомени:
//
//     Ако x и y се исти, тогаш формата не е правоаголник туку е повторно квадрат. Во тој случај pecati() се повикува исто како за квадрат.
//     При препокривање на методите во класата Pravoagolnik мора да има повик кон истоимените методи од класата Kvadrat
//
// -------------------------
//
// Define a class Product that stores information about:
//
//     price of the product (double)
//
// For the class Product define the following:
//
//     default constructor
//     constructor with arguments
//     copy constructor
//     double finalPrice() – returns the price of the product
//     void print() – prints information about the product as in the test cases
//
// Implement another class DiscountedProduct that inherits from Product. This class stores information about:
//
//     discount percentage (double)
//
// The final price of the discounted product is calculated as:
//
// price - (price * discount / 100)
//
// For the class DiscountedProduct define:
//
//     default constructor
//     constructor
//     DiscountedProduct(const Product &p, double discount)
//     copy constructor
//
// Override the methods from class Product:
//
//     finalPrice()
//     print()
//
// Important:
//
//     If discount == 0, then the product is not discounted and should behave as a regular Product.
//     In that case, print() must behave exactly as Product::print().
//     When overriding methods in DiscountedProduct, you must call the corresponding methods from the base class Product.
//
// For example:
// Input 	Result
//
// 3
// 100
// 200
// 50
// 0
// 0
// 0
// 1
//
//
//
// ===Testiranje na klasata Product===
// Product price: 100
// Product price: 200
// Product price: 50

#include <iostream>
using namespace std;

class Product {
protected:
    double price;

public:
    Product() {
        this->price = 0;
    }

    explicit Product(const double price) {
        this->price = price;
    }

    Product(const Product &other) {
        this->price = other.price;
    }

    [[nodiscard]] double finalPrice() const {
        return price;
    }

    void print() const {
        cout << "Product price: " << price << endl;
    }
};

class DiscountedProduct : public Product {
private:
    double discount;

public:
    DiscountedProduct() {
        this->discount = 0;
    }

    DiscountedProduct(const Product &p, double discount) {
        this->price = p.finalPrice();
        this->discount = discount;
    }

    DiscountedProduct(const DiscountedProduct &other) : Product(other) {
        this->price = other.price;
        this->discount = other.discount;
    }

    [[nodiscard]] double finalPrice() const {
        return price - (price * discount / 100);
    }

    void print() const {
        if (discount == 0) {
            Product::print();
        } else {
            cout << "Discounted product price: " << finalPrice() << endl;
        }
    }
};

int main() {
    int n;
    double price, discount;

    Product *products;
    DiscountedProduct *discounted;

    cin >> n;

    products = new Product[n];
    discounted = new DiscountedProduct[n];

    for (int i = 0; i < n; i++) {
        cin >> price;
        products[i] = Product(price);
    }

    for (int i = 0; i < n; i++) {
        cin >> discount;
        discounted[i] = DiscountedProduct(products[i], discount);
    }

    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "===Testiranje na klasata Product===" << endl;
        for (int i = 0; i < n; i++)
            products[i].print();
    } else {
        cout << "===Testiranje na klasata DiscountedProduct===" << endl;
        for (int i = 0; i < n; i++)
            discounted[i].print();
    }

    delete[] products;
    delete[] discounted;

    return 0;
}
