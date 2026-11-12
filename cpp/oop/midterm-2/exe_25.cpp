#include <iostream>
#include <cstring>

using namespace std;

class Exception {
public:
    void message() {
        cout << "Ne moze da se vnese dadeniot trud" << endl;
    }
};

class Trud {
private:
    char tip;
    int godina;

public:
    Trud(char tip = 0, int godina = 0) {
        this->tip = tip;
        this->godina = godina;
    }

    char getTip() const {
        return tip;
    }

    void setTip(char tip) {
        Trud::tip = tip;
    }

    int getGodina() const {
        return godina;
    }

    void setGodina(int godina) {
        Trud::godina = godina;
    }

    friend istream &operator>>(istream &i, Trud &t) {
        i >> t.tip >> t.godina;
        return i;
    }
};

class Student {
private:
    char name[30];
    int indeks;
    int upis_godina;
    int oceni[50];
    int n;

public:
    Student(char *name = "", int indeks = 200000, int upis_godina = 2000, int *oceni = NULL, int n = 0)
        : indeks(indeks), upis_godina(upis_godina), n(n) {
        strcpy(this->name, name);
        for (int i = 0; i < n; ++i) {
            this->oceni[i] = oceni[i];
        }
    }

    virtual float rang() {
        float sum = 0;
        for (int i = 0; i < n; ++i) {
            sum += oceni[i];
        }
        return sum / n;
    }

    friend ostream &operator<<(ostream &o, Student &s) {
        o << s.indeks << " " << s.name << " " << s.upis_godina << " " << s.rang() << endl;
        return o;
    }

    int getUpisGodina() const {
        return upis_godina;
    }

    void setUpisGodina(int upisGodina) {
        upis_godina = upisGodina;
    }

    int getIndeks() const {
        return indeks;
    }

    void setIndeks(int indeks) {
        Student::indeks = indeks;
    }
};

class PhDStudent : public Student {
private:
    Trud *trudovi;
    int brojTrudovi;
    static int c;
    static int j;

public:
    PhDStudent(char *name = "", int indeks = 200000, int upis_godina = 2000, int *oceni = NULL, int n = 0,
               Trud *trudovi = 0, int brojTrudovi = 0)
        : Student(name, indeks, upis_godina, oceni, n) {
        this->trudovi = new Trud[brojTrudovi];
        for (int i = 0; i < brojTrudovi; ++i)
            try {
                if (upis_godina > trudovi[i].getGodina()) {
                    throw Exception();
                } else
                    this->trudovi[i] = trudovi[i];
            } catch (Exception e) {
                e.message();
            }
        this->brojTrudovi = brojTrudovi;
    }

    ~PhDStudent() {
        delete[] trudovi;
    }

    PhDStudent &operator+=(Trud &t) {
        if (t.getGodina() < getUpisGodina()) {
            throw Exception();
        }
        Trud *tmp = new Trud[brojTrudovi + 1];
        for (int i = 0; i < brojTrudovi; ++i) {
            tmp[i] = trudovi[i];
        }
        tmp[brojTrudovi++] = t;
        delete[] trudovi;
        trudovi = tmp;
        return *this;
    }

    float rang() {
        float rang = Student::rang();
        for (int i = 0; i < brojTrudovi; ++i) {
            if (tolower(trudovi[i].getTip()) == 'c') {
                rang += c;
            } else if (tolower(trudovi[i].getTip()) == 'j') {
                rang += j;
            }
        }
        return rang;
    }

    static void setC(int c) {
        PhDStudent::c = c;
    }

    static void setJ(int j) {
        PhDStudent::j = j;
    }
};

int PhDStudent::c = 1;
int PhDStudent::j = 3;

int main() {
    int testCase;
    cin >> testCase;

    int god, indeks, n, god_tr, m, n_tr;
    int izbor; //0 za Student, 1 za PhDStudent
    char ime[30];
    int oceni[50];
    char tip;
    Trud trud[50];

    if (testCase == 1) {
        cout << "===== Testiranje na klasite ======" << endl;
        cin >> ime;
        cin >> indeks;
        cin >> god;
        cin >> n;
        for (int j = 0; j < n; j++)
            cin >> oceni[j];
        Student s(ime, indeks, god, oceni, n);
        cout << s;

        cin >> ime;
        cin >> indeks;
        cin >> god;
        cin >> n;
        for (int j = 0; j < n; j++)
            cin >> oceni[j];
        cin >> n_tr;
        for (int j = 0; j < n_tr; j++) {
            cin >> tip;
            cin >> god_tr;
            Trud t(tip, god_tr);
            trud[j] = t;
        }
        PhDStudent phd(ime, indeks, god, oceni, n, trud, n_tr);
        cout << phd;
    }
    if (testCase == 2) {
        cout << "===== Testiranje na operatorot += ======" << endl;
        Student **niza;
        cin >> m;
        niza = new Student *[m];
        for (int i = 0; i < m; i++) {
            cin >> izbor;
            cin >> ime;
            cin >> indeks;
            cin >> god;
            cin >> n;
            for (int j = 0; j < n; j++)
                cin >> oceni[j];

            if (izbor == 0) {
                niza[i] = new Student(ime, indeks, god, oceni, n);
            } else {
                cin >> n_tr;
                for (int j = 0; j < n_tr; j++) {
                    cin >> tip;
                    cin >> god_tr;
                    Trud t(tip, god_tr);
                    trud[j] = t;
                }
                niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
            }
        }
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];

        // dodavanje nov trud za PhD student spored indeks
        Trud t;
        cin >> indeks;
        cin >> t;

        // vmetnete go kodot za dodavanje nov trud so pomos na operatorot +=
        bool found = false;
        for (int i = 0; i < m; ++i)
            if (dynamic_cast<PhDStudent *>(niza[i]) && niza[i]->getIndeks() == indeks) {
                *dynamic_cast<PhDStudent *>(niza[i]) += t;
                found = true;
            }
        if (!found) {
            cout << "Ne postoi PhD student so indeks " << indeks << endl;
        }

        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];
    }
    if (testCase == 3) {
        cout << "===== Testiranje na operatorot += ======" << endl;
        Student **niza;
        cin >> m;
        niza = new Student *[m];
        for (int i = 0; i < m; i++) {
            cin >> izbor;
            cin >> ime;
            cin >> indeks;
            cin >> god;
            cin >> n;
            for (int j = 0; j < n; j++)
                cin >> oceni[j];

            if (izbor == 0) {
                niza[i] = new Student(ime, indeks, god, oceni, n);
            } else {
                cin >> n_tr;
                for (int j = 0; j < n_tr; j++) {
                    cin >> tip;
                    cin >> god_tr;
                    Trud t(tip, god_tr);
                    trud[j] = t;
                }
                niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
            }
        }
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];

        // dodavanje nov trud za PhD student spored indeks
        Trud t;
        cin >> indeks;
        cin >> t;

        // vmetnete go kodot za dodavanje nov trud so pomos na operatorot += od Testcase 2
        for (int i = 0; i < m; ++i)
            if (dynamic_cast<PhDStudent *>(niza[i]) && niza[i]->getIndeks() == indeks)
                *dynamic_cast<PhDStudent *>(niza[i]) += t;

        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];
    }
    if (testCase == 4) {
        cout << "===== Testiranje na isklucoci ======" << endl;
        cin >> ime;
        cin >> indeks;
        cin >> god;
        cin >> n;
        for (int j = 0; j < n; j++)
            cin >> oceni[j];
        cin >> n_tr;
        for (int j = 0; j < n_tr; j++) {
            cin >> tip;
            cin >> god_tr;
            Trud t(tip, god_tr);
            trud[j] = t;
        }
        PhDStudent phd(ime, indeks, god, oceni, n, trud, n_tr);
        cout << phd;
    }
    if (testCase == 5) {
        cout << "===== Testiranje na isklucoci ======" << endl;
        Student **niza;
        cin >> m;
        niza = new Student *[m];
        for (int i = 0; i < m; i++) {
            cin >> izbor;
            cin >> ime;
            cin >> indeks;
            cin >> god;
            cin >> n;
            for (int j = 0; j < n; j++)
                cin >> oceni[j];

            if (izbor == 0) {
                niza[i] = new Student(ime, indeks, god, oceni, n);
            } else {
                cin >> n_tr;
                for (int j = 0; j < n_tr; j++) {
                    cin >> tip;
                    cin >> god_tr;
                    Trud t(tip, god_tr);
                    trud[j] = t;
                }
                niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
            }
        }
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];

        // dodavanje nov trud za PhD student spored indeks
        Trud t;
        cin >> indeks;
        cin >> t;

        // vmetnete go kodot za dodavanje nov trud so pomos na operatorot += i spravete se so isklucokot
        try {
            for (int i = 0; i < m; ++i)
                if (dynamic_cast<PhDStudent *>(niza[i]) && niza[i]->getIndeks() == indeks)
                    *dynamic_cast<PhDStudent *>(niza[i]) += t;
        } catch (Exception e) {
            e.message();
        }

        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];
    }
    if (testCase == 6) {
        cout << "===== Testiranje na static clenovi ======" << endl;
        Student **niza;
        cin >> m;
        niza = new Student *[m];
        for (int i = 0; i < m; i++) {
            cin >> izbor;
            cin >> ime;
            cin >> indeks;
            cin >> god;
            cin >> n;
            for (int j = 0; j < n; j++)
                cin >> oceni[j];

            if (izbor == 0) {
                niza[i] = new Student(ime, indeks, god, oceni, n);
            } else {
                cin >> n_tr;
                for (int j = 0; j < n_tr; j++) {
                    cin >> tip;
                    cin >> god_tr;
                    Trud t(tip, god_tr);
                    trud[j] = t;
                }
                niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
            }
        }
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];

        int conf, journal;
        cin >> conf;
        cin >> journal;

        //postavete gi soodvetnite vrednosti za statickite promenlivi
        PhDStudent::setC(conf);
        PhDStudent::setJ(journal);
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];
    }

    return 0;
}
