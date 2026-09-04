#include "iostream"
#include "cstring"
using namespace std;

class Vozac {
protected:
    char ime[101];
    int vozrast;
    int trki;
    bool veteran;

public:
    Vozac() {
        *ime = '\0';
        vozrast = 0;
        trki = 0;
        veteran = false;
    }

    Vozac(char *ime, int vozrast, int trki, bool veteran) {
        strcpy(this->ime, ime);
        this->vozrast = vozrast;
        this->trki = trki;
        this->veteran = veteran;
    }

    virtual double zarabotuvachka() const = 0;

    virtual double danok() const = 0;

    bool operator ==(Vozac *other) const {
        return zarabotuvachka() == other->zarabotuvachka();
    }

    friend ostream &operator <<(ostream &out, const Vozac &v) {
        out << v.ime << endl;
        out << v.vozrast << endl;
        out << v.trki << endl;
        if (v.veteran) {
            cout << "VETERAN" << endl;
        }
        //        out<<v.zarabotuvachka()<<endl;
        return out;
    }
};

class Avtomobilist : public Vozac {
private:
    float cena;

public:
    Avtomobilist() : Vozac() {
        cena = 0;
    }

    Avtomobilist(char *ime, int vozrast, int trki, bool veteran, float cena) : Vozac(ime, vozrast, trki, veteran) {
        this->cena = cena;
    }

    double zarabotuvachka() const override {
        return (cena / 5);
    }

    double danok() const override {
        if (trki > 10) {
            return zarabotuvachka() * 0.15;
        }
        return zarabotuvachka() * 0.1;
    }
};

class Motociklist : public Vozac {
private:
    int mokjnost;

public:
    Motociklist() : Vozac() {
        mokjnost = 0;
    }

    Motociklist(char *ime, int vozrast, int trki, bool veteran, int moknost) : Vozac(ime, vozrast, trki, veteran) {
        this->mokjnost = moknost;
    }

    double zarabotuvachka() const override {
        return mokjnost * 20;
    }

    double danok() const override {
        if (veteran) {
            return zarabotuvachka() * 0.25;
        }
        return zarabotuvachka() * 0.20;
    }
};

int soIstaZarabotuvachka(Vozac **vozaci, int n, Vozac *pVozac) {
    int counter = 0;
    for (int i = 0; i < n; ++i) {
        if (vozaci[i]->operator==(pVozac)) {
            counter++;
        }
    }
    return counter;
}

int main() {
    int n, x;
    cin >> n >> x;
    Vozac **v = new Vozac *[n];
    char ime[100];
    int vozrast;
    int trki;
    bool vet;
    for (int i = 0; i < n; ++i) {
        cin >> ime >> vozrast >> trki >> vet;
        if (i < x) {
            float cena_avto;
            cin >> cena_avto;
            v[i] = new Avtomobilist(ime, vozrast, trki, vet, cena_avto);
        } else {
            int mokjnost;
            cin >> mokjnost;
            v[i] = new Motociklist(ime, vozrast, trki, vet, mokjnost);
        }
    }
    cout << "=== DANOK ===" << endl;
    for (int i = 0; i < n; ++i) {
        cout << *v[i];
        cout << v[i]->danok() << endl;
    }
    cin >> ime >> vozrast >> trki >> vet;
    int mokjnost;
    cin >> mokjnost;
    Vozac *vx = new Motociklist(ime, vozrast, trki, vet, mokjnost);
    cout << "=== VOZAC X ===" << endl;
    cout << *vx;
    cout << "=== SO ISTA ZARABOTUVACKA KAKO VOZAC X ===" << endl;
    cout << soIstaZarabotuvachka(v, n, vx);
    for (int i = 0; i < n; ++i) {
        delete v[i];
    }
    delete [] v;
    delete vx;
    return 0;
}
