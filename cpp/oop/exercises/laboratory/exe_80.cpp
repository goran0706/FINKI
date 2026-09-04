// Да се дефинира класа Subject за која се чува:
// име (низа од карактери)
// број на кредити (цел број)
//
// За класата да се дефинира default конструктор, конструктор со аргументи и copy конструктор.
//
// Потоа да се дефинира класа Student за која се чува:
// име (низа од карактери)
// презиме (низа од карактери)
// индекс (низа од карактери)
//
// 5 предмети што ги слуша (низа од објекти од класата Subject)
// метод total() што ќе го пресметува вкупниот број на кредити што ќе ги има студентот откако ќе ги положи предметите
// метод display() кој што ќе испечати информации во формат:
// Име презиме -> индекс -> кредити
//
// За класата да се дефинира default конструктор и конструктор со аргументи.
// По потреба може да се креираат get и set методи.

#include "iostream"
#include "cstring"
using namespace std;

class Subject {
    char name[100];
    int credits;

public:
    Subject() {
    }

    Subject(char *name, int credits) {
        strcpy(this->name, name);
        this->credits = credits;
    }

    Subject(const Subject &s) {
        strcpy(this->name, s.name);
        this->credits = s.credits;
    }

    friend class Student;
};

class Student {
private:
    char name[100];
    char surname[100];
    char index[100];
    Subject subjects[5];

public:
    Student() {
    }

    Student(char *name, char *surname, char *index, Subject *subjects) {
        strcpy(this->name, name);
        strcpy(this->surname, surname);
        strcpy(this->index, index);
        for (int i = 0; i < 5; ++i) {
            this->subjects[i] = subjects[i];
        }
    }

    int total() {
        int suma = 0;
        for (int i = 0; i < 5; ++i) {
            suma += subjects[i].credits;
        }
        return suma;
    }

    void display() {
        cout << name << " " << surname << " -> " << index << " -> " << total();
    }
};

int main() {
    char stName[100], stSurname[100], stIndex[100];
    cin >> stName >> stSurname >> stIndex;
    //Testing default constructor for Subject
    Subject subjects[5];
    for (int i = 0; i < 5; i++) {
        char sbName[100];
        int c;
        cin >> sbName >> c;
        //Testing constructor with arguments for Subject
        subjects[i] = Subject(sbName, c);
    }
    //Testing default constructor for Student
    Student student;
    //Testing constructor with arguments for Student and copy constructor for Subject
    student = Student(stName, stSurname, stIndex, subjects);
    //Testing display() and total() methods
    student.display();
    return 0;
}
