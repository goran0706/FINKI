#include<iostream>
#include<cstring>
using namespace std;

class NoCourseException {
private:
    int index;

public:
    NoCourseException(int index) { this->index = index; }
    void message() { cout << "Demonstratorot so indeks " << index << " ne drzi laboratoriski vezbi" << endl; }
};

class Kurs {
protected:
    char ime[21];
    int brojKrediti;

public:
    Kurs() {
        *ime = '\0';
        brojKrediti = 0;
    }

    Kurs(char *ime, int brojKrediti) {
        strcpy(this->ime, ime);
        this->brojKrediti = brojKrediti;
    }

    void pecati() const { cout << ime << " " << brojKrediti << "ECTS"; }
    const char *getImee() const { return ime; }
};

class Student {
protected:
    int index;
    int *ocenki;
    int brojOcenki;

public:
    Student() {
        index = 0;
        ocenki = nullptr;
        brojOcenki = 0;
    }

    Student(int index, int *ocenki, int brojOcenki) {
        this->index = index;
        this->brojOcenki = brojOcenki;
        this->ocenki = new int[brojOcenki];
        for (int i = 0; i < brojOcenki; ++i) this->ocenki[i] = ocenki[i];
    }

    Student(const Student &s) {
        this->index = s.index;
        this->brojOcenki = s.brojOcenki;
        this->ocenki = new int[s.brojOcenki];
        for (int i = 0; i < s.brojOcenki; ++i) this->ocenki[i] = s.ocenki[i];
    }

    Student &operator=(const Student &s) {
        if (this != &s) {
            delete[] ocenki;
            this->index = s.index;
            this->brojOcenki = s.brojOcenki;
            this->ocenki = new int[s.brojOcenki];
            for (int i = 0; i < s.brojOcenki; ++i) this->ocenki[i] = s.ocenki[i];
        }
        return *this;
    }

    virtual ~Student() { delete[] ocenki; }

    virtual int getBodovi() {
        int count = 0;
        for (int i = 0; i < brojOcenki; ++i) if (ocenki[i] > 5) count++;
        return (brojOcenki == 0) ? 0 : count * 100 / brojOcenki;
    }

    virtual void pecati() { cout << index; }
};

class Predavach {
protected:
    char *ime;
    Kurs *kursevi;
    int brojKursevi;

public:
    Predavach() {
        ime = new char[1];
        ime[0] = '\0';
        kursevi = nullptr;
        brojKursevi = 0;
    }

    Predavach(char *ime, Kurs *kursevi, int brojKursevi) {
        this->brojKursevi = brojKursevi;
        this->kursevi = new Kurs[brojKursevi];
        for (int i = 0; i < brojKursevi; ++i) this->kursevi[i] = kursevi[i];
        this->ime = new char[strlen(ime) + 1];
        strcpy(this->ime, ime);
    }

    Predavach(const Predavach &p) {
        this->brojKursevi = p.brojKursevi;
        this->kursevi = new Kurs[p.brojKursevi];
        for (int i = 0; i < p.brojKursevi; ++i) this->kursevi[i] = p.kursevi[i];
        this->ime = new char[strlen(p.ime) + 1];
        strcpy(this->ime, p.ime);
    }

    Predavach &operator=(const Predavach &p) {
        if (this != &p) {
            delete[] ime;
            delete[] kursevi;
            this->brojKursevi = p.brojKursevi;
            this->kursevi = new Kurs[p.brojKursevi];
            for (int i = 0; i < p.brojKursevi; ++i) this->kursevi[i] = p.kursevi[i];
            this->ime = new char[strlen(p.ime) + 1];
            strcpy(this->ime, p.ime);
        }
        return *this;
    }

    virtual ~Predavach() {
        delete[] ime;
        delete[] kursevi;
    }

    virtual void pecati() const {
        for (int i = 0; i < brojKursevi; ++i) {
            kursevi[i].pecati();
            if (i < brojKursevi - 1) cout << ", ";
        }
    }

    int getBrojKursevi() const { return brojKursevi; }
    Kurs *getKursevi(int i) const { return kursevi; }
    char *getIme() const { return ime; }
};

class Demonstrator : public Student, public Predavach {
private:
    int brojCasovi;

public:
    Demonstrator() : Student(), Predavach() { brojCasovi = 0; }

    Demonstrator(int index, int *ocenki, int brojOcenki, char *ime, Kurs *kursevi, int brojKursevi, int brojCasovi)
        : Student(index, ocenki, brojOcenki), Predavach(ime, kursevi, brojKursevi) {
        this->brojCasovi = brojCasovi;
    }

    Demonstrator(const Demonstrator &d) : Student(d), Predavach(d) { brojCasovi = d.brojCasovi; }

    Demonstrator &operator=(const Demonstrator &d) {
        if (this != &d) {
            Student::operator=(d);
            Predavach::operator=(d);
            brojCasovi = d.brojCasovi;
        }
        return *this;
    }

    int getBodovi() override {
        if (brojKursevi == 0) throw NoCourseException(index);
        return Student::getBodovi() + (20 * brojCasovi) / brojKursevi;
    }

    void pecati() override {
        Student::pecati();
        cout << ": " << getIme() << " (";
        Predavach::pecati();
        cout << ")";
    }
};

Student &vratiNajdobroRangiran(Student **studenti, int n) {
    Student *max = studenti[0];
    for (int i = 0; i < n; ++i) {
        try {
            if (studenti[i]->getBodovi() > max->getBodovi()) max = studenti[i];
        } catch (NoCourseException &e) { e.message(); }
    }
    return *max;
}

void pecatiDemonstratoriKurs(const char *kurs, Student **studenti, int n) {
    for (int i = 0; i < n; i++) {
        Demonstrator *d = dynamic_cast<Demonstrator *>(studenti[i]);
        if (d) {
            for (int j = 0; j < d->getBrojKursevi(); j++) {
                if (strcmp(d->getKursevi(j)->getImee(), kurs) == 0) {
                    d->pecati();
                    cout << endl;
                    break;
                }
            }
        }
    }
}


int main() {
    Kurs kursevi[10];
    int indeks, brojKursevi, ocenki[20], ocenka, brojOcenki, tip, brojCasovi, krediti;
    char ime[20], imeIPrezime[50];

    cin >> tip;

    if (tip == 1) //test class Demonstrator
    {
        cout << "-----TEST Demonstrator-----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }
        cin >> imeIPrezime >> brojKursevi;
        for (int i = 0; i < brojKursevi; i++) {
            cin >> ime >> krediti;
            kursevi[i] = Kurs(ime, krediti);
        }
        cin >> brojCasovi;

        Demonstrator d(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi, brojCasovi);
        cout << "Objekt od klasata Demonstrator e kreiran";
    } else if (tip == 2) //funkcija pecati vo Student
    {
        cout << "-----TEST pecati-----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }

        Student s(indeks, ocenki, brojOcenki);
        s.pecati();
    } else if (tip == 3) //funkcija getVkupnaOcenka vo Student
    {
        cout << "-----TEST getVkupnaOcenka-----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }
        Student s(indeks, ocenki, brojOcenki);
        cout << "Broj na bodovi: " << s.getBodovi() << endl;
    } else if (tip == 4) //funkcija getVkupnaOcenka vo Demonstrator
    {
        cout << "-----TEST getVkupnaOcenka-----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }
        cin >> imeIPrezime >> brojKursevi;
        for (int i = 0; i < brojKursevi; i++) {
            cin >> ime >> krediti;
            kursevi[i] = Kurs(ime, krediti);
        }
        cin >> brojCasovi;

        Demonstrator d(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi, brojCasovi);
        cout << "Broj na bodovi: " << d.getBodovi() << endl;
    } else if (tip == 5) //funkcija pecati vo Demonstrator
    {
        cout << "-----TEST pecati -----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }
        cin >> imeIPrezime >> brojKursevi;
        for (int i = 0; i < brojKursevi; i++) {
            cin >> ime >> krediti;
            kursevi[i] = Kurs(ime, krediti);
        }
        cin >> brojCasovi;

        Demonstrator d(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi, brojCasovi);
        d.pecati();
    } else if (tip == 6) //site klasi
    {
        cout << "-----TEST Student i Demonstrator-----" << endl;
        cin >> indeks >> brojOcenki;
        for (int i = 0; i < brojOcenki; i++) {
            cin >> ocenka;
            ocenki[i] = ocenka;
        }
        cin >> imeIPrezime >> brojKursevi;
        for (int i = 0; i < brojKursevi; i++) {
            cin >> ime >> krediti;
            kursevi[i] = Kurs(ime, krediti);
        }
        cin >> brojCasovi;

        Student *s = new Demonstrator(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi, brojCasovi);
        s->pecati();
        cout << "\nBroj na bodovi: " << s->getBodovi() << endl;
        delete s;
    } else if (tip == 7) //funkcija vratiNajdobroRangiran
    {
        cout << "-----TEST vratiNajdobroRangiran-----" << endl;
        int k, opt;
        cin >> k;
        Student **studenti = new Student *[k];
        for (int j = 0; j < k; j++) {
            cin >> opt; //1 Student 2 Demonstrator
            cin >> indeks >> brojOcenki;
            for (int i = 0; i < brojOcenki; i++) {
                cin >> ocenka;
                ocenki[i] = ocenka;
            }
            if (opt == 1) {
                studenti[j] = new Student(indeks, ocenki, brojOcenki);
            } else {
                cin >> imeIPrezime >> brojKursevi;
                for (int i = 0; i < brojKursevi; i++) {
                    cin >> ime >> krediti;
                    kursevi[i] = Kurs(ime, krediti);
                }
                cin >> brojCasovi;
                studenti[j] = new Demonstrator(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi,
                                               brojCasovi);
            }
        }
        Student &najdobar = vratiNajdobroRangiran(studenti, k);
        cout << "Maksimalniot broj na bodovi e:" << najdobar.getBodovi();
        cout << "\nNajdobro rangiran:";
        najdobar.pecati();

        for (int j = 0; j < k; j++) delete studenti[j];
        delete [] studenti;
    } else if (tip == 8) //funkcija pecatiDemonstratoriKurs
    {
        cout << "-----TEST pecatiDemonstratoriKurs-----" << endl;
        int k, opt;
        cin >> k;
        Student **studenti = new Student *[k];
        for (int j = 0; j < k; j++) {
            cin >> opt; //1 Student 2 Demonstrator
            cin >> indeks >> brojOcenki;
            for (int i = 0; i < brojOcenki; i++) {
                cin >> ocenka;
                ocenki[i] = ocenka;
            }
            if (opt == 1) {
                studenti[j] = new Student(indeks, ocenki, brojOcenki);
            } else {
                cin >> imeIPrezime >> brojKursevi;
                for (int i = 0; i < brojKursevi; i++) {
                    cin >> ime >> krediti;
                    kursevi[i] = Kurs(ime, krediti);
                }
                cin >> brojCasovi;
                studenti[j] = new Demonstrator(indeks, ocenki, brojOcenki, imeIPrezime, kursevi, brojKursevi,
                                               brojCasovi);
            }
        }
        char kurs[20];
        cin >> kurs;
        cout << "Demonstratori na " << kurs << " se:" << endl;
        pecatiDemonstratoriKurs(kurs, studenti, k);
        for (int j = 0; j < k; j++) delete studenti[j];
        delete [] studenti;
    }


    return 0;
}
