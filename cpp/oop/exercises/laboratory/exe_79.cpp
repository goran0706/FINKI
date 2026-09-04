// Во оваа задача е потребно да уредите даден дом со маси.
// Креирајте класа Masa со следниве атрибути:
//
// должина (целобројна вредност)
// ширина (целобројна вредност)
// конструктор со и без параметри и метода pecati().
//
// Креирајте класа Soba која содржи:
//
// маса (објект од класата Маса)
// должина на собата (целобројна вредност)
// ширина на собата (целобројна вредност)
// конструктор со и без параметри и метода pecati() во која се повикува и pecati() за објектот Masa.
//
// Креирајте класа Kukja со атрибути:
//
// соба (објект од класата Soba)
// адреса (низа од 50 знаци), и соодветни методи.
// конструктор со и без параметри, деструктор и метода pecati() во која се повикува и pecati() за објектот Soba.

#include "iostream"
#include "cstring"
using namespace std;

class Masa {
private:
    int masaSirina;
    int masaDolzina;

public:
    Masa() {
    }

    Masa(int masaSirina, int masaDolzina) {
        this->masaSirina = masaSirina;
        this->masaDolzina = masaDolzina;
    }

    void print() {
        cout << " Masa: " << masaDolzina << " " << masaSirina;
    }
};

class Soba {
private:
    Masa masa;
    int sobaSirina;
    int sobaDolzina;

public:
    Soba() {
    }

    Soba(int sobaSirina, int sobaDolzina, Masa masa) {
        this->sobaSirina = sobaSirina;
        this->sobaDolzina = sobaDolzina;
        this->masa = masa;
    }

    void print() {
        cout << "Soba: " << sobaSirina << " " << sobaDolzina;
        masa.print();
    }
};

class Kukja {
private:
    Soba soba;
    char adresa[50];

public:
    Kukja(Soba soba, char *adresa) {
        this->soba = soba;
        strcpy(this->adresa, adresa);
    }

    void pecati() {
        cout << "Adresa: " << adresa;
        soba.print();
    }
};

int main() {
    int n;
    cin >> n;

    for (int i = 0; i < n; i++) {
        int masaSirina, masaDolzina;
        cin >> masaSirina >> masaDolzina;
        Masa m(masaSirina, masaDolzina);

        int sobaSirina, sobaDolzina;
        cin >> sobaSirina >> sobaDolzina;
        Soba s(sobaSirina, sobaDolzina, m);

        char adresa[30];
        cin.ignore();
        cin.getline(adresa, 30);

        Kukja k(s, adresa);
        k.pecati();
    }

    return 0;
}
