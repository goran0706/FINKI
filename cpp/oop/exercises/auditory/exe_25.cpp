/*
    2. Продукти со попуст

    Да се имплементира класа Product за која се чуваат името и цената.

    Да се имплементира апстрактна класа Discount во која има два чисто виртуелни методи за цена и за цена со попуст.

    Од овие класи да се изведат класите:

    - FoodProduct за која дополнително се чува бројот на калории;
    - DigitalProduct за која дополнително се чува големината (во MB)

    Да се имплементира надворешна функција total_discount која ќе пресметува вкупен попуст на неколку продукти на попуст кои ги прима како аргумент.
*/
#include <iostream>
#include <cstring>
using namespace std;

// ==========================================
// 1. INTERFACE / ABSTRACT CLASS
// ==========================================
class Discount {
public:
    virtual float getDiscountPrice() = 0;

    virtual float getPrice() = 0;

    // CRITICAL: Destructor must be virtual.
    // Since objects are deleted via Discount* pointers in main(),
    // this ensures the child class destructors are actually triggered.
    virtual ~Discount() = default;
};

// ==========================================
// 2. REGULAR BASE CLASS
// ==========================================
class Product {
protected:
    string name;
    float price;

public:
    Product(string name = "", const float price = 0) {
        this->name = name;
        this->price = price;
    }

    float getPrice() {
        return price;
    }

    virtual ~Product() = default;
};

// ==========================================
// 3. MULTIPLE INHERITANCE CLASSES
// ==========================================
class DigitalProduct : public Product, public Discount {
private:
    float sizeInMB;

public:
    // Product(name, price) initializes the Product sub-object side of the class.
    DigitalProduct(string name = "", const float price = 0, const float sizeInMB = 0)
        : Product(name, price) {
        this->sizeInMB = sizeInMB;
    }

    float getDiscountPrice() override {
        // 10% discount applied
        return 0.9f * getPrice();
    }

    // RESOLVING NAME COLLISION: Both Product and Discount contain a getPrice() function.
    // We override getPrice() here to explicitly return the price from the Product class.
    float getPrice() override {
        return Product::getPrice();
    }
};

class FoodProduct : public Product, public Discount {
private:
    float calories;

public:
    FoodProduct(string name = "", const float price = 0, const float calories = 0)
        : Product(name, price) {
        this->calories = calories;
    }

    float getDiscountPrice() override {
        // 20% discount applied
        return 0.8f * getPrice();
    }

    float getPrice() override {
        return Product::getPrice();
    }
};

// ==========================================
// 4. GLOBAL CALCULATOR
// ==========================================
// Takes a double pointer (array of Discount pointers).
// Since Discount is abstract, we can only store its derived objects via pointers.
float calculateTotalDiscount(Discount **d, int n) {
    float regularPriceSum = 0;
    for (int i = 0; i < n; ++i) {
        // Dynamic binding automatically routes to DigitalProduct::getPrice() or FoodProduct::getPrice()
        regularPriceSum += d[i]->getPrice();
    }

    float discountedPriceSum = 0;
    for (int i = 0; i < n; ++i) {
        discountedPriceSum += d[i]->getDiscountPrice();
    }

    // Returns total money saved
    return regularPriceSum - discountedPriceSum;
}

// ==========================================
// 5. MAIN EXECUTION
// ==========================================
int main() {
    // Array of base pointers allocated on the heap to handle mixed (heterogeneous) types
    Discount **discountArray = new Discount *[3];

    discountArray[0] = new FoodProduct("Cheese", 450, 1200);
    discountArray[1] = new FoodProduct("Wine", 780, 250);
    discountArray[2] = new DigitalProduct("WOW_Subscription", 380, 400);

    cout << "Total Money Saved: " << calculateTotalDiscount(discountArray, 3) << endl;

    // Memory Cleanup
    for (int i = 0; i < 3; ++i) {
        // Triggers virtual destruction sequence successfully
        delete discountArray[i];
    }
    delete[] discountArray;

    return 0;
}
