#include <iostream>
#include <cstring>
using namespace std;

enum Tip {
    LINUX, UNIX, WINDOWS
};

class OperativenSistem {
private:
    char *name;
    float verzija;
    Tip sistem;
    float size;

public:
    OperativenSistem(const char *name = "", const float verzija = 0, const Tip sistem = LINUX, const float size = 0) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        this->verzija = verzija;
        this->sistem = sistem;
        this->size = size;
    };

    OperativenSistem(const OperativenSistem &other) {
        this->name = new char [strlen(other.name) + 1];
        strcpy(this->name, other.name);
        this->verzija = other.verzija;
        this->sistem = other.sistem;
        this->size = other.size;
    }

    OperativenSistem &operator=(const OperativenSistem &other) {
        if (this != &other) {
            delete [] this->name;
            this->name = new char [strlen(other.name) + 1];
            strcpy(this->name, other.name);
            this->verzija = other.verzija;
            this->sistem = other.sistem;
            this->size = other.size;
        }
        return *this;
    }

    ~OperativenSistem() {
        delete [] name;
    }

    void pecati() {
        cout << "Ime: " << this->name;
        cout << " Verzija: " << this->verzija;
        cout << " Tip: " << this->sistem;
        cout << " Golemina:" << this->size << "GB";
        cout << endl;
    }

    bool ednakviSe(const OperativenSistem &os) {
        if (strcmp(os.name, this->name) == 0 && os.verzija == this->verzija && os.sistem == this->sistem && os.size ==
            this->size) {
            return true;
        }
        return false;
    }

    int sporediVerzija(const OperativenSistem &os) {
        if (os.verzija == this->verzija) {
            return 1;
        } else if (os.verzija > this->verzija) {
            return -1;
        } else {
            return 0;
        }
    }

    bool istaFamilija(const OperativenSistem &sporedba) {
        if (strcmp(this->name, sporedba.name) == 0 && this->sistem == sporedba.sistem) {
            return true;
        }
        return false;
    }
};

class Repozitorium {
private:
    char name[20];
    OperativenSistem *os;
    int n;

public:
    Repozitorium(const char *ime = "") {
        strcpy(this->name, ime);
        this->n = 0;
        this->os = new OperativenSistem[n];
    }

    Repozitorium(const Repozitorium &other) {
        strcpy(this->name, other.name);
        this->n = other.n;
        this->os = new OperativenSistem[this->n];
        for (int i = 0; i < this->n; i++) {
            this->os[i] = other.os[i];
        }
    }

    Repozitorium &operator=(const Repozitorium &other) {
        if (this != &other) {
            delete [] this->os;
            this->os = new OperativenSistem[other.n];
            for (int i = 0; i < this->n; i++) {
                this->os[i] = other.os[i];
            }
            this->n = other.n;
            strcpy(this->name, other.name);
        }
        return *this;
    }

    ~Repozitorium() {
        delete [] this->os;
    }

    void pecatiOperativniSistemi() {
        cout << "Repozitorium: " << this->name;
        cout << endl;
        for (int i = 0; i < this->n; i++) {
            os[i].pecati();
        }
    }

    void izbrishi(OperativenSistem &operativenSistem) {
        int index = 0;
        bool flag = false;
        for (int i = 0; i < this->n; i++) {
            if (operativenSistem.ednakviSe(os[i])) {
                index = i;
                flag = true;
                break;
            }
        }
        if (flag == true) {
            for (int i = index; i < n - 1; i++) {
                os[i] = os[i + 1];
            }
            n--;
        }
    }

    void dodadi(OperativenSistem &nov) {
        for (int i = 0; i < n; i++) {
            if (nov.istaFamilija(os[i]) && nov.sporediVerzija(os[i]) == 0) {
                os[i] = nov;
                return;
            }
        }
        OperativenSistem *temp = new OperativenSistem[n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = os[i];
        }
        temp[n] = nov;
        delete [] os;
        os = temp;
        n++;
    }
};

int main() {
    char repoName[20];
    cin >> repoName;
    Repozitorium repozitorium = Repozitorium(repoName);
    int brojOperativniSistemi = 0;
    cin >> brojOperativniSistemi;
    char ime[20];
    float verzija;
    int tip;
    float golemina;
    for (int i = 0; i < brojOperativniSistemi; i++) {
        cin >> ime;
        cin >> verzija;
        cin >> tip;
        cin >> golemina;
        OperativenSistem os = OperativenSistem(ime, verzija, (Tip) tip, golemina);
        repozitorium.dodadi(os);
    }

    repozitorium.pecatiOperativniSistemi();
    cin >> ime;
    cin >> verzija;
    cin >> tip;
    cin >> golemina;
    OperativenSistem os = OperativenSistem(ime, verzija, (Tip) tip, golemina);
    cout << "=====Brishenje na operativen sistem=====" << endl;
    repozitorium.izbrishi(os);
    repozitorium.pecatiOperativniSistemi();
    return 0;
}
