#include<iostream>
#include "cstring"
using namespace std;

//место за вашиот код
class Delo {
private:
    char name[51];
    int year;
    char country[51];

public:
    Delo(const char *name = "", int year = 0, const char *country = "") {
        strcpy(this->name, name);
        this->year = year;
        strcpy(this->country, country);
    }

    bool operator==(const Delo &rhs) {
        return strcmp(name, rhs.name) == 0;
    }

    char *getIme() {
        return name;
    }

    int getYear() {
        return year;
    }

    char *getCountry() {
        return country;
    }
};

class Pretstava {
private:
    Delo delo;
    int karti;
    char date[16];

public:
    Pretstava(Delo delo = nullptr, int karti = 0, const char *date = "") {
        this->delo = delo;
        this->karti = karti;
        strcpy(this->date, date);
    }

    Delo getDelo() {
        return delo;
    }


    int getKarti() const {
        return karti;
    }

    virtual int cena() {
        int n, m;
        if (delo.getYear() > 1900) {
            n = 50;
        } else if (delo.getYear() > 1800) {
            n = 75;
        } else n = 100;

        if (strcmp(delo.getCountry(), "Italija") == 0) {
            m = 100;
        } else if (strcmp(delo.getCountry(), "Rusija") == 0) {
            m = 150;
        } else m = 80;

        return n + m;
    }
};

class Balet : public Pretstava {
    static int add;

public:
    Balet(Delo delo, int karti, char *date) : Pretstava(delo, karti, date) {
    }

    int cena() {
        return Pretstava::cena() + add;
    }

    static void setCenaBalet(int _price) {
        add = _price;
    }
};

int Balet::add = 150;

class Opera : public Pretstava {
public:
    Opera(Delo delo, int karti, char *date) : Pretstava(delo, karti, date) {
    }
};

int prihod(Pretstava **pPretstava, int n) {
    int total = 0;
    for (int i = 0; i < n; ++i) {
        total += pPretstava[i]->cena() * pPretstava[i]->getKarti();
    }
    return total;
}

int brojPretstaviNaDelo(Pretstava **pPretstava, int n, Delo d) {
    int counter = 0;
    for (int i = 0; i < n; ++i) {
        if (pPretstava[i]->getDelo() == d) {
            counter++;
        }
    }
    return counter;
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
