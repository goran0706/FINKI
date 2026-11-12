// Да се дефинира класа InvoiceItem во која што ќе се чуваат податоци за една ставка во фактура:
//
// име на ставка (низа од максимум 100 карактери)
// цена на ставка (цел број)
// За класата да се дефинира copy конструктор, default конструктор и конструктор со аргументи.
// Доколку е потребно да се креира и get методи.
//
// Потоа да се креира класа Invoice во која што се чуваат следните податоци:
//
// број на фактура (низа од максимум 10 карактери)
// број на ставки во фактурата (цел број)
// низа од ставки во фактурата (низа од објекти од InvoiceItem класата, max 100)
// Да се креира конструктор со аргументи за класата.
// Доколку е потребно да се креира и get методи.
//
// Во класата да се креира метода totalPrice што ќе го пресметува вкупниот износ на фактурата.
// Вкупниот износ на фактурата се пресметува како збир од цените на сите ставки во нејзе.
// ДА НЕ СЕ МЕНУВА MAIN ФУНКЦИЈАТА.

#include "iostream"
#include "cstring"
using namespace std;

class InoviceItem {
private:
    char name[100];
    int price;

public:
    InoviceItem(char *name = "", int price = 0) {
        strcpy(this->name, name);
        this->price = price;
    }

    InoviceItem(const InoviceItem &ii) {
        strcpy(this->name, ii.name);
        this->price = ii.price;
    }

    void print() const {
        cout << "Item: " << name << ", Price: " << price << endl;
    }

    friend class Inovice;
};

class Inovice {
    char numInovice[10];
    int numInovices;
    InoviceItem items[100];

public:
    Inovice() {
    }

    Inovice(char *numInovice, int numInovices, InoviceItem *items) {
        strcpy(this->numInovice, numInovice);
        this->numInovices = numInovices;
        for (int i = 0; i < numInovices; ++i) {
            this->items[i] = items[i];
        }
    }

    int totalPrice() const {
        int sum = 0;
        for (int i = 0; i < numInovices; ++i) {
            sum += items[i].price;
        }
        return sum;
    }

    void print() const {
        cout << "Inovice Number: " << numInovice << endl;
        cout << "Number pf items: " << numInovices << endl;
        for (int i = 0; i < numInovices; ++i) {
            items[i].print();
        }
        cout << "Total price: " << totalPrice() << endl;
    }
};

int main() {
    char inoviceNumber[10];
    int numItems;
    cin >> inoviceNumber >> numItems;

    InoviceItem items[100];
    for (int i = 0; i < numItems; ++i) {
        char itemName[100];
        int price;
        cin >> itemName >> price;
        items[i] = InoviceItem(itemName, price);
    }
    Inovice inovice(inoviceNumber, numItems, items);
    inovice.print();


    return 0;
}
