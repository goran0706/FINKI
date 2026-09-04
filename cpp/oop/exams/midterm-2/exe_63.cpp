#include<iostream>
#include<string.h>
#include<cctype>
using namespace std;

class BadInputException {
};

class StudentKurs {
protected:
    char ime[30];
    int ocenka;
    bool daliUsno;
    static int MAX;
    static const int MINOCENKA = 6;

public:
    StudentKurs(char *ime = "", int finalenIspit = 0) {
        strcpy(this->ime, ime);
        this->ocenka = finalenIspit;
        this->daliUsno = false;
    }

    virtual ~StudentKurs() {
    }

    static void setMAX(int max) {
        MAX = max;
    }

    static int getMAX() {
        return MAX;
    }

    virtual int getOcenka() const {
        return ocenka;
    }

    virtual bool getDaliUsno() const {
        return daliUsno;
    }

    char *getIme() {
        return ime;
    }

    virtual void pecati() const {
        cout << ime << " --- " << getOcenka() << endl;
    }
};

int StudentKurs::MAX = 10;

class StudentKursUsno : public StudentKurs {
private:
    char *opisnaOcenka;

public:
    StudentKursUsno(char *ime = "", int finalenIspit = 0)
        : StudentKurs(ime, finalenIspit) {
        daliUsno = true;
        opisnaOcenka = nullptr;
    }

    StudentKursUsno(const StudentKursUsno &other)
        : StudentKurs(other) {
        daliUsno = other.daliUsno;
        if (other.opisnaOcenka != nullptr) {
            opisnaOcenka = new char[strlen(other.opisnaOcenka) + 1];
            strcpy(opisnaOcenka, other.opisnaOcenka);
        } else {
            opisnaOcenka = nullptr;
        }
    }

    StudentKursUsno &operator=(const StudentKursUsno &other) {
        if (this != &other) {
            StudentKurs::operator=(other);
            delete[] opisnaOcenka;
            if (other.opisnaOcenka != nullptr) {
                opisnaOcenka = new char[strlen(other.opisnaOcenka) + 1];
                strcpy(opisnaOcenka, other.opisnaOcenka);
            } else {
                opisnaOcenka = nullptr;
            }
        }
        return *this;
    }

    ~StudentKursUsno() {
        delete[] opisnaOcenka;
    }

    StudentKursUsno &operator+=(const char *opisna) {
        for (int i = 0; i < strlen(opisna); i++) {
            if (!isalpha(opisna[i])) throw BadInputException();
        }

        delete[] opisnaOcenka;
        opisnaOcenka = new char[strlen(opisna) + 1];
        strcpy(opisnaOcenka, opisna);
        return *this;
    }

    int getOcenka() const override {
        if (!opisnaOcenka) return ocenka;
        if (strcmp(opisnaOcenka, "odlicen") == 0) return min(ocenka + 2, MAX);
        if (strcmp(opisnaOcenka, "dobro") == 0) return min(ocenka + 1, MAX);
        if (strcmp(opisnaOcenka, "losho") == 0) return max(ocenka - 1, 1);
        return ocenka;
    }

    void pecati() const override {
        cout << ime << " --- " << getOcenka() << endl;
    }
};

class KursFakultet {
private:
    char naziv[30];
    StudentKurs *studenti[20];
    int broj;

public:
    KursFakultet(char *naziv, StudentKurs **studenti, int broj) {
        strcpy(this->naziv, naziv);
        for (int i = 0; i < broj; i++) {
            if (studenti[i]->getDaliUsno()) {
                this->studenti[i] = new StudentKursUsno(*dynamic_cast<StudentKursUsno *>(studenti[i]));
            } else {
                this->studenti[i] = new StudentKurs(*studenti[i]);
            }
        }
        this->broj = broj;
    }

    ~KursFakultet() {
        for (int i = 0; i < broj; i++) delete studenti[i];
    }

    void pecatiStudenti() const {
        cout << "Kursot " << naziv << " go polozile:" << endl;
        for (int i = 0; i < broj; i++) {
            if (studenti[i]->getOcenka() >= 6) {
                studenti[i]->pecati();
            }
        }
    }

    void postaviOpisnaOcenka(char *ime, char *opisna) {
        for (int i = 0; i < broj; i++) {
            if (strcmp(studenti[i]->getIme(), ime) == 0 && studenti[i]->getDaliUsno()) {
                StudentKursUsno *s = dynamic_cast<StudentKursUsno *>(studenti[i]);
                try {
                    *s += opisna;
                } catch (BadInputException &) {
                    cout << "Greshna opisna ocenka" << endl;
                    char popravena[100];
                    int j = 0;
                    for (int k = 0; k < strlen(opisna); k++) {
                        if (isalpha(opisna[k])) popravena[j++] = opisna[k];
                    }
                    popravena[j] = '\0';
                    *s += popravena;
                }
            }
        }
    }
};


int main() {
    StudentKurs **niza;
    int n, m, ocenka;
    char ime[30], opisna[10];
    bool daliUsno;
    cin >> n;
    niza = new StudentKurs *[n];
    for (int i = 0; i < n; i++) {
        cin >> ime;
        cin >> ocenka;
        cin >> daliUsno;
        if (!daliUsno)
            niza[i] = new StudentKurs(ime, ocenka);
        else
            niza[i] = new StudentKursUsno(ime, ocenka);
    }

    KursFakultet programiranje("OOP", niza, n);
    for (int i = 0; i < n; i++) delete niza[i];
    delete [] niza;
    cin >> m;

    for (int i = 0; i < m; i++) {
        cin >> ime >> opisna;
        programiranje.postaviOpisnaOcenka(ime, opisna);
    }

    StudentKurs::setMAX(9);

    programiranje.pecatiStudenti();
    return 0;
}
