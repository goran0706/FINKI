#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class NoCourseException : exception {
private:
    int index;

public:
    NoCourseException(const int index = 0) {
        this->index = index;
    }

    void print() const {
        cout << "Demonstratorot so indeks " << index << " ne drzi laboratoriski vezbi " << endl;
    }
};

class Kurs {
private:
    char name[50];
    int credits;

public:
    Kurs(const char *name = "", const int credits = 0) {
        strcpy(this->name, name);
        this->credits = credits;
    }

    Kurs(const Kurs &kurs) {
        strcpy(this->name, kurs.name);
        this->credits = kurs.credits;
    }

    Kurs &operator=(const Kurs &kurs) {
        if (this != &kurs) {
            strcpy(this->name, kurs.name);
            this->credits = kurs.credits;
        }
        return *this;
    }

    ~Kurs() {
    }

    const char *getName() const {
        return name;
    }

    int getCredits() const {
        return credits;
    }

    void print() const {
        cout << name << " " << credits << "ECTS";
    }
};

class Student {
protected:
    int index;
    int *array;
    int numberGrades;

public:
    Student(const int index = 0, const int *array = {}, const int numberGrades = 0) {
        this->index = index;
        this->numberGrades = numberGrades;
        this->array = new int [numberGrades];
        for (int i = 0; i < numberGrades; i++) {
            this->array[i] = array[i];
        }
    }

    Student(const Student &kurs) {
        this->index = kurs.index;
        this->numberGrades = kurs.numberGrades;
        this->array = new int [numberGrades];
        for (int i = 0; i < numberGrades; i++) {
            this->array[i] = kurs.array[i];
        }
    }

    Student &operator=(const Student &kurs) {
        if (this != &kurs) {
            delete [] this->array;
            this->index = kurs.index;
            this->numberGrades = kurs.numberGrades;
            this->array = new int [numberGrades];
            for (int i = 0; i < numberGrades; i++) {
                this->array[i] = kurs.array[i];
            }
        }
        return *this;
    }

    ~Student() {
        delete [] this->array;
    }

    virtual int getBodovi() const {
        if (numberGrades == 0) {
            return 0;
        }
        int passed = 0;
        for (int i = 0; i < numberGrades; i++) {
            if (array[i] > 5) {
                passed++;
            }
        }
        return (passed * 100) / numberGrades;
    }

    virtual void print() const {
        cout << index << endl;
    }

    int getIndex() const {
        return index;
    }
};

class Predavach {
protected:
    char *name;
    Kurs *kursevi;
    int numberKursevi;

public:
    Predavach(const char *name = "", const Kurs *kursevi = nullptr, const int numberKursevi = 0) {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        this->numberKursevi = numberKursevi;
        this->kursevi = new Kurs [numberKursevi];
        for (int i = 0; i < numberKursevi; i++) {
            this->kursevi[i] = kursevi[i];
        }
    }

    Predavach(const Predavach &kurs) {
        this->name = new char [strlen(kurs.name) + 1];
        strcpy(this->name, kurs.name);
        this->numberKursevi = kurs.numberKursevi;
        this->kursevi = new Kurs [numberKursevi];
        for (int i = 0; i < numberKursevi; i++) {
            this->kursevi[i] = kurs.kursevi[i];
        }
    }

    Predavach &operator=(const Predavach &kurs) {
        if (this != &kurs) {
            delete [] this->name;
            delete [] this->kursevi;
            this->name = new char [strlen(kurs.name) + 1];
            strcpy(this->name, kurs.name);
            this->numberKursevi = kurs.numberKursevi;
            this->kursevi = new Kurs [numberKursevi];
            for (int i = 0; i < numberKursevi; i++) {
                this->kursevi[i] = kurs.kursevi[i];
            }
        }
        return *this;
    }

    ~Predavach() {
        delete [] this->name;
        delete [] this->kursevi;
    }

    Kurs *getKursevi() const {
        return this->kursevi;
    }

    int getNumberKursevi() const {
        return this->numberKursevi;
    }

    const char *getName() const {
        return this->name;
    }
};

class Demonstrator : public Student, public Predavach {
private:
    int weekClasses;

public:
    Demonstrator(const int index = 0, const int *arrayGrades = {}, const int numberGrades = 0, const char *name = "",
                 const Kurs *kursevi = nullptr, const int numberKursevi = 0, const int weekClasses = 0)
        : Student(index, arrayGrades, numberGrades), Predavach(name, kursevi, numberKursevi) {
        this->weekClasses = weekClasses;
    }

    Demonstrator(const Demonstrator &kurs) : Student(kurs), Predavach(kurs) {
        this->weekClasses = kurs.weekClasses;
    }

    Demonstrator &operator=(const Demonstrator &kurs) {
        if (this != &kurs) {
            Student::operator=(kurs);
            Predavach::operator=(kurs);
            this->weekClasses = kurs.weekClasses;
        }
        return *this;
    }

    ~Demonstrator() {
    }

    int getBodovi() const override {
        int base = Student::getBodovi();
        if (numberKursevi == 0) {
            throw NoCourseException(index);
        }
        return base + ((20 * weekClasses) / numberKursevi);
    }

    void print() const override {
        cout << index << ": " << name << " (";
        for (int i = 0; i < numberKursevi; i++) {
            kursevi[i].print();
            if (i != numberKursevi - 1) {
                cout << ", ";
            }
        }
        cout << ")" << endl;
    }
};

Student &vratiNajdobroRangiran(Student **studenti, int n) {
    int max = 0;
    int maxIndex = 0;
    for (int i = 0; i < n; i++) {
        try {
            int bodovi = studenti[i]->getBodovi();
            if (bodovi > max) {
                max = bodovi;
                maxIndex = i;
            }
        } catch (NoCourseException &e) {
            e.print();
        }
    }
    cout << "Maksimalniot broj na bodovi e:" << max << endl;
    return *studenti[maxIndex];
}

void pecatiDemonstratoriKurs(char *kurs, Student **studenti, int n) {
    cout << "Demonstratori na " << kurs << " se:" << endl;
    for (int i = 0; i < n; i++) {
        Demonstrator *d = dynamic_cast<Demonstrator *>(studenti[i]);
        if (d != nullptr) {
            Kurs *k = d->getKursevi();
            int br = d->getNumberKursevi();
            for (int j = 0; j < br; j++) {
                if (strcmp(k[j].getName(), kurs) == 0) {
                    d->print();
                    break;
                }
            }
        }
    }
}

int main() {
    int testCase;
    cin >> testCase;

    //test case 1

    if (testCase == 1) {
        cout << "-----TEST Demonstrator-----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        char name[100];
        int numberKursevi = 0;
        cin.ignore();
        cin >> name;
        cin >> numberKursevi;
        Kurs kursevi[numberKursevi];

        for (int i = 0; i < numberKursevi; i++) {
            char nameCourse[100];
            int credits;
            cin >> nameCourse;
            cin >> credits;
            kursevi[i] = Kurs(nameCourse, credits);
        }

        int weekClasses;
        cin >> weekClasses;

        Demonstrator d = Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);
        cout << "Objekt od klasata Demonstrator e kreiran" << endl;
    }

    //test case 2

    else if (testCase == 2) {
        cout << "-----TEST pecati-----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        Student s = Student(index, grades, numberGrades);
        s.print();
    }

    //test case 3

    else if (testCase == 3) {
        cout << "-----TEST getVkupnaOcenka-----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        Student s = Student(index, grades, numberGrades);
        cout << "Broj na bodovi: " << s.getBodovi() << endl;
    }

    //test case 4

    else if (testCase == 4) {
        cout << "-----TEST getVkupnaOcenka-----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        char name[100];
        int numberKursevi;
        cin.ignore();
        cin >> name;
        cin >> numberKursevi;
        Kurs kursevi[numberKursevi];

        for (int i = 0; i < numberKursevi; i++) {
            char nameCourse[100];
            int credits;
            cin >> nameCourse;
            cin >> credits;
            kursevi[i] = Kurs(nameCourse, credits);
        }

        int weekClasses;
        cin >> weekClasses;

        Demonstrator d = Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);

        try {
            cout << "Broj na bodovi: " << d.getBodovi() << endl;
        } catch (NoCourseException &e) {
            e.print();
        }
    }

    //test case 5

    else if (testCase == 5) {
        cout << "-----TEST pecati -----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        char name[100];
        int numberKursevi;
        cin.ignore();
        cin >> name;
        cin >> numberKursevi;
        Kurs kursevi[numberKursevi];

        for (int i = 0; i < numberKursevi; i++) {
            char nameCourse[100];
            int credits;
            cin >> nameCourse;
            cin >> credits;
            kursevi[i] = Kurs(nameCourse, credits);
        }

        int weekClasses;
        cin >> weekClasses;

        Demonstrator d = Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);
        d.print();
    }

    //test case 6

    else if (testCase == 6) {
        cout << "-----TEST Student i Demonstrator-----" << endl;
        int index, numberGrades;
        cin >> index;
        cin >> numberGrades;
        int grades[numberGrades];

        for (int i = 0; i < numberGrades; i++) {
            cin >> grades[i];
        }

        char name[100];
        int numberKursevi;
        cin.ignore();
        cin >> name;
        cin >> numberKursevi;
        Kurs kursevi[numberKursevi];

        for (int i = 0; i < numberKursevi; i++) {
            char nameCourse[100];
            int credits;
            cin >> nameCourse;
            cin >> credits;
            kursevi[i] = Kurs(nameCourse, credits);
        }

        int weekClasses;
        cin >> weekClasses;

        Demonstrator d = Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);
        d.print();

        try {
            cout << "Broj na bodovi: " << d.getBodovi() << endl;
        } catch (NoCourseException &e) {
            e.print();
        }
    }

    //test case 7

    else if (testCase == 7) {
        cout << "-----TEST vratiNajdobroRangiran-----" << endl;
        int n;
        cin >> n;
        Student *studenti[n];

        for (int i = 0; i < n; i++) {
            int type;
            cin >> type;

            if (type == 1) {
                int index, numberGrades;
                cin >> index;
                cin >> numberGrades;
                int grades[numberGrades];

                for (int j = 0; j < numberGrades; j++) {
                    cin >> grades[j];
                }

                studenti[i] = new Student(index, grades, numberGrades);
            } else {
                int index, numberGrades;
                cin >> index;
                cin >> numberGrades;
                int grades[numberGrades];

                for (int i = 0; i < numberGrades; i++) {
                    cin >> grades[i];
                }

                char name[100];
                int numberKursevi;
                cin.ignore();
                cin >> name;
                cin >> numberKursevi;
                Kurs kursevi[numberKursevi];

                for (int j = 0; j < numberKursevi; j++) {
                    char nameCourse[100];
                    int credits;
                    cin >> nameCourse;
                    cin >> credits;
                    kursevi[j] = Kurs(nameCourse, credits);
                }

                int weekClasses;
                cin >> weekClasses;

                studenti[i] = new Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);
            }
        }

        Student &best = vratiNajdobroRangiran(studenti, n);
        cout << "Najdobro rangiran:";
        best.print();

        for (int i = 0; i < n; i++) {
            delete studenti[i];
        }
    }

    //test case 8

    else if (testCase == 8) {
        cout << "-----TEST pecatiDemonstratoriKurs-----" << endl;
        int n;
        cin >> n;

        Student *studenti[n];

        for (int i = 0; i < n; i++) {
            int type;
            cin >> type;

            if (type == 1) {
                int index, numberGrades;
                cin >> index;
                cin >> numberGrades;
                int grades[numberGrades];

                for (int j = 0; j < numberGrades; j++) {
                    cin >> grades[j];
                }

                studenti[i] = new Student(index, grades, numberGrades);
            } else {
                int index, numberGrades;
                cin >> index;
                cin >> numberGrades;
                int grades[numberGrades];

                for (int i = 0; i < numberGrades; i++) {
                    cin >> grades[i];
                }

                char name[100];
                int numberKursevi;
                cin.ignore();
                cin >> name;
                cin >> numberKursevi;
                Kurs kursevi[numberKursevi];

                for (int j = 0; j < numberKursevi; j++) {
                    char nameCourse[100];
                    int credits;
                    cin >> nameCourse;
                    cin >> credits;
                    kursevi[j] = Kurs(nameCourse, credits);
                }

                int weekClasses;
                cin >> weekClasses;

                studenti[i] = new Demonstrator(index, grades, numberGrades, name, kursevi, numberKursevi, weekClasses);
            }
        }

        char course[50];
        cin >> course;

        pecatiDemonstratoriKurs(course, studenti, n);

        for (int i = 0; i < n; i++) {
            delete studenti[i];
        }
    }
    return 0;
}
