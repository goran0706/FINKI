// Да се дефинира класа Student во која ќе се чуваат информации за:
// Индексот на студентот (тип: string, со default вредност "NO_ID")
// Поените освоени на некој испит (тип: integer, со default вредност 0)
//
// За класата да се дефинираат:
// Конструктори (согласно кодот во main методот)
// addPoints(int points) - метод кој додава поени на студентот. Да се внимава поените да не надминат 100!
// print() - метод кој ги печати информациите за студентот во следниот формат:
// ID - POINTS - STATUS, каде што статус може да биде:
// FAILED (ако студентот има под 50 поени)
// PASSED (ако студентот има 50 или повеќе од 50 поени)
// BEST (ако студентот има 90 или повеќе од 90 поени)

#include<iostream>
#include <cstring>
using namespace std;

class Student {
private:
    string id;
    int poeni;

public:
    Student(const string &id = "NO_ID", int poeni = 0) {
        this->id = id;
        this->poeni = poeni;
    }

    void addPoints(int points) {
        if (poeni > 100) {
            poeni = 100;
        } else {
            poeni += points;
            if (poeni > 100) {
                poeni = 100;
            }
        }
    }

    void print() {
        cout << id << " - " << poeni;
        if (poeni > 90 || poeni == 90) {
            cout << " BEST" << endl;
        } else if (poeni < 50) {
            cout << " FAILED" << endl;
        } else if (poeni > 50 || poeni == 50) {
            cout << " PASSED" << endl;
        }
    }
};

int main() {
    string command;
    Student s;
    string id;
    int points;

    while (cin >> command) {
        if (command == "constructor1") {
            cin >> id >> points;
            s = Student(id, points);
        } else if (command == "constructor2") {
            cin >> id;
            s = Student(id);
        } else if (command == "addPoints") {
            cin >> points;
            s.addPoints(points);
        } else if (command == "print") {
            s.print();
        }
    }


    return 0;
}
