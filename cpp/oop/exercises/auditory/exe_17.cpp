/*
    1.2 Динамички алоцирана низа

    Да се напише класа за опис на студенти.
    
    За секој студент се чува:

    - индекс (низа од 6 знаци),
    - името (динамички алоцирана низа од знаци),
    - просекот (децимален број) и
    - студиска година (цел број).

    За оваа класа да се имплементираат:

    - Конструктори и деструктор
    - Оператор ++ за зголемување на запишаната студиска година за еден
    - Оператор << за печатење на студент со сите негови податоци
    - Оператор > за споредување на два студенти според просекот

    Потоа треба да се креира класа за опишување на група/паралелка што содржи:

    - динамички алоцирана низа од студенти, како и
    - број на елементи во низата.

    За оваа класа да се имплементираат:

    - Конструктори и деструктор
    - Оператор += за додавање на нов студент во паралелката
    - Оператор ++ за зголемување на запишаната студиска година за еден за сите студенти во низата
    - Оператор << за печатење на сите ученици во паралелката
    - Оператор [] за пристап до студент според индексот
    - Метод awards() што ги печати само оние ученици кои имаат просек 10.0.
    - Метод highestAverageGrade() што го печати највисокиот просек во паралелката
*/
#include <cstring>
#include <iostream>
using namespace std;

enum {
    IdLen = 7,
};

class Student {
public:
    static constexpr int ID_LEN = 7;

    // Default constructor
    Student() {
        id[0] = '\0';
        name = new char[1];
        name[0] = '\0';
        GPA = 0.0;
        yearOfStudies = 1;
    }

    // Parameterized constructor
    Student(const char *id, const char *name, double gpa, int year) {
        strncpy(this->id, id, ID_LEN - 1);
        this->id[ID_LEN - 1] = '\0';

        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);

        this->GPA = gpa;
        this->yearOfStudies = year;
    }


    // ── Rule of Three ──────────────────────

    // 1. Copy constructor
    Student(const Student &other) {
        strncpy(id, other.id, ID_LEN);

        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);

        GPA = other.GPA;
        yearOfStudies = other.yearOfStudies;
    }

    // 2. Copy assignment operator
    Student &operator=(const Student &other) {
        if (this == &other) return *this; // self-assignment guard first

        strncpy(id, other.id, ID_LEN);

        delete[] name; // delete old
        name = new char[strlen(other.name) + 1]; // allocate new
        strcpy(name, other.name); // copy the content not the pointer

        GPA = other.GPA;
        yearOfStudies = other.yearOfStudies;

        return *this; // return *this for method chaining
    }

    // 3. Destructor
    ~Student() {
        delete[] name;
    }


    // ── Operators ──────────────────────────

    Student &operator++() {
        ++yearOfStudies; // prefix
        return *this; // returns the already-incremented object
    }

    // the (int) is just a dummy to distinguish it from prefix
    Student operator++(int) {
        Student tmp(*this); // copy of current state
        ++*this; // increment the actual object
        return tmp; // return the pre-increment copy
    }

    bool operator>(const Student &other) const {
        return GPA > other.GPA;
    }

    friend ostream &operator<<(ostream &os, const Student &s) {
        return os << s.id << " | " << s.name << " | " << s.GPA << " | " << s.yearOfStudies << endl;
    }

    double getGPA() const { return GPA; }

    void print() const {
        cout << id << " " << name << " " << GPA << " " << yearOfStudies << endl;
    }

private:
    char id[ID_LEN] = {};
    char *name;
    double GPA;
    mutable int yearOfStudies;
};

class Group {
private:
    Student *students;
    int count;

public:
    // ──────────── Constructors ────────────
    Group() {
        students = new Student[0];
        count = 0;
    }

    Group(const Student *students, int count) {
        this->students = new Student[count];
        for (int i = 0; i < count; i++) {
            this->students[i] = students[i];
        }
        this->count = count;
    }

    Group(const Group &other) {
        students = new Student[other.count];
        for (int i = 0; i < other.count; ++i) {
            students[i] = other.students[i];
        }
        count = other.count;
    }

    Group &operator=(const Group &other) {
        // self-assignment guard
        if (this == &other) return *this;

        // delete old
        // allocate new
        // copy content - not pointer
        delete [] students;
        students = new Student[other.count];
        for (int i = 0; i < other.count; i++) {
            this->students[i] = other.students[i];
        }

        // return *this for chaining
        return *this;
    }

    ~Group() {
        delete [] students;
    }

    // ──────────── Operators ────────────

    Group &operator+=(const Student &s) {
        Student *tmp = new Student[count + 1];
        for (int i = 0; i < count; i++)
            tmp[i] = students[i];
        tmp[count++] = s;

        delete [] students;
        students = tmp;

        return *this;
    }

    Group &operator++() {
        for (int i = 0; i < count; i++) {
            ++students[i];
        }
        return *this;
    }

    friend ostream &operator<<(ostream &os, const Group &g) {
        for (int i = 0; i < g.count; i++) {
            os << g.students[i] << "\n";
        }
        return os;
    }

    Student &operator[](const int index) const {
        return students[index];
    }

    void awards() const {
        for (int i = 0; i < count; i++) {
            if (students[i].getGPA() == 10.0) {
                cout << students[i] << "\n";
            }
        }
    }

    void highestAverageGrade() const {
        if (count == 0) return;

        double highest = students[0].getGPA();
        for (int i = 1; i < count; i++) {
            if (students[i].getGPA() > highest) {
                highest = students[i].getGPA();
            }
        }

        cout << "Highest GPA: " << highest << "\n";
    }
};

int main() {
    Student s1; // default constructor
    s1.print();

    Student s2("253010", "Goran", 10, 1); // parameterized constructor
    s2.print();

    Student s3(s2); // copy constructor
    s3.print();

    Student s4 = s3; // copy assignment operator
    s4.print();

    Student s5("123456", "Ana", 9.5, 2);
    cout << ++s5; // prefix  — s.year is now 3, returns s at year 3
    cout << s5++; // postfix — s.year is now 4, but expression value is s at year 3
    cout << s5; // 4

    // -------------------

    Student ss1("123456", "Ana", 9.5, 2);
    Student ss2("654321", "Marko", 10.0, 3);
    Student ss3("111111", "Elena", 8.0, 1);

    cout << ss1 << "\n";
    cout << (ss2 > ss1) << "\n"; // 1

    Group g;
    g += ss1;
    g += ss2;
    g += ss3;

    cout << g;

    ++g;
    cout << "\nAfter ++:\n" << g;

    g.awards();
    g.highestAverageGrade();
}
