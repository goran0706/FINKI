#include <cstring>
#include <iostream>

using namespace std;

class Pizza {
protected:
    char name[21];
    char ingredients[101];
    float basePrice;

public:
    Pizza() {
        *name = '\0';
        *ingredients = '\0';
        basePrice = 0;
    }

    Pizza(char *name, char *ingredients, float basePrice) {
        strcpy(this->name, name);
        strcpy(this->ingredients, ingredients);
        this->basePrice = basePrice;
    }

    Pizza(const Pizza &p) {
        strcpy(this->name, p.name);
        strcpy(this->ingredients, p.ingredients);
        this->basePrice = p.basePrice;
    }

    virtual double price() const = 0;

    bool operator <(const Pizza &other) const {
        return price() < other.price();
    }
};

enum Size {
    small, medium, familly
};

class FlatPizza : public Pizza {
private:
    Size size;

public:
    //    FlatPizza():Pizza(){
    //        size =small;
    //    }
    FlatPizza(char *name = "", char *ingredients = "", float basePrice = 0, Size size = small) : Pizza(
        name, ingredients, basePrice) {
        this->size = size;
    }

    FlatPizza(const FlatPizza &c) : Pizza(c) {
        this->size = c.size;
    }

    double price() const override {
        if (size == 0) {
            return basePrice * 1.1;
        } else if (size == 1) {
            return basePrice * 1.2;
        } else if (size == 2) {
            return basePrice * 1.3;
        }
    }

    friend ostream &operator<<(ostream &out, FlatPizza &f) {
        out << f.name << ": " << f.ingredients << ", ";
        if (f.size == small) {
            out << "small";
        } else if (f.size == medium) {
            out << "medium";
        } else if (f.size == familly) {
            out << "family";
        }
        out << " - " << f.price() << endl;
        return out;
    }
};

class FoldedPizza : public Pizza {
private:
    bool isWhiteFlour;

public:
    FoldedPizza(char *name = "", char *ingredients = "", float basePrice = 0, bool isWhiteFlour = true) : Pizza(
        name, ingredients, basePrice) {
        this->isWhiteFlour = isWhiteFlour;
    }

    FoldedPizza(const FoldedPizza &f) : Pizza(f) {
        this->isWhiteFlour = f.isWhiteFlour;
    }

    double price() const override {
        if (isWhiteFlour) {
            return basePrice * 1.1;
        }
        return basePrice * 1.3;
    }

    friend ostream &operator<<(ostream &out, const FoldedPizza &f) {
        out << f.name << ": " << f.ingredients << ", ";
        if (f.isWhiteFlour) {
            out << "wf";
        } else {
            out << "nwf";
        }
        out << " - " << f.price() << endl;
        return out;
    }

    void setWhiteFlour(bool f) {
        this->isWhiteFlour = f;
    }
};

void expensivePizza(Pizza **pizzas, int n) {
    int index = 0;
    double max = pizzas[0]->price();
    for (int i = 0; i < n; ++i) {
        if (pizzas[i]->price() > max) {
            max = pizzas[i]->price();
            index = i;
        }
    }
    if (auto *fp = dynamic_cast<FlatPizza *>(pizzas[index])) {
        cout << *fp;
    } else if (auto *fdp = dynamic_cast<FoldedPizza *>(pizzas[index])) {
        cout << *fdp;
    }
}


int main() {
    int test_case;
    char name[20];
    char ingredients[100];
    float inPrice;
    Size size;
    bool whiteFlour;

    cin >> test_case;
    if (test_case == 1) {
        // Test Case FlatPizza - Constructor, operator <<, price
        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FlatPizza fp(name, ingredients, inPrice);
        cout << fp;
    } else if (test_case == 2) {
        // Test Case FlatPizza - Constructor, operator <<, price
        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        int s;
        cin >> s;
        FlatPizza fp(name, ingredients, inPrice, (Size) s);
        cout << fp;
    } else if (test_case == 3) {
        // Test Case FoldedPizza - Constructor, operator <<, price
        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FoldedPizza fp(name, ingredients, inPrice);
        cout << fp;
    } else if (test_case == 4) {
        // Test Case FoldedPizza - Constructor, operator <<, price
        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FoldedPizza fp(name, ingredients, inPrice);
        fp.setWhiteFlour(false);
        cout << fp;
    } else if (test_case == 5) {
        // Test Cast - operator <, price
        int s;

        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        cin >> s;
        FlatPizza *fp1 = new FlatPizza(name, ingredients, inPrice, (Size) s);
        cout << *fp1;

        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        cin >> s;
        FlatPizza *fp2 = new FlatPizza(name, ingredients, inPrice, (Size) s);
        cout << *fp2;

        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FoldedPizza *fp3 = new FoldedPizza(name, ingredients, inPrice);
        cout << *fp3;

        cin.get();
        cin.getline(name, 20);
        cin.getline(ingredients, 100);
        cin >> inPrice;
        FoldedPizza *fp4 = new FoldedPizza(name, ingredients, inPrice);
        fp4->setWhiteFlour(false);
        cout << *fp4;

        cout << "Lower price: " << endl;
        if (*fp1 < *fp2)
            cout << fp1->price() << endl;
        else cout << fp2->price() << endl;

        if (*fp1 < *fp3)
            cout << fp1->price() << endl;
        else cout << fp3->price() << endl;

        if (*fp4 < *fp2)
            cout << fp4->price() << endl;
        else cout << fp2->price() << endl;

        if (*fp3 < *fp4)
            cout << fp3->price() << endl;
        else cout << fp4->price() << endl;
    } else if (test_case == 6) {
        // Test Cast - expensivePizza
        int num_p;
        int pizza_type;

        cin >> num_p;
        Pizza **pi = new Pizza *[num_p];
        for (int j = 0; j < num_p; ++j) {
            cin >> pizza_type;
            if (pizza_type == 1) {
                cin.get();
                cin.getline(name, 20);

                cin.getline(ingredients, 100);
                cin >> inPrice;
                int s;
                cin >> s;
                FlatPizza *fp = new FlatPizza(name, ingredients, inPrice, (Size) s);
                cout << (*fp);
                pi[j] = fp;
            }
            if (pizza_type == 2) {
                cin.get();
                cin.getline(name, 20);
                cin.getline(ingredients, 100);
                cin >> inPrice;
                FoldedPizza *fp =
                        new FoldedPizza(name, ingredients, inPrice);
                if (j % 2)
                    (*fp).setWhiteFlour(false);
                cout << (*fp);
                pi[j] = fp;
            }
        }

        cout << endl;
        cout << "The most expensive pizza:\n";
        expensivePizza(pi, num_p);
    }
    return 0;
}
