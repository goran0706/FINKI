#include "iostream"
#include "cstring"

enum tip { POP, RAP, ROK };

using namespace std;

class Pesna {
private:
    char *name;
    int minuti;
    tip type;

public:
    Pesna(char *name = "", int minuti = 0, tip type = {}) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        this->minuti = minuti;
        this->type = type;
    }

    Pesna(const Pesna &p) {
        this->name = new char [strlen(p.name) + 1];
        strcpy(this->name, p.name);
        this->minuti = p.minuti;
        this->type = p.type;
    }

    Pesna &operator=(const Pesna &p) {
        if (this != &p) {
            delete[]name;
            this->name = new char [strlen(p.name) + 1];
            strcpy(this->name, p.name);
            this->minuti = p.minuti;
            this->type = p.type;
        }
        return *this;
    }

    ~Pesna() {
        delete[]name;
    }

    void pecati() {
        cout << "\"" << name << "\"-" << minuti << "min" << endl;
    }

    int getMinuti() const {
        return minuti;
    }

    tip getType() const {
        return type;
    }
};

class CD {
private:
    Pesna pesni[10];
    int brPesni;
    int maxVreme;
    int vkupnoVreme;

public:
    CD(int maxVreme = 0, int brPesni = 0) {
        this->brPesni = brPesni;
        this->maxVreme = maxVreme;
        this->vkupnoVreme = 0;
    }

    CD(const CD &cd) {
        this->brPesni = cd.brPesni;
        this->maxVreme = cd.maxVreme;
        for (int i = 0; i < cd.brPesni; ++i) {
            this->pesni[i] = cd.pesni[i];
        }
    }

    int getBroj() const {
        return brPesni;
    }

    Pesna getPesna(int p) {
        return pesni[p];
    }

    void dodadiPesna(const Pesna &p) {
        if (brPesni < 10 && (vkupnoVreme + p.getMinuti() <= maxVreme)) {
            pesni[brPesni] = p;
            brPesni++;
            vkupnoVreme += p.getMinuti();
        }
    }

    void pecatiPesniPoTip(tip t) {
        for (int i = 0; i < brPesni; ++i) {
            if (pesni[i].getType() == t) {
                pesni[i].pecati();
            }
        }
    }
};

int main() {
    // se testira zadacata modularno
    int testCase;
    cin >> testCase;

    int n, minuti, kojtip;
    char ime[50];

    if (testCase == 1) {
        cout << "===== Testiranje na klasata Pesna ======" << endl;
        cin >> ime;
        cin >> minuti;
        cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
        Pesna p(ime, minuti, (tip) kojtip);
        p.pecati();
    } else if (testCase == 2) {
        cout << "===== Testiranje na klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < n; i++)
            (omileno.getPesna(i)).pecati();
    } else if (testCase == 3) {
        cout << "===== Testiranje na metodot dodadiPesna() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < omileno.getBroj(); i++)
            (omileno.getPesna(i)).pecati();
    } else if (testCase == 4) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((tip) kojtip);
    } else if (testCase == 5) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((tip) kojtip);
    }

    return 0;
}
