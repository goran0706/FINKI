#include <iostream>
#include <cstring>
using namespace std;

class NegativnaVrednost {
public:
    void message() {
        cout << "Oglasot ima nevalidna vrednost za cenata i nema da bide evidentiran!" << endl;
    }
};

class Oglas {
protected:
    char naslov[51];
    char kategorija[31];
    char opis[101];
    float cena;

public:
    Oglas() {
        *naslov = '\0';
        *kategorija = '\0';
        *opis = '\0';
        cena = 0.0;
    }

    Oglas(char *naslov, char *kategorija, char *opis, float cena) {
        strcpy(this->naslov, naslov);
        strcpy(this->kategorija, kategorija);
        strcpy(this->opis, opis);
        this->cena = cena;
    }

    Oglas(const Oglas &g) {
        strcpy(this->naslov, g.naslov);
        strcpy(this->kategorija, g.kategorija);
        strcpy(this->opis, g.opis);
        this->cena = g.cena;
    }

    bool operator >(const Oglas &og) const {
        return cena > og.cena;
    }

    friend ostream &operator<<(ostream &out, const Oglas &g) {
        out << g.naslov << endl;
        out << g.opis << endl;
        out << g.cena << " evra" << endl;
        cout << endl;
        return out;
    }

    friend class Oglasnik;
};

class Oglasnik {
private:
    char naziv[51];
    Oglas *oglasi;
    int n;

public:
    Oglasnik() {
        *naziv = '\0';
        oglasi = nullptr;
        n = 0;
    }

    Oglasnik(char *naziv) {
        strcpy(this->naziv, naziv);
        this->n = 0;
        this->oglasi = nullptr;
    }

    Oglasnik(const Oglasnik &g) {
        strcpy(this->naziv, g.naziv);
        this->n = g.n;
        this->oglasi = new Oglas[g.n];
        for (int i = 0; i < g.n; ++i) {
            this->oglasi[i] = g.oglasi[i];
        }
    }

    Oglasnik &operator=(const Oglasnik &g) {
        if (this != &g) {
            delete[] oglasi;
            strcpy(this->naziv, g.naziv);
            this->n = g.n;
            this->oglasi = new Oglas[g.n];
            for (int i = 0; i < g.n; ++i) {
                this->oglasi[i] = g.oglasi[i];
            }
        }
        return *this;
    }

    ~Oglasnik() {
        delete[] oglasi;
    }

    Oglasnik &operator+=(const Oglas &o) {
        if (o.cena < 0) {
            throw NegativnaVrednost();
        }
        Oglas *tmp = new Oglas[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = oglasi[i];
        }
        tmp[n++] = o;
        delete[] oglasi;
        oglasi = tmp;
        return *this;
    }

    friend ostream &operator<<(ostream &out, const Oglasnik &g) {
        cout << "FINKI-Oglasnik" << endl;
        for (int i = 0; i < g.n; ++i) {
            out << g.oglasi[i];
        }
        return out;
    }

    void oglasiOdKategorija(const char *k) {
        for (int i = 0; i < n; ++i) {
            if (strcmp(oglasi[i].kategorija, k) == 0) {
                cout << oglasi[i];
            }
        }
    }

    void najniskaCena() {
        if (n == 0) {
            cout << "Nema oglasi vo oglasnikot." << endl;
            return;
        }
        float minCena = oglasi[0].cena;
        int index = 0;
        for (int i = 1; i < n; ++i) {
            if (oglasi[i].cena < minCena) {
                minCena = oglasi[i].cena;
                index = i;
            }
        }
        cout << "Oglas so najniska cena: " << endl;
        cout << oglasi[index];
    }
};

int main() {
    char naslov[50];
    char kategorija[30];
    char opis[100];
    float cena;
    char naziv[50];
    char k[30];
    int n;

    int tip;
    cin >> tip;

    if (tip == 1) {
        cout << "-----Test Oglas & operator <<-----" << endl;
        cin.get();
        cin.getline(naslov, 49);
        cin.getline(kategorija, 29);
        cin.getline(opis, 99);
        cin >> cena;
        Oglas o(naslov, kategorija, opis, cena);
        cout << o;
    } else if (tip == 2) {
        cout << "-----Test Oglas & operator > -----" << endl;
        cin.get();
        cin.getline(naslov, 49);
        cin.getline(kategorija, 29);
        cin.getline(opis, 99);
        cin >> cena;
        Oglas o1(naslov, kategorija, opis, cena);
        cin.get();
        cin.getline(naslov, 49);
        cin.getline(kategorija, 29);
        cin.getline(opis, 99);
        cin >> cena;
        Oglas o2(naslov, kategorija, opis, cena);
        if (o1 > o2) cout << "Prviot oglas e poskap." << endl;
        else cout << "Prviot oglas ne e poskap." << endl;
    } else if (tip == 3) {
        cout << "-----Test Oglasnik, operator +=, operator << -----" << endl;
        cin.get();
        cin.getline(naziv, 49);
        cin >> n;
        Oglasnik ogl(naziv);
        for (int i = 0; i < n; i++) {
            cin.get();
            cin.getline(naslov, 49);
            cin.getline(kategorija, 29);
            cin.getline(opis, 99);
            cin >> cena;
            try {
                Oglas o(naslov, kategorija, opis, cena);
                ogl += o;
            } catch (NegativnaVrednost &e) {
                e.message();
            }
        }
        cout << ogl;
    } else if (tip == 4) {
        cout << "-----Test oglasOdKategorija -----" << endl;
        cin.get();
        cin.getline(naziv, 49);
        cin >> n;
        Oglasnik ogl(naziv);
        for (int i = 0; i < n; i++) {
            cin.get();
            cin.getline(naslov, 49);
            cin.getline(kategorija, 29);
            cin.getline(opis, 99);
            cin >> cena;
            Oglas o(naslov, kategorija, opis, cena);
            ogl += o;
        }
        cin.get();
        cin.getline(k, 29);
        cout << "Oglasi od kategorijata: " << k << endl;
        ogl.oglasiOdKategorija(k);
    } else if (tip == 5) {
        cout << "-----Test Exception -----" << endl;
        cin.get();
        cin.getline(naziv, 49);
        cin >> n;
        Oglasnik ogl(naziv);
        for (int i = 0; i < n; i++) {
            cin.get();
            cin.getline(naslov, 49);
            cin.getline(kategorija, 29);
            cin.getline(opis, 99);
            cin >> cena;
            try {
                Oglas o(naslov, kategorija, opis, cena);
                ogl += o;
            } catch (NegativnaVrednost &e) {
                e.message();
            }
        }
        cout << ogl;
    } else if (tip == 6) {
        cout << "-----Test najniskaCena -----" << endl;
        cin.get();
        cin.getline(naziv, 49);
        cin >> n;
        Oglasnik ogl(naziv);
        for (int i = 0; i < n; i++) {
            cin.get();
            cin.getline(naslov, 49);
            cin.getline(kategorija, 29);
            cin.getline(opis, 99);
            cin >> cena;
            Oglas o(naslov, kategorija, opis, cena);
            ogl += o;
        }
        ogl.najniskaCena();
    } else if (tip == 7) {
        cout << "-----Test All -----" << endl;
        cin.get();
        cin.getline(naziv, 49);
        cin >> n;
        Oglasnik ogl(naziv);
        for (int i = 0; i < n; i++) {
            cin.get();
            cin.getline(naslov, 49);
            cin.getline(kategorija, 29);
            cin.getline(opis, 99);
            cin >> cena;
            try {
                Oglas o(naslov, kategorija, opis, cena);
                ogl += o;
            } catch (NegativnaVrednost &e) {
                e.message();
            }
        }
        cout << ogl;
        cin.get();
        cin.get();
        cin.getline(k, 29);
        cout << "Oglasi od kategorijata: " << k << endl;
        ogl.oglasiOdKategorija(k);
        ogl.najniskaCena();
    }

    return 0;
}
