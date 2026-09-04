#include <iostream>
#include <cstring>
using namespace std;

class Gitara {
private:
    char seriski[51];
    float cena; // nabavna
    int godina;
    char tip[51];

public:
    Gitara(char *tip = " ", char *seriski = " ", int godina = 0, float cena = 0.0) {
        strcpy(this->tip, tip);
        strcpy(this->seriski, seriski);
        this->godina = godina;
        this->cena = cena;
    }

    Gitara(const Gitara &g) {
        strcpy(this->tip, g.tip);
        strcpy(this->seriski, g.seriski);
        this->godina = g.godina;
        this->cena = g.cena;
    }

    bool daliIsti(const Gitara &g) {
        return strcmp(this->seriski, g.seriski) == 0;
    }

    void pecati() {
        cout << seriski << " " << tip << " " << cena << endl;
    }

    const char *getSeriski() const {
        return seriski;
    }

    float getNabavna() const {
        return cena;
    }

    int getGodina() const {
        return godina;
    }

    const char *getTip() const {
        return tip;
    }
};

class Magacin {
private:
    char name[30];
    char lokacija[60];
    Gitara *gitari;
    int brGitari;
    int godinaOtvaranje;

public:
    Magacin(char *name = "", char *lokacija = "", int godinaOtvaranje = 0) {
        strcpy(this->name, name);
        strcpy(this->lokacija, lokacija);
        this->godinaOtvaranje = godinaOtvaranje;
        this->gitari = nullptr;
        this->brGitari = 0;
    }

    Magacin(const Magacin &m) {
        strcpy(this->name, m.name);
        strcpy(this->lokacija, m.lokacija);
        this->godinaOtvaranje = m.godinaOtvaranje;
        this->brGitari = m.brGitari;
        this->gitari = new Gitara[brGitari];
        for (int i = 0; i < brGitari; ++i) {
            this->gitari[i] = m.gitari[i];
        }
    }

    Magacin &operator=(const Magacin &m) {
        if (this != &m) {
            delete[]gitari;
            strcpy(this->name, m.name);
            strcpy(this->lokacija, m.lokacija);
            this->godinaOtvaranje = m.godinaOtvaranje;
            this->brGitari = m.brGitari;
            this->gitari = new Gitara[brGitari];
            for (int i = 0; i < brGitari; ++i) {
                this->gitari[i] = m.gitari[i];
            }
        }
        return *this;
    }

    ~Magacin() {
        delete[]gitari;
    }

    double vrednost() {
        double suma = 0;
        for (int i = 0; i < brGitari; ++i) {
            suma += gitari[i].getNabavna();
        }
        return suma;
    }

    void dodadi(Gitara &d) {
        Gitara *tmp = new Gitara[brGitari + 1];
        for (int i = 0; i < brGitari; ++i) {
            tmp[i] = gitari[i];
        }
        tmp[brGitari++] = d;
        delete[]gitari;
        gitari = tmp;
    }

    void prodadi(Gitara &g) {
        int novBroj = 0;
        for (int i = 0; i < brGitari; ++i) {
            if (gitari[i].daliIsti(g) == false) {
                novBroj++;
            }
        }
        Gitara *tmp = new Gitara[novBroj];
        int j = 0;
        for (int i = 0; i < brGitari; ++i) {
            if (gitari[i].daliIsti(g) == false) {
                tmp[j] = gitari[i];
                j++;
            }
        }
        delete[]gitari;
        gitari = tmp;
        brGitari = novBroj;
    }

    void pecati(bool daliNovi) {
        cout << name << " " << lokacija << endl;
        for (int i = 0; i < brGitari; ++i) {
            if (daliNovi == true && gitari[i].getGodina() > godinaOtvaranje) {
                gitari[i].pecati();
            } else if (daliNovi == false) {
                gitari[i].pecati();
            }
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
