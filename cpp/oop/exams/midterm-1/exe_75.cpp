#include <iostream>
#include <cstring>
using namespace std;

class Pica {
private:
    char ime[15];
    int cena;
    char *sostojki;
    int namaluvanje;

public:
    Pica(char *ime = "", int cena = 0, char *sostojki = "", int namaluvanje = 0) {
        strcpy(this->ime, ime);
        this->cena = cena;
        this->sostojki = new char [strlen(sostojki) + 1];
        strcpy(this->sostojki, sostojki);
        this->namaluvanje = namaluvanje;
    }

    Pica(const Pica &p) {
        strcpy(this->ime, p.ime);
        this->cena = p.cena;
        this->sostojki = new char [strlen(p.sostojki) + 1];
        strcpy(this->sostojki, p.sostojki);
        this->namaluvanje = p.namaluvanje;
    }

    Pica &operator =(const Pica &p) {
        if (this != &p) {
            delete [] sostojki;
            strcpy(this->ime, p.ime);
            this->cena = p.cena;
            this->sostojki = new char [strlen(p.sostojki) + 1];
            strcpy(this->sostojki, p.sostojki);
            this->namaluvanje = p.namaluvanje;
        }
        return *this;
    }

    ~Pica() {
        delete [] sostojki;
    }

    void pecati() {
        int cenaa;
        if (namaluvanje == 0) {
            cenaa = cena;
            cout << ime << "-" << sostojki << "," << cenaa << endl;
        } else {
            cenaa = cena - ((cena * namaluvanje) / 100);
            cout << ime << " - " << sostojki << ", " << cena << " " << cenaa << endl;
        }
    }

    bool istiSe(Pica &p) {
        if (strcmp(sostojki, p.sostojki) == 0) {
            return true;
        } else {
            return false;
        }
    }

    int getNamaluvanje() {
        return namaluvanje;
    }
};

class Picerija {
private:
    char ime[15];
    Pica *pici;
    int n;

public:
    Picerija(char *ime = "") {
        strcpy(this->ime, ime);
        this->n = 0;
        pici = new Pica [n];
    }

    Picerija(const Picerija &p) {
        strcpy(this->ime, p.ime);
        this->n = p.n;
        pici = new Pica [n];
        for (int i = 0; i < n; i++) {
            pici[i] = p.pici[i];
        }
    }

    Picerija &operator =(const Picerija &p) {
        if (this != &p) {
            delete [] pici;
            strcpy(this->ime, p.ime);
            this->n = p.n;
            pici = new Pica [n];
            for (int i = 0; i < n; i++) {
                pici[i] = p.pici[i];
            }
        }
        return *this;
    }

    ~Picerija() {
        delete [] pici;
    }

    Picerija &operator+=(Pica &p) {
        bool flag = true;
        for (int i = 0; i < n; i++) {
            if (pici[i].istiSe(p)) {
                flag = false;
            }
        }
        if (flag) {
            Pica *temp = new Pica [n + 1];
            for (int i = 0; i < n; i++) {
                temp[i] = pici[i];
            }
            delete [] pici;
            temp[n] = p;
            pici = temp;
            n++;
        }
        return *this;
    }

    void piciNaPromocija() {
        for (int i = 0; i < n; i++) {
            if (pici[i].getNamaluvanje() > 0) {
                pici[i].pecati();
            }
        }
    }

    void setIme(char *ime) {
        strcpy(this->ime, ime);
    }

    char *getIme() {
        return ime;
    }
};

int main() {
    int n;
    char ime[15];
    cin >> ime;
    cin >> n;

    Picerija p1(ime);
    for (int i = 0; i < n; i++) {
        char imp[100];
        cin.get();
        cin.getline(imp, 100);
        int cena;
        cin >> cena;
        char sostojki[100];
        cin.get();
        cin.getline(sostojki, 100);
        int popust;
        cin >> popust;
        Pica p(imp, cena, sostojki, popust);
        p1 += p;
    }

    Picerija p2 = p1;
    cin >> ime;
    p2.setIme(ime);
    char imp[100];
    cin.get();
    cin.getline(imp, 100);
    int cena;
    cin >> cena;
    char sostojki[100];
    cin.get();
    cin.getline(sostojki, 100);
    int popust;
    cin >> popust;
    Pica p(imp, cena, sostojki, popust);
    p2 += p;

    cout << p1.getIme() << endl;
    cout << "Pici na promocija:" << endl;
    p1.piciNaPromocija();

    cout << p2.getIme() << endl;
    cout << "Pici na promocija:" << endl;
    p2.piciNaPromocija();

    return 0;
}
