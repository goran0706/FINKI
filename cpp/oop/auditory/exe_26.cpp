/*
    Објектно ориентирано програмирање

    Аудиториска вежба 10 (Исклучоци и Датотеки)
    1. Производи со попуст

    Дел од производите во една продавница по новата политика на продавницата мора да имаат одреден попуст.

    За таа цел во системот на продавницата потребно е да се моделира апстрактната класа Discount.

    Оваа класа како податок ги има курсевите на евра и долари во денари и методите кои мора секоја класа што ќе наследи од неа да ги имплементира:

    - float discount_price();
    - float price();
    - void print_rule();

    За секој производ треба да се чуваат информации за името и цената на производот.
    Со ова треба да се моделира класата Product.
    Во неа покрај конструкторите треба да се имплементираат сите потребни методи.

    Производите се поделени на неколку типови: FoodProduct, Drinks и Cosmetics.

    Според новата политика на продавницата храната нема попуст.
    Пијалоците и тоа алкохолните поскапи од 20 евра имаат попуст 5%, а неалкохолните од брендот Coca-Cola имаат попуст од 10%.
    Сите козметички производи поскапи од 5 евра имаат попуст 12%, а оние поскапи од 20 долари имаат попуст 14%.

    Да се пресмета вкупната цена на сите производи заедно со попустот.

    Исто така да се креира функција changePrice(float) во класата Product која што ќе нуди можност за промена на постоечката цена на производот.
    Ако се направи обид да се внесе негативна вредност за цената да се фрли исклучок (објект од класата NegativeValueException).
    Фатете го исклучокот во главната функција каде што ќе ги излистате сите производи од тип Cosmetics и ќе им ја промените цената.
*/
#include <iostream>
#include <string>

using namespace std;

// ==========================================
// 1. EXCEPTION CLASS
// ==========================================
class NegativeValueException {
private:
    string text;

public:
    NegativeValueException(string text) {
        this->text = text;
    }

    // Simple display method invoked during caught exceptions
    void print() const {
        cout << text;
    }
};

// ==========================================
// 2. ABSTRACT INTERFACE CLASS
// ==========================================
class Discount {
public:
    // WHY STATIC? These values are constant across all products.
    // Making them 'static' allocates them exactly once in global memory,
    // rather than duplicating them inside every instance, saving massive RAM.
    static float euro;
    static float dollar;

    virtual float discount_price() = 0;

    virtual float price() = 0;

    virtual void print_rule() = 0;

    // WHY MANDATORY: Objects are deleted via Discount* pointers in main().
    // This virtual destructor forces the compiler to look up the vtable
    // and correctly call the concrete subclass destructor first.
    virtual ~Discount() = default;
};

// Initialize static member variables outside the class definition
float Discount::euro = 61.7f;
float Discount::dollar = 44.5f;

// ==========================================
// 3. BASE PRODUCT CLASS
// ==========================================
class Product {
protected:
    string name;
    float price;

public:
    Product(const string name = "", const float price = 0) {
        this->name = name;
        this->price = price;
    }

    float getPrice() const {
        return price;
    }

    void print() const {
        cout << "Product{ name=" << name << ", price=" << price << "}" << endl;
    }

    // WHY THROW BY VALUE? Objects thrown by value are copied safely into
    // a dedicated exception memory region outside the regular function stack frame.
    void changePrice(float newPrice) {
        if (newPrice < 0) {
            throw NegativeValueException("Error: A negative value was entered for the price!\n");
        }
        this->price = newPrice;
    }

    virtual ~Product() = default;
};

// ==========================================
// 4. MULTIPLE INHERITANCE CHILD CLASSES
// ==========================================
class Cosmetics : public Product, public Discount {
private:
    int weight;

public:
    Cosmetics(const string name = "", const float price = 0, const int weight = 0)
        : Product(name, price) {
        this->weight = weight;
    }

    float discount_price() override {
        if (getPrice() / Discount::dollar > 20)
            return 0.86f * getPrice(); // 14% discount
        if (getPrice() / Discount::euro > 5)
            return 0.88f * getPrice(); // 12% discount
        return getPrice();
    }

    float price() override {
        return getPrice();
    }

    void print_rule() override {
        cout <<
                "All cosmetics more expensive than 5 Euros receive a 12% discount, while those over 20 Dollars receive a 14% discount."
                << endl;
    }
};

class FoodProduct : public Product, public Discount {
private:
    float calories;

public:
    FoodProduct(const string name = "", const float price = 0, const float calories = 0)
        : Product(name, price) {
        this->calories = calories;
    }

    float discount_price() override {
        return getPrice(); // Food has no discount rules applied
    }

    float price() override {
        return getPrice();
    }

    void print_rule() override {
        cout << "There is no active discount rule for food products." << endl;
    }
};

class Drinks : public Product, public Discount {
private:
    string brand;
    bool alcoholic;

public:
    Drinks(const string name = "", const float price = 0, const string brand = "", const bool alcoholic = false)
        : Product(name, price) {
        this->brand = brand;
        this->alcoholic = alcoholic;
    }

    float discount_price() override {
        if (this->alcoholic && (getPrice() / Discount::euro > 20))
            return 0.95f * getPrice(); // 5% discount
        if (!this->alcoholic && (this->brand == "Coca-Cola"))
            return 0.90f * getPrice(); // 10% discount
        return getPrice();
    }

    float price() override {
        return getPrice();
    }

    void print_rule() override {
        cout <<
                "Alcoholic beverages over 20 Euros get a 5% discount; non-alcoholic Coca-Cola products get a 10% discount."
                << endl;
    }
};

// ==========================================
// 5. GLOBAL CALCULATOR
// ==========================================
float total_discount(Discount **d, int n) {
    float cumulativeDiscountTotal = 0;
    for (int i = 0; i < n; ++i) {
        cumulativeDiscountTotal += d[i]->discount_price();
        cout << "Original Price: " << d[i]->price() << endl;
        cout << "With Discount: " << d[i]->discount_price() << endl;
        d[i]->print_rule();
    }
    return cumulativeDiscountTotal;
}

// ==========================================
// 6. MAIN EXECUTION
// ==========================================
int main() {
    int n = 0;
    float newPrice;
    Discount **d = new Discount *[10];

    d[n++] = new FoodProduct("Bread", 30);
    d[n++] = new Drinks("Whiskey", 1350, "Jack Daniel's", true);
    d[n++] = new FoodProduct("Cheese", 390, 105);
    d[n++] = new Drinks("Vodka", 850, "Finlandia", true);
    d[n++] = new Cosmetics("Cream", 720, 100);
    d[n++] = new Drinks("Soda", 50, "Coca-Cola", false);
    d[n++] = new Cosmetics("Perfume", 3500, 50);

    cout << "Total price of all items combined: " << total_discount(d, n) << endl;
    cout << "\nChanging pricing structures for Cosmetics entries:" << endl;

    for (int i = 0; i < n; ++i) {
        // WHY DYNAMIC_CAST? The array stores generic Discount* pointers.
        // We use dynamic_cast to check if the underlying object is a Cosmetics type.
        // If it isn't, it safely returns nullptr instead of crashing.
        Cosmetics *c = dynamic_cast<Cosmetics *>(d[i]);
        if (c != nullptr) {
            c->print();
            cin >> newPrice;
            try {
                c->changePrice(newPrice);
            }
            // WHY CATCH BY REFERENCE? Avoids runtime copy overhead and prevents
            // "Object Slicing" if you ever handle derived exception Hierarchies.
            catch (const NegativeValueException &e) {
                e.print();
            }
        }
    }

    // Dynamic memory cleanup tracking
    for (int i = 0; i < n; ++i) {
        delete d[i];
    }
    delete[] d;
    return 0;
}
