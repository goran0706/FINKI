// Да се дефинира класа Subject  за која се чува:
//
// име (низа од карактери)
// број на кредити (цел број)
//
// За класата да се дефинира default конструктор, конструктор со аргументи и copy конструктор.
//
// Потоа да се дефинира класа Student за која се чува:
//
// име (низа од карактери)
// презиме (низа од карактери)
// индекс (низа од карактери)
// 5 предмети што ги слуша (низа од објекти од класата Subject)
// метод total() што ќе го пресметува вкупниот број на кредити што ќе ги има студентот откако ќе ги положи предметите
// метод display() кој што ќе испечати информации во формат:
// Име презиме -> индекс -> кредити
//
// За класата да се дефинира  default конструктор и конструктор со аргументи.
//
// По потреба може да се креираат get и set методи.
//
// Да не се менува main функцијата.
//
// -----------------------------------------------------------------------------------------------------
//
// Define a class Subject that stores:
//
// name (character array)
//
// number of credits (integer)
//
// For this class define:
//
// a default constructor
//
// a constructor with arguments
//
// a copy constructor
//
// Then define a class Student that stores:
//
// name (character array)
//
// surname (character array)
//
// index (character array)
//
// 5 subjects the student attends (array of objects from the class Subject)
//
// a method total() that calculates the total number of credits the student will have after passing the subjects
//
// a method display() that prints information in the format:
// Name surname -> index -> credits
//
// For the class define:
//
// a default constructor
//
// a constructor with arguments
//
// If needed, get and set methods may be created.
//
// The main function must not be changed.
//
// For example:
// Input 	Result
//
// Ana
// Anovska
// 333333
// IT
// 4
// OOP
// 8
// BP
// 13
// OS
// 7
// APS
// 2
//
//
//
// Ana Anovska -> 333333 -> 34

#include <iostream>
#include <cstring>

using namespace std;

constexpr int SubjectSize = 5;


class Subject {
private:
    char name[50]{};
    int credits;

public:
    Subject() {
        credits = 0;
    }

    Subject(const char *name, int credits) {
        strcpy(this->name, name);
        this->credits = credits;
    }

    Subject(const Subject &other) {
        cout << "copy called\n";
        strcpy(this->name, other.name);
        this->credits = other.credits;
    }

    char *getName() {
        return name;
    }

    [[nodiscard]] int getCredits() const {
        return credits;
    }

    void setName(char name[50]) {
        strcpy(this->name, name);
    }

    void setCredits(int credits) {
        this->credits = credits;
    }
};

class Student {
private:
    char name[50] = {};
    char surname[50] = {};
    char index[10] = {};
    Subject subjects[SubjectSize] = {};

public:
    Student() = default;

    Student(const char *name, const char *surname, const char *index, const Subject subjects[SubjectSize]) {
        strcpy(this->name, name);
        strcpy(this->surname, surname);
        strcpy(this->index, index);

        for (int i = 0; i < SubjectSize; i++) {
            this->subjects[i] = subjects[i];
        }
    }

    int total() {
        int sum = 0;
        for (const Subject &s: this->subjects) {
            sum += s.getCredits();
        }
        return sum;
    }

    void display() {
        cout << name << " " << surname << " -> " << index << " -> " << total();
    }
};

//DO NOT CHANGE THE MAIN FUNCTION
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
