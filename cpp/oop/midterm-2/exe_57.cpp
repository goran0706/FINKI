#include <iostream>
#include <cstring>
using namespace std;

class Trud {
private:
    char type;
    int year;

public:
    Trud(char type = ' ', int year = 0) {
        this->type = type;
        this->year = year;
    }

    char getType() {
        return type;
    }

    int getYear() const {
        return year;
    }

    friend istream &operator >>(istream &is, Trud &t) {
        is >> t.type;
        is >> t.year;
        return is;
    }
};

class Student {
private:
    char name[30];
    int index;
    int yearOfEnrolment;
    int *array;
    int n;

public:
    Student(const char *name = "", int index = 0, int yearOfEnrolment = 0, const int *array = nullptr, int n = 0) {
        strcpy(this->name, name);
        this->index = index;
        this->yearOfEnrolment = yearOfEnrolment;
        this->n = n;
        this->array = new int [n];
        for (int i = 0; i < n; i++) {
            if (array) {
                this->array[i] = array[i];
            } else {
                this->array[i] = 0;
            }
        }
    }

    Student(const Student &student) {
        strcpy(this->name, student.name);
        this->index = student.index;
        this->yearOfEnrolment = student.yearOfEnrolment;
        this->n = student.n;
        this->array = new int [n];
        for (int i = 0; i < n; i++) {
            this->array[i] = student.array[i];
        }
    }

    Student &operator=(const Student &student) {
        if (this != &student) {
            delete [] this->array;
            strcpy(this->name, student.name);
            this->index = student.index;
            this->yearOfEnrolment = student.yearOfEnrolment;
            this->n = student.n;
            this->array = new int [n];
            for (int i = 0; i < n; i++) {
                this->array[i] = student.array[i];
            }
        }
        return *this;
    }

    ~Student() {
        delete [] this->array;
    }

    virtual float rang() const {
        float average = 0;
        for (int i = 0; i < n; i++) {
            average += this->array[i];
        }
        return average / n;
    }

    //Индекс Име Година на упис ранг
    friend ostream &operator<<(ostream &os, const Student &student) {
        os << student.index << " " << student.name << " " << student.yearOfEnrolment << " " << student.rang() << endl;
        return os;
    }

    int getYearOfEnrolment() {
        return this->yearOfEnrolment;
    }

    int getIndex() {
        return this->index;
    }
};

class Exception : public exception {
private:
public:
    void print() {
        cout << "Ne moze da se vnese dadeniot trud" << endl;
    }
};

class PhDStudent : public Student {
private:
    Trud *arrayT;
    int number;
    static int cType;
    static int jType;

public:
    // PhDStudent(const char *name = "", int index = 0, int yearOfEnrolment = 0, const int *array = nullptr, int n = 0,
    //        const Trud *arrayT = nullptr, int number = 0) : Student(name, index, yearOfEnrolment, array, n) {
    //     this->number = number;
    //     this->arrayT = new Trud [number];
    //     for (int i = 0; i < number; i++) {
    //         if (arrayT) {
    //             try {
    //                 if (arrayT[i].getYear() < getYearOfEnrolment()) {
    //                     throw Exception();
    //                 }
    //                 this->arrayT[i] = arrayT[i];
    //             } catch (Exception &e) {
    //                 e.print();
    //             }
    //         } else {
    //             this->arrayT[i] = Trud();
    //         }
    //     }
    // }
    PhDStudent(const char *name = "", int index = 0, int yearOfEnrolment = 0, const int *array = nullptr, int n = 0,
               const Trud *arrayT = nullptr, int number = 0) : Student(name, index, yearOfEnrolment, array, n) {
        for (int i = 0; i < number; i++) {
            if (arrayT) {
                try {
                    *this += arrayT[i];
                } catch (Exception &e) {
                    e.print();
                }
            } else {
                this->arrayT[i] = Trud();
            }
        }
    }

    PhDStudent(const PhDStudent &student) : Student(student) {
        this->number = student.number;
        this->arrayT = new Trud [number];
        for (int i = 0; i < number; i++) {
            this->arrayT[i] = student.arrayT[i];
        }
    }

    PhDStudent &operator=(const PhDStudent &student) {
        if (this != &student) {
            Student::operator=(student);
            delete [] this->arrayT;
            this->number = student.number;
            this->arrayT = new Trud [number];
            for (int i = 0; i < number; i++) {
                this->arrayT[i] = student.arrayT[i];
            }
        }
        return *this;
    }

    ~PhDStudent() {
        delete [] this->arrayT;
    }

    float rang() const override {
        float average = Student::rang();
        for (int i = 0; i < number; i++) {
            if (arrayT[i].getType() == 'C' || arrayT[i].getType() == 'c') {
                average += cType;
            } else if (arrayT[i].getType() == 'J' || arrayT[i].getType() == 'j') {
                average += jType;
            }
        }
        return average;
    }

    static void setCTrud(int c) {
        cType = c;
    }

    static void setSTrud(int j) {
        jType = j;
    }

    PhDStudent &operator +=(const Trud &t) {
        if (t.getYear() < getYearOfEnrolment()) {
            throw Exception();
        }
        Trud *temp = new Trud [number + 1];
        for (int i = 0; i < number; i++) {
            temp[i] = this->arrayT[i];
        }
        temp[number] = t;
        delete [] this->arrayT;
        this->arrayT = temp;
        number++;
        return *this;
    }
};

int PhDStudent::cType = 1;
int PhDStudent::jType = 3;

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

        for (int i = 0; i < m; i++) {
            if (niza[i]->getIndex() == indeks) {
                PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
                if (temp) {
                    try {
                        *temp += t;
                    } catch (Exception &e) {
                        e.print();
                    }
                } else {
                    cout << "Ne postoi PhD student so indeks " << indeks << endl;
                }
            }
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

        for (int i = 0; i < m; i++) {
            if (niza[i]->getIndex() == indeks) {
                PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
                if (temp) {
                    try {
                        *temp += t;
                    } catch (Exception &e) {
                        e.print();
                    }
                } else {
                    cout << "Ne postoi PhD student so indeks " << indeks << endl;
                }
            }
        }
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
        for (int i = 0; i < m; i++) {
            if (niza[i]->getIndex() == indeks) {
                PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
                if (temp) {
                    try {
                        *temp += t;
                    } catch (Exception &e) {
                        e.print();
                    }
                } else {
                    cout << "Ne postoi PhD student so indeks " << indeks << endl;
                }
            }
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
        PhDStudent::setCTrud(conf);
        PhDStudent::setSTrud(journal);
        // pecatenje na site studenti
        cout << "\nLista na site studenti:\n";
        for (int i = 0; i < m; i++)
            cout << *niza[i];
    }
    return 0;
}
