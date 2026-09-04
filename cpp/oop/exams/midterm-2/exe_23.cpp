#include<iostream>
#include<string.h>
using namespace std;

class Karticka {
protected:
    char smetka[16];
    int pin;
    bool povekjePin;

public:
    Karticka(char *smetka, int pin) {
        strcpy(this->smetka, smetka);
        this->pin = pin;
        this->povekjePin = false;
    }

    Karticka(const Karticka &k) {
        strcpy(this->smetka, k.smetka);
        this->pin = k.pin;
        this->povekjePin = k.povekjePin;
    }

    Karticka &operator =(const Karticka &k) {
        if (this != &k) {
            strcpy(this->smetka, k.smetka);
            this->pin = k.pin;
            this->povekjePin = k.povekjePin;
        }
        return *this;
    }

    virtual int tezinaProbivanje() {
        int p = pin;
        int counter = 0;
        while (p) {
            p /= 10;
            counter++;
        }
        return counter;
    }

    friend ostream &operator<<(ostream &os, Karticka &karticka) {
        os << karticka.smetka << ": " << karticka.tezinaProbivanje();
        return os;
    }

    char *getSmetka() {
        return smetka;
    }

    bool getDopolnitelenPin() {
        return povekjePin;
    }
};

class OutOfBoundsException {
public:
    void showMessage() {
        cout << "Brojot na pin kodovi ne moze da go nadimine dozolenoto" << endl;
    }
};


class SpecijalnaKarticka : public Karticka {
private:
    int *dop;
    int n;
    static const int P;

public:
    SpecijalnaKarticka(char *smetka, int pin) : Karticka(smetka, pin) {
        this->dop = new int [0];
        this->n = 0;
        this->povekjePin = true;
    }

    SpecijalnaKarticka(const SpecijalnaKarticka &s) : Karticka(s) {
        for (int i = 0; i < s.n; ++i) {
            this->dop[i] = s.dop[i];
        }
        this->n = s.n;
        this->povekjePin = s.povekjePin;
    }

    SpecijalnaKarticka &operator =(const SpecijalnaKarticka &s) {
        if (this != &s) {
            strcpy(this->smetka, s.smetka);
            this->pin = s.pin;
            this->povekjePin = s.povekjePin;
            delete[ ]dop;
            this->dop = new int [n];
            for (int i = 0; i < s.n; ++i) {
                this->dop[i] = s.dop[i];
            }
            this->n = s.n;
        }
        return *this;
    }

    SpecijalnaKarticka &operator +=(int pin) {
        if (n >= P) {
            throw OutOfBoundsException();
        }
        int *tmp = new int [n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = dop[i];
        }
        tmp[n++] = pin;
        delete[]dop;
        dop = tmp;
        return *this;
    }

    int tezinaProbivanje() {
        return Karticka::tezinaProbivanje() + n;
    }

    ~SpecijalnaKarticka() {
        delete[]dop;
    }
};

const int SpecijalnaKarticka::P = 4;

class Banka {
private:
    char naziv[30];
    Karticka *karticki[20];
    int broj;
    static int LIMIT;

public:
    Banka(char *naziv, Karticka **karticki, int broj) {
        strcpy(this->naziv, naziv);
        for (int i = 0; i < broj; ++i) {
            //ako kartichkata ima dopolnitelni pin kodovi
            if (karticki[i]->getDopolnitelenPin()) {
                this->karticki[i] = new SpecijalnaKarticka(*dynamic_cast<SpecijalnaKarticka *>(karticki[i]));
            } else {
                this->karticki[i] = new Karticka(*karticki[i]);
            }
        }
        this->broj = broj;
    }

    static void setLIMIT(int i) {
        LIMIT = i;
    }

    void pecatiKarticki() {
        cout << "Vo bankata " << naziv << " moze da se probijat kartickite:" << endl;
        for (int i = 0; i < broj; ++i) {
            if (karticki[i]->tezinaProbivanje() <= LIMIT) {
                cout << *karticki[i] << endl;
            }
        }
    }

    void dodadiDopolnitelenPin(char *smetka, int novPin) {
        for (int i = 0; i < broj; ++i) {
            if (strcmp(karticki[i]->getSmetka(), smetka) == 0) {
                SpecijalnaKarticka *spec = dynamic_cast<SpecijalnaKarticka *>(karticki[i]);
                if (spec) {
                    *spec += novPin;
                }
                break;
            }
        }
    }

    ~Banka() {
        for (int i = 0; i < broj; ++i) {
            delete karticki[i];
        }
    }
};

int Banka::LIMIT = 7;


int main() {
    Karticka **niza;
    int n, m, pin;
    char smetka[16];
    bool daliDopolnitelniPin;
    cin >> n;
    niza = new Karticka *[n];
    for (int i = 0; i < n; i++) {
        cin >> smetka;
        cin >> pin;
        cin >> daliDopolnitelniPin;
        if (!daliDopolnitelniPin)
            niza[i] = new Karticka(smetka, pin);
        else
            niza[i] = new SpecijalnaKarticka(smetka, pin);
    }

    Banka komercijalna("Komercijalna", niza, n);
    for (int i = 0; i < n; i++) delete niza[i];
    delete [] niza;
    cin >> m;
    for (int i = 0; i < m; i++) {
        cin >> smetka >> pin;
        try {
            komercijalna.dodadiDopolnitelenPin(smetka, pin);
        } catch (OutOfBoundsException e) {
            e.showMessage();
        }
    }

    Banka::setLIMIT(5);

    komercijalna.pecatiKarticki();
}
