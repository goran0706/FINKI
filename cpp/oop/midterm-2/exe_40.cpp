#include<iostream>
#include<string.h>
using namespace std;

class Delo {
private:
    char name[50];
    int year;
    char country[50];

public:
    Delo(const char *name = "", int year = 0, const char *country = "") {
        strcpy(this->name, name);
        this->year = year;
        strcpy(this->country, country);
    }

    Delo(const Delo &delo) {
        strcpy(this->name, delo.name);
        this->year = delo.year;
        strcpy(this->country, delo.country);
    }

    Delo &operator=(const Delo &delo) {
        if (this != &delo) {
            strcpy(this->name, delo.name);
            this->year = delo.year;
            strcpy(this->country, delo.country);
        }
        return *this;
    }

    ~Delo() {
    }

    bool operator==(const Delo &delo) const {
        return strcmp(this->name, delo.name) == 0;
    }

    const char *getIme() const { return name; }
    int getYear() const { return year; }
    const char *getCountry() const { return country; }
};

class Pretstava {
protected:
    Delo object;
    int number;
    char date[15];

public:
    Pretstava(Delo object = Delo(), int number = 0, const char *date = "") {
        this->object = object;
        this->number = number;
        strcpy(this->date, date);
    }

    Pretstava(const Pretstava &p) {
        this->object = p.object;
        this->number = p.number;
        strcpy(this->date, p.date);
    }

    Pretstava &operator=(const Pretstava &p) {
        if (this != &p) {
            this->object = p.object;
            this->number = p.number;
            strcpy(this->date, p.date);
        }
        return *this;
    }

    virtual ~Pretstava() {
    }

    int getNumber() {
        return number;
    }

    virtual float cena() {
        int n = 0, m = 0;
        if (strcmp(object.getCountry(), "Italija") == 0) {
            n = 100;
        } else if (strcmp(object.getCountry(), "Rusija") == 0) {
            n = 150;
        } else {
            n = 80;
        }

        int year = object.getYear();
        if (year >= 1901 && year <= 2100) {
            m = 50;
        } else if (year >= 1801 && year <= 1900) {
            m = 75;
        } else if (year <= 1800) {
            m = 100;
        }
        return n + m;
    }

    Delo getDelo() const { return object; }
};

class Opera : public Pretstava {
public:
    Opera(Delo object = Delo(), int number = 0, const char *date = "") : Pretstava(object, number, date) {
    }

    Opera(const Opera &o) : Pretstava(o) {
    }

    Opera &operator=(const Opera &o) {
        Pretstava::operator=(o);
        return *this;
    }

    ~Opera() {
    }

    float cena() override {
        return Pretstava::cena();
    }
};

class Balet : public Pretstava {
private:
    static float price;

public:
    Balet(Delo object = Delo(), int number = 0, const char *date = "") : Pretstava(object, number, date) {
    }

    Balet(const Balet &b) : Pretstava(b) {
    }

    Balet &operator=(const Balet &b) {
        Pretstava::operator=(b);
        return *this;
    }

    ~Balet() {
    }

    static void setCenaBalet(int newPrice) {
        price = newPrice;
    }

    float cena() override {
        return Pretstava::cena() + price;
    }
};

float Balet::price = 150;

// Functions
float prihod(Pretstava **array, int n) {
    float sum = 0;
    for (int i = 0; i < n; ++i) {
        sum += array[i]->cena() * array[i]->getNumber();
    }
    return sum;
}

int brojPretstaviNaDelo(Pretstava **array, int n, Delo &d) {
    int count = 0;
    for (int i = 0; i < n; ++i) {
        if (array[i]->getDelo() == d) {
            count++;
        }
    }
    return count;
}

//citanje na delo
Delo readDelo() {
    char ime[50];
    int godina;
    char zemja[50];
    cin >> ime >> godina >> zemja;
    return Delo(ime, godina, zemja);
}

//citanje na pretstava
Pretstava *readPretstava() {
    int tip; //0 za Balet , 1 za Opera
    cin >> tip;
    Delo d = readDelo();
    int brojProdadeni;
    char data[15];
    cin >> brojProdadeni >> data;
    if (tip == 0) return new Balet(d, brojProdadeni, data);
    else return new Opera(d, brojProdadeni, data);
}

int main() {
    int test_case;
    cin >> test_case;

    switch (test_case) {
        case 1:
            //Testiranje na klasite Opera i Balet
        {
            cout << "======TEST CASE 1=======" << endl;
            Pretstava *p1 = readPretstava();
            cout << p1->getDelo().getIme() << endl;
            Pretstava *p2 = readPretstava();
            cout << p2->getDelo().getIme() << endl;
        }
        break;

        case 2:
            //Testiranje na  klasite Opera i Balet so cena
        {
            cout << "======TEST CASE 2=======" << endl;
            Pretstava *p1 = readPretstava();
            cout << p1->cena() << endl;
            Pretstava *p2 = readPretstava();
            cout << p2->cena() << endl;
        }
        break;

        case 3:
            //Testiranje na operator ==
        {
            cout << "======TEST CASE 3=======" << endl;
            Delo f1 = readDelo();
            Delo f2 = readDelo();
            Delo f3 = readDelo();

            if (f1 == f2) cout << "Isti se" << endl;
            else cout << "Ne se isti" << endl;
            if (f1 == f3) cout << "Isti se" << endl;
            else cout << "Ne se isti" << endl;
        }
        break;

        case 4:
            //testiranje na funkcijata prihod
        {
            cout << "======TEST CASE 4=======" << endl;
            int n;
            cin >> n;
            Pretstava **pole = new Pretstava *[n];
            for (int i = 0; i < n; i++) {
                pole[i] = readPretstava();
            }
            cout << prihod(pole, n);
        }
        break;

        case 5:
            //testiranje na prihod so izmena na cena za 3d proekcii
        {
            cout << "======TEST CASE 5=======" << endl;
            int cenaBalet;
            cin >> cenaBalet;
            Balet::setCenaBalet(cenaBalet);
            int n;
            cin >> n;
            Pretstava **pole = new Pretstava *[n];
            for (int i = 0; i < n; i++) {
                pole[i] = readPretstava();
            }
            cout << prihod(pole, n);
        }
        break;

        case 6:
            //testiranje na brojPretstaviNaDelo
        {
            cout << "======TEST CASE 6=======" << endl;
            int n;
            cin >> n;
            Pretstava **pole = new Pretstava *[n];
            for (int i = 0; i < n; i++) {
                pole[i] = readPretstava();
            }

            Delo f = readDelo();
            cout << brojPretstaviNaDelo(pole, n, f);
        }
        break;
    };


    return 0;
}
