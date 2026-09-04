// Треба да се напише класа FoodItem која што ги има овие две чисти виртуелни функции:
//
// getPrice() - цена на храната
// getTime() - време за подготвување на храната
// Исто така, треба класата да ги има следните информации:
//
// type (динамички алоцирана низа од карактери) - типот на храната
// num(int)- количина на храната
// Понатаму, треба да креирате 2 подкласи на FoodItem наречени:
//
// Pizza
// teak
// Класата Pizza треба да ги има овие информации:
//
// ingredients (низа од карактери) - какво тесто е пицата
// Цана на едно тесто:
// - "wholeWheat" : 250
// - "glutenFree" : 350
//
// Време на правење на пица е 25 минути, независно од колку пици има.
// Ако се прават n пици потребна е n количина на тесто.
// Класата Steak треба да ги има овие информации:
//
// bool cooked (дали е well done или medium rare)
// Време на правење, независно колку steaks има:
//
// -  well done : 20 min
// -  medium rare: 15 min
// Цена на еден стек е 1300 ден.

// Треба исто така да напишете глобална функција:
// getMaxFoodItem(FoodItem[]) , која што ќе враќа покажувач до најскапиот FoodItem

#include <iostream>
#include <cstring>
using namespace std;

class FoodItem {
protected:
    char *type;
    int num;

public:
    FoodItem() {
        type = new char[0];
        num = 0;
    }

    FoodItem(char *type, int num) {
        this->num = num;
        this->type = new char[strlen(type) + 1];
        strcpy(this->type, type);
    }

    FoodItem(const FoodItem &f) {
        this->num = f.num;
        this->type = new char[strlen(f.type) + 1];
        strcpy(this->type, f.type);
    }

    FoodItem &operator=(const FoodItem &f) {
        if (this != &f) {
            delete[]type;
            this->num = f.num;
            this->type = new char[strlen(f.type) + 1];
            strcpy(this->type, f.type);
        }
        return *this;
    }

    ~FoodItem() {
        delete[]type;
    }

    char *getType() {
        return type;
    }

    virtual int getPrice() =0;

    virtual int getTime() =0;
};

class Pizza : public FoodItem {
    char *dough;

public:
    Pizza() : FoodItem() {
        dough = new char[0];
    }

    Pizza(char *type, int num, char *dough) : FoodItem(type, num) {
        this->dough = new char[strlen(dough) + 1];
        strcpy(this->dough, dough);
    }

    Pizza(const Pizza &p) {
        this->dough = new char[strlen(p.dough) + 1];
        strcpy(this->dough, p.dough);
    }

    Pizza &operator=(const Pizza &p) {
        if (this != &p) {
            delete[]dough;
            this->num = p.num;
            this->type = new char[strlen(p.type) + 1];
            strcpy(this->type, p.type);
            this->dough = new char[strlen(p.dough) + 1];
            strcpy(this->dough, p.dough);
        }
        return *this;
    }

    ~Pizza() {
        delete[]dough;
    }

    int getPrice() {
        if (strcmp(this->dough, "wholeWheat") == 0) {
            return num * 250;
        } else if (strcmp(this->dough, "glutenFree") == 0) {
            return num * 350;
        } else {
            return 0;
        }
    }

    int getTime() {
        return 25;
    }
};

class Steak : public FoodItem {
    bool cooked;

public:
    Steak() : FoodItem() {
    }

    Steak(char *type, int num, bool cooked) : FoodItem(type, num) {
        this->cooked = cooked;
    }

    int getPrice() {
        return num * 1300;
    }

    int getTime() {
        if (cooked == 1) {
            return 20;
        } else {
            return 15;
        }
    }

    ~Steak() {
    }
};

FoodItem *getMaxFoodItem(FoodItem **items, int num) {
    FoodItem *item = items[0];
    int max = items[0]->getPrice();
    for (int i = 0; i < num; i++) {
        if (items[i]->getPrice() > max) {
            max = items[i]->getPrice();
            item = items[i];
        }
    }
    return item;
}

int main() {
    FoodItem *p;
    int n;
    cin >> n;

    char type[30];
    char dough[30];
    bool cooked;
    int size;

    FoodItem *items[n];

    for (int i = 0; i < n; ++i) {
        cin >> type;
        cin >> size;


        if (strcmp(type, "pizza") == 0) {
            cin >> dough;
            items[i] = new Pizza(type, size, dough);
        } else {
            cin >> cooked;
            items[i] = new Steak(type, size, cooked);
        }
    }

    FoodItem *it = getMaxFoodItem(items, n);
    cout << "Type: " << it->getType() << endl;
    cout << "The max price is: " << it->getPrice() << endl;
    cout << "Time to cook: " << it->getTime();
    return 0;
}
