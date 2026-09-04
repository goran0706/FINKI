#include <iostream>
#include <cstring>
using namespace std;

class AlcoholicDrink {
protected:
    char name[100];
    char country[100];
    float pAlc;
    float basePrice;
    static float discount;

public:
    virtual float computePrice() {
        return basePrice;
    }

    AlcoholicDrink(const char *name = "", const char *country = "", float pAlc = 0, float basePrice = 0) {
        strcpy(this->name, name);
        strcpy(this->country, country);
        this->pAlc = pAlc;
        this->basePrice = basePrice;
    }

    AlcoholicDrink(const AlcoholicDrink &other) {
        strcpy(this->name, other.name);
        strcpy(this->country, other.country);
        this->pAlc = other.pAlc;
        this->basePrice = other.basePrice;
    }

    AlcoholicDrink &operator=(const AlcoholicDrink &other) {
        if (this != &other) {
            strcpy(this->name, other.name);
            strcpy(this->country, other.country);
            this->pAlc = other.pAlc;
            this->basePrice = other.basePrice;
        }
        return *this;
    }

    ~AlcoholicDrink() {
    }

    friend ostream &operator<<(ostream &os, AlcoholicDrink &a) {
        cout << a.name << " " << a.country << " " << a.computePrice();
        return os;
    }

    bool operator <(AlcoholicDrink &other) {
        return computePrice() < other.computePrice();
    }

    char *getName() {
        return name;
    }

    char *getCountry() {
        return country;
    }

    static void changeDiscount(int d) {
        discount = d;
    }

    static float getDiscount() {
        return discount;
    }

    static void total(AlcoholicDrink **ad, int n) {
        float sum = 0.0;
        for (int i = 0; i < n; i++) {
            sum = sum + ad[i]->computePrice();
        }
        cout << "Total price: " << sum << endl;
        float withDiscount = sum - ((sum / 100) * discount);
        cout << "Total price with discount: " << withDiscount << endl;
    }
};

float AlcoholicDrink::discount = 5;

enum Type {
    wheat, barley
};

class Beer : public AlcoholicDrink {
private:
    Type type;

public:
    //percent name country price mainI
    Beer(float pAlc = 0, const char *name = "", const char *country = "", float basePrice = 0,
         bool type = true) : AlcoholicDrink(name, country, pAlc, basePrice) {
        if (type) {
            this->type = barley;
        } else {
            this->type = wheat;
        }
    }

    Beer(const Beer &other) {
        strcpy(this->name, other.name);
        strcpy(this->country, other.country);
        this->pAlc = other.pAlc;
        this->basePrice = other.basePrice;
        this->type = other.type;
    }

    Beer &operator=(const Beer &other) {
        if (this != &other) {
            strcpy(this->name, other.name);
            strcpy(this->country, other.country);
            this->pAlc = other.pAlc;
            this->basePrice = other.basePrice;
            this->type = other.type;
        }
        return *this;
    }

    ~Beer() {
    }

    float computePrice() override {
        float computedPrice = basePrice;
        if (strcmp(country, "Germany") == 0) {
            computedPrice = basePrice + ((basePrice / 100) * 5);
        }
        if (type == wheat) {
            computedPrice = basePrice + ((basePrice / 100) * 10);
        }
        return computedPrice;
    }
};

class Wine : public AlcoholicDrink {
private:
    int year;
    char grapes[20];

public:
    //percent name country price mainI year grapse
    Wine(float pAlc = 0, const char *name = "", const char *country = "", float basePrice = 0, int year = 0,
         const char *grapes = "") : AlcoholicDrink(name, country, pAlc, basePrice) {
        this->year = year;
        strcpy(this->grapes, grapes);
    }

    Wine(const Wine &other) {
        strcpy(this->name, other.name);
        strcpy(this->country, other.country);
        this->pAlc = other.pAlc;
        this->basePrice = other.basePrice;
        this->year = other.year;
        strcpy(this->grapes, other.grapes);
    }

    Wine &operator=(const Wine &other) {
        if (this != &other) {
            strcpy(this->name, other.name);
            strcpy(this->country, other.country);
            this->pAlc = other.pAlc;
            this->basePrice = other.basePrice;
            this->year = other.year;
            strcpy(this->grapes, other.grapes);
        }
        return *this;
    }

    ~Wine() {
    }

    float computePrice() {
        float computedPrice = basePrice;
        if (strcmp(country, "Italy") == 0) {
            computedPrice = basePrice + ((basePrice / 100) * 5);
        }
        if (year < 2005) {
            computedPrice = basePrice + ((basePrice / 100) * 15);
        }
        return computedPrice;
    }
};

void lowestPrice(AlcoholicDrink **a, int n) {
    if (n == 0) return;

    AlcoholicDrink *minDrink = a[0];
    for (int i = 1; i < n; i++) {
        if (*a[i] < *minDrink) {
            minDrink = a[i];
        }
    }
    cout << minDrink->getName() << " " << minDrink->getCountry() << " " << minDrink->computePrice() << endl;
}

int main() {
    int testCase;
    cin >> testCase;
    float p;
    char name[100];
    char country[100];
    float price;
    bool mainI;
    int year;
    char grape[20];
    //percent name country price mainI
    if (testCase == 1) {
        cout << "===== TESTING CONSTRUCTORS ======" << endl;
        cin >> p >> name >> country >> price >> mainI;
        Beer b(p, name, country, price, mainI);
        cout << b << endl;
        //percent name country price mainI year grapse
        cin >> p >> name >> country >> price >> year >> grape;
        Wine w(p, name, country, price, year, grape);
        cout << w << endl;
    } else if (testCase == 2) {
        cout << "===== TESTING LOWEST PRICE ======" << endl;
        int n;
        cin >> n;
        AlcoholicDrink **ad = new AlcoholicDrink *[n];
        for (int i = 0; i < n; ++i) {
            cin >> p >> name >> country >> price;
            if (i % 2 == 1) {
                cin >> mainI;
                ad[i] = new Beer(p, name, country, price, mainI);
            } else {
                cin >> year >> grape;
                ad[i] = new Wine(p, name, country, price, year, grape);
            }
        }

        lowestPrice(ad, n);
        for (int i = 0; i < n; ++i) {
            delete ad[i];
        }
        delete[] ad;
    } else if (testCase == 3) {
        cout << "===== TESTING DISCOUNT STATIC ======" << endl;
        int n;
        cin >> n;
        AlcoholicDrink **ad = new AlcoholicDrink *[n];
        for (int i = 0; i < n; ++i) {
            cin >> p >> name >> country >> price;
            if (i % 2 == 1) {
                cin >> mainI;
                ad[i] = new Beer(p, name, country, price, mainI);
            } else {
                cin >> year >> grape;
                ad[i] = new Wine(p, name, country, price, year, grape);
            }
        }

        AlcoholicDrink::total(ad, n);
        int d;
        cin >> d;
        AlcoholicDrink::changeDiscount(d);
        AlcoholicDrink::total(ad, n);

        for (int i = 0; i < n; ++i) {
            delete ad[i];
        }
        delete[] ad;
    }

    return 0;
}
