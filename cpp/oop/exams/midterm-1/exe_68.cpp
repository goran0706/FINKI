#include <iostream>
#include <cstring>
using namespace std;

class Gitara {
private:
    char SNnumber[25];
    float boughtPrice;
    int Year;
    char type[40];

public:
    Gitara(const char *type = "", const char *SNnumber = "", const int Year = 0, const float boughtPrice = 0) {
        strcpy(this->SNnumber, SNnumber);
        this->boughtPrice = boughtPrice;
        this->Year = Year;
        strcpy(this->type, type);
    }

    Gitara(const Gitara &g) {
        strcpy(this->SNnumber, g.SNnumber);
        this->boughtPrice = g.boughtPrice;
        this->Year = g.Year;
        strcpy(this->type, g.type);
    }

    ~Gitara() {
    }

    bool daliIsti(Gitara &g) {
        if (strcmp(g.SNnumber, this->SNnumber) == 0) {
            return true;
        }
        return false;
    }

    void pecati() {
        cout << SNnumber << " " << type << " " << boughtPrice << endl;
    }

    float getBoughtPrice() {
        return boughtPrice;
    }

    char *getSnnumber() {
        return SNnumber;
    }

    int getYear() {
        return Year;
    }

    char *getTip() {
        return type;
    }

    char *getSeriski() {
        return SNnumber;
    }

    int getGodina() {
        return Year;
    }

    float getNabavna() {
        return boughtPrice;
    }
};

class Magacin {
private:
    char nameOfStorage[30];
    char location[60];
    Gitara *gitara;
    int n;
    int yearOfOpening;

public:
    Magacin(const char *nameOfStorage = "", const char *location = "", const int yearOfOpening = 0) {
        strcpy(this->nameOfStorage, nameOfStorage);
        strcpy(this->location, location);
        this->yearOfOpening = yearOfOpening;
        n = 0;
        gitara = new Gitara[n];
    }

    Magacin(const Magacin &g) {
        strcpy(this->nameOfStorage, g.nameOfStorage);
        strcpy(this->location, g.location);
        this->yearOfOpening = g.yearOfOpening;
        n = g.n;
        gitara = new Gitara[n];
    }

    Magacin &operator=(const Magacin &g) {
        if (this != &g) {
            delete [] gitara;
            strcpy(this->nameOfStorage, g.nameOfStorage);
            strcpy(this->location, g.location);
            this->yearOfOpening = g.yearOfOpening;
            n = g.n;
            gitara = new Gitara[n];
            for (int i = 0; i < n; i++) {
                gitara[i] = g.gitara[i];
            }
        }
        return *this;
    }

    ~Magacin() {
        delete [] gitara;
    }

    // void pecati() {
    //     for (int i=0; i<n; i++) {
    //         gitara[i].pecati();
    //     }
    // }

    double vrednost() {
        double total = 0;
        for (int i = 0; i < n; i++) {
            total += gitara[i].getBoughtPrice();
        }
        return total;
    }

    void dodadi(Gitara &d) {
        Gitara *temp = new Gitara[n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = gitara[i];
        }
        temp[n] = d;
        delete [] gitara;
        gitara = temp;
        n++;
    }

    void prodadi(Gitara &p) {
        for (int i = 0; i < n; i++) {
            if (strcmp(gitara[i].getSnnumber(), p.getSnnumber()) == 0) {
                for (int j = i; j < n - 1; j++) {
                    gitara[j] = gitara[j + 1];
                }
                n--;
            }
        }
        int index = 0;
        for (int i = 0; i < n; i++) {
            if (strcmp(gitara[i].getSnnumber(), p.getSnnumber()) == 0) {
                index = i;
            }
        }
        for (int i = index; i < n - 1; i++) {
            gitara[i] = gitara[i + 1];
        }
        n--;
    }

    void pecati(bool daliNovi) {
        cout << nameOfStorage << " " << location << endl;
        for (int i = 0; i < n; i++) {
            if (daliNovi) {
                if (gitara[i].getYear() > yearOfOpening) {
                    gitara[i].pecati();
                }
            } else {
                gitara[i].pecati();
            }
        }
    }

    void Print() {
        for (int i = 0; i < n; i++) {
            gitara[i].pecati();
        }
    }
};

int main() {
    // se testira zadacata modularno
    int testCase;
    cin >> testCase;

    int n, godina;
    float cena;
    char seriski[50], tip[50];

    if (testCase == 1) {
        cout << "===== Testiranje na klasata Gitara ======" << endl;
        cin >> tip;
        cin >> seriski;
        cin >> godina;
        cin >> cena;
        Gitara g(tip, seriski, godina, cena);
        cout << g.getTip() << endl;
        cout << g.getSeriski() << endl;
        cout << g.getGodina() << endl;
        cout << g.getNabavna() << endl;
    } else if (testCase == 2) {
        cout << "===== Testiranje na klasata Magacin so metodot print() ======" << endl;
        Magacin kb("Magacin1", "Lokacija1");
        kb.pecati(false);
    } else if (testCase == 3) {
        cout << "===== Testiranje na klasata Magacin so metodot dodadi() ======" << endl;
        Magacin kb("Magacin1", "Lokacija1", 2005);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> tip;
            cin >> seriski;
            cin >> godina;
            cin >> cena;
            Gitara g(tip, seriski, godina, cena);
            cout << "gitara dodadi" << endl;
            kb.dodadi(g);
        }
        kb.pecati(true);
    } else if (testCase == 4) {
        cout << "===== Testiranje na klasata Magacin so metodot prodadi() ======" << endl;
        Magacin kb("Magacin1", "Lokacija1", 2012);
        cin >> n;
        Gitara brisi;
        for (int i = 0; i < n; i++) {
            cin >> tip;
            cin >> seriski;
            cin >> godina;
            cin >> cena;

            Gitara g(tip, seriski, godina, cena);
            if (i == 2)
                brisi = g;
            cout << "gitara dodadi" << endl;
            kb.dodadi(g);
        }
        kb.pecati(false);
        kb.prodadi(brisi);
        kb.pecati(false);
    } else if (testCase == 5) {
        cout << "===== Testiranje na klasata Magacin so metodot prodadi() i pecati(true) ======" << endl;
        Magacin kb("Magacin1", "Lokacija1", 2011);
        cin >> n;
        Gitara brisi;
        for (int i = 0; i < n; i++) {
            cin >> tip;
            cin >> seriski;
            cin >> godina;
            cin >> cena;

            Gitara g(tip, seriski, godina, cena);
            if (i == 2)
                brisi = g;
            cout << "gitara dodadi" << endl;
            kb.dodadi(g);
        }
        kb.pecati(true);
        kb.prodadi(brisi);
        cout << "Po brisenje:" << endl;
        Magacin kb3;
        kb3 = kb;
        kb3.pecati(true);
    } else if (testCase == 6) {
        cout << "===== Testiranje na klasata Magacin so metodot vrednost()======" << endl;
        Magacin kb("Magacin1", "Lokacija1", 2011);
        cin >> n;
        Gitara brisi;
        for (int i = 0; i < n; i++) {
            cin >> tip;
            cin >> seriski;
            cin >> godina;
            cin >> cena;

            Gitara g(tip, seriski, godina, cena);
            if (i == 2)
                brisi = g;
            kb.dodadi(g);
        }
        cout << kb.vrednost() << endl;
        kb.prodadi(brisi);
        cout << "Po brisenje:" << endl;
        cout << kb.vrednost();
        Magacin kb3;
        kb3 = kb;
    }
    return 0;
}
