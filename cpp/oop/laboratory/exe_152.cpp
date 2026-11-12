// Класа Product чува информации за продукт во продавница.
//
// Приватни променливи:
// string name
// float price
// int quantity
//
// Методи:
// конструктор со параметри за сите полиња
// buy(int q) – ако има доволно quantity, намали ја количината и испечати "Successfully bought"; ако нема, испечати "Not enough stock"
// restock(int q) – ја зголемува количината
// changePrice(float newPrice) – ја менува цената само ако е позитивна
// print() – печати: <name> - $<price> - <quantity> pcs (price со 2 децимали)

#include "iostream"
using namespace std;

class Product {
private:
    string name;
    float price;
    int quantity;

public:
    Product(const string &name, float price, int quantity) {
        this->name = name;
        this->price = price;
        this->quantity = quantity;
    }

    void buy(int q) {
        if (quantity > q) {
            quantity -= q;
            cout << "Succesfully bought" << endl;
        } else {
            cout << "Not enough stock" << endl;
        }
    }

    void restock(int q) {
        quantity += q;
    }

    void changePrice(float newPrice) {
        if (price > 0) {
            price = newPrice;
        } else {
            price += newPrice;
        }
    }

    void print() {
        cout << name << " - $" << price << " - " << quantity << " pcs" << endl;
    }
};

int main() {
    Product p("Keyboard", 49.99, 10);
    int n, cmd, q;
    float newP;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> q;
                p.buy(q);
                p.print();
                break;
            case 2:
                cin >> q;
                p.restock(q);
                p.print();
                break;
            case 3:
                cin >> newP;
                p.changePrice(newP);
                p.print();
                break;
        }
    }
}
