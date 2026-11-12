#include<iostream>
#include<cstring>
using namespace std;

class Patnik {
private:
    char name[101];
    int klasa;
    bool velosiped;

public:
    Patnik(char *name = "", int klasa = 0, bool velosiped = false) {
        strcpy(this->name, name);
        this->klasa = klasa;
        this->velosiped = velosiped;
    }

    Patnik(const Patnik &p) {
        strcpy(this->name, p.name);
        this->klasa = p.klasa;
        this->velosiped = p.velosiped;
    }

    friend ostream &operator<<(ostream &os, const Patnik &patnik) {
        os << patnik.name << endl;
        os << patnik.klasa << endl;
        os << patnik.velosiped << endl;
        return os;
    }

    bool isVelosiped() const {
        return velosiped;
    }

    int getKlasa() const {
        return klasa;
    }
};

class Voz {
private:
    char destinacija[101];
    Patnik *patnici;
    int brPatnici;
    int brTochaci;

public:
    Voz(char *destinacija = "", int brTochaci = 0) {
        strcpy(this->destinacija, destinacija);
        this->brTochaci = brTochaci;
        this->patnici = nullptr;
        this->brPatnici = 0;
    }

    Voz(const Voz &v) {
        strcpy(this->destinacija, v.destinacija);
        this->brTochaci = v.brTochaci;
        this->brPatnici = v.brPatnici;
        this->patnici = new Patnik[brPatnici];
        for (int i = 0; i < brPatnici; ++i) {
            this->patnici[i] = v.patnici[i];
        }
    }

    ~Voz() {
        delete[]patnici;
    }

    Voz &operator =(const Voz &v) {
        if (this != &v) {
            delete[]patnici;
            strcpy(this->destinacija, v.destinacija);
            this->brTochaci = v.brTochaci;
            this->brPatnici = v.brPatnici;
            this->patnici = new Patnik[brPatnici];
            for (int i = 0; i < brPatnici; ++i) {
                this->patnici[i] = v.patnici[i];
            }
        }
        return *this;
    }

    Voz &operator +=(const Patnik &v) {
        if (v.isVelosiped() && brTochaci == 0) {
            return *this;
        }
        Patnik *tmp = new Patnik[brPatnici + 1];
        for (int i = 0; i < brPatnici; ++i) {
            tmp[i] = patnici[i];
        }
        tmp[brPatnici] = v;
        delete[]patnici;
        patnici = tmp;
        brPatnici++;
        return *this;
    }

    friend ostream &operator<<(ostream &os, const Voz &voz) {
        os << voz.destinacija << endl;
        for (int i = 0; i < voz.brPatnici; ++i) {
            os << voz.patnici[i] << endl;
        }
        return os;
    }


    void patniciNemaMesto() {
        int K1 = 0;
        int K2 = 0;
        int tochaci = 0;

        for (int i = 0; i < brPatnici; ++i) {
            if (patnici[i].isVelosiped() && patnici[i].getKlasa() == 1) {
                if (tochaci < brTochaci) {
                    tochaci++;
                } else {
                    K1++;
                }
            }
        }

        for (int i = 0; i < brPatnici; ++i) {
            if (patnici[i].isVelosiped() && patnici[i].getKlasa() == 2) {
                if (tochaci < brTochaci) {
                    tochaci++;
                } else {
                    K2++;
                }
            }
        }
        cout << "Brojot na patnici od 1-va klasa koi ostanale bez mesto e: " << K1 << endl;
        cout << "Brojot na patnici od 2-ra klasa koi ostanale bez mesto e: " << K2 << endl;
    }
};


int main() {
    Patnik p;
    char ime[100], destinacija[100];
    int n;
    bool velosiped;
    int klasa;
    int maxv;
    cin >> destinacija >> maxv;
    cin >> n;
    Voz v(destinacija, maxv);
    //cout<<v<<endl;
    for (int i = 0; i < n; i++) {
        cin >> ime >> klasa >> velosiped;
        Patnik p(ime, klasa, velosiped);
        //cout<<p<<endl;
        v += p;
    }
    cout << v;
    v.patniciNemaMesto();

    return 0;
}
