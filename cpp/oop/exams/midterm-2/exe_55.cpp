#include<iostream>
#include<cstring>
using namespace std;

class OutOfBoundException : exception {
public:
    void message() {
        cout << "Brojot na pin kodovi ne moze da go nadmine dozvolenoto" << endl;
    }
};

class Karticka {
protected:
    char smetka[16];
    int pin;
    bool povekjePin;

public:
    Karticka(const char *smetka = "", int pin = 0) {
        strcpy(this->smetka, smetka);
        this->pin = pin;
        povekjePin = false;
    }

    Karticka(const Karticka &k) {
        strcpy(this->smetka, k.smetka);
        this->pin = k.pin;
        this->povekjePin = k.povekjePin;
    }

    Karticka &operator=(const Karticka &k) {
        if (this != &k) {
            strcpy(this->smetka, k.smetka);
            this->pin = k.pin;
            this->povekjePin = k.povekjePin;
        }
        return *this;
    }

    virtual ~Karticka() {
    }

    virtual int tezinaProbivanje() const {
        int temp = pin, count = 0;
        while (temp) {
            count++;
            temp /= 10;
        }
        return count;
    }

    friend ostream &operator<<(ostream &out, const Karticka &k) {
        out << k.smetka << ": " << k.tezinaProbivanje();
        return out;
    }

    char *getSmetka() {
        return smetka;
    }

    virtual bool getDopolnitelenPin() {
        return povekjePin;
    }
};

class SpecijalnaKarticka : public Karticka {
private:
    int *dopolnitelniPin;
    int broj;
    static const int P = 4;

public:
    SpecijalnaKarticka(const char *smetka = "", int pin = 0) : Karticka(smetka, pin) {
        dopolnitelniPin = new int[0];
        broj = 0;
        povekjePin = true;
    }

    SpecijalnaKarticka(const SpecijalnaKarticka &s) : Karticka(s) {
        broj = s.broj;
        dopolnitelniPin = new int[broj];
        for (int i = 0; i < broj; i++) {
            dopolnitelniPin[i] = s.dopolnitelniPin[i];
        }
    }

    SpecijalnaKarticka &operator=(const SpecijalnaKarticka &s) {
        if (this != &s) {
            Karticka::operator=(s);
            delete[] dopolnitelniPin;
            broj = s.broj;
            dopolnitelniPin = new int[broj];
            for (int i = 0; i < broj; i++) {
                dopolnitelniPin[i] = s.dopolnitelniPin[i];
            }
        }
        return *this;
    }

    ~SpecijalnaKarticka() {
        delete[] dopolnitelniPin;
    }

    int tezinaProbivanje() const override {
        return Karticka::tezinaProbivanje() + broj;
    }

    // SpecijalnaKarticka& operator+=(int novPin) {
    //     if (broj >= P) throw OutOfBoundException();
    //     int* tmp = new int[broj + 1];
    //     for (int i = 0; i < broj; i++) {
    //         tmp[i] = dopolnitelniPin[i];
    //     }
    //     tmp[broj++] = novPin;
    //     delete[] dopolnitelniPin;
    //     dopolnitelniPin = tmp;
    //     return *this;
    // }
    SpecijalnaKarticka &operator+=(int novPin) {
        if (broj >= P) {
            throw OutOfBoundException();
        }
        int *temp = new int[broj + 1];
        for (int i = 0; i < broj; i++) {
            temp[i] = dopolnitelniPin[i];
        }
        temp[broj] = novPin;
        delete[] dopolnitelniPin;
        dopolnitelniPin = temp;
        broj++;
        return *this;
    }

    bool getDopolnitelenPin() override {
        return true;
    }
};

class Banka {
private:
    char naziv[30];
    Karticka *karticki[20];
    int broj;
    static int LIMIT;

public:
    Banka(char *naziv, Karticka **karticki, int broj) {
        strcpy(this->naziv, naziv);
        this->broj = broj;
        for (int i = 0; i < broj; i++) {
            if (karticki[i]->getDopolnitelenPin()) {
                this->karticki[i] = new SpecijalnaKarticka(*dynamic_cast<SpecijalnaKarticka *>(karticki[i]));
            } else {
                this->karticki[i] = new Karticka(*karticki[i]);
            }
        }
    }

    ~Banka() {
        for (int i = 0; i < broj; i++) {
            delete karticki[i];
        }
    }

    static void setLIMIT(int l) {
        LIMIT = l;
    }

    void pecatiKarticki() {
        cout << "Vo bankata " << naziv << " moze da se probijat kartickite:" << endl;
        for (int i = 0; i < broj; i++) {
            if (karticki[i]->tezinaProbivanje() <= LIMIT) {
                cout << *karticki[i] << endl;
            }
        }
    }

    // void dodadiDopolnitelenPin(char * smetka, int novPin) {
    //     for (int i = 0; i < broj; i++) {
    //         if (strcmp(karticki[i]->getSmetka(), smetka) == 0) {
    //             SpecijalnaKarticka* sk = dynamic_cast<SpecijalnaKarticka*>(karticki[i]);
    //             if (sk) {
    //                 try {
    //                     *sk += novPin;
    //                 } catch (OutOfBoundException& e) {
    //                     e.message();
    //                 }
    //             }
    //             return;
    //         }
    //     }
    // }
    void dodadiDopolnitelenPin(char *smetka, int novPin) {
        for (int i = 0; i < broj; i++) {
            if (strcmp(karticki[i]->getSmetka(), smetka) == 0) {
                SpecijalnaKarticka *sk = dynamic_cast<SpecijalnaKarticka *>(karticki[i]);
                if (sk) {
                    try {
                        *sk += novPin;
                    } catch (OutOfBoundException &e) {
                        e.message();
                    }
                }
                break;
            }
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

        komercijalna.dodadiDopolnitelenPin(smetka, pin);
    }

    Banka::setLIMIT(5);

    komercijalna.pecatiKarticki();
}
