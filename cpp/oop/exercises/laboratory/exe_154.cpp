// Класа StudentGrade чува податоци за ученик:
//
// name – име на ученикот (тип: string)
// points – освоени поени (тип: int, default: 0, максимум 100)
//
// Методи:
// addPoints(int pts) – додава поени. Вкупно не смее да надмине 100.
//
// grade() – враќа оценка според освоените поени:
// под 50 → Fail
// од 50 до 69 → Pass
// од 70 до 89 → Very Good
// 90 или повеќе → Excellent
//
// print() – печати:
// NAME - XX points - GRADE

#include "iostream"
#include "cstring"
using namespace std;

class StudentGrade {
private:
    char name[30];
    int poeni;

public:
    StudentGrade(char *name = "", int poeni = 0) {
        strcpy(this->name, name);
        this->poeni = poeni;
    }

    void addPoints(int pts) {
        poeni += pts;
        if (poeni > 100) {
            poeni = 100;
        }
    }

    double grade() const {
        if (poeni < 50) {
            cout << "Fail" << endl;
        } else if (poeni > 50 && poeni < 69) {
            cout << "Pass" << endl;
        } else if (poeni > 70 && poeni < 89) {
            cout << "Very Good" << endl;
        } else {
            cout << "Excellent" << endl;
        }
    }

    void print() {
        cout << name << " - " << poeni << " points - " << grade() << endl;
    }
};

int main() {
    StudentGrade s("Ana");
    string cmd;
    int val;

    while (cin >> cmd) {
        if (cmd == "add") {
            cin >> val;
            s.addPoints(val);
        } else if (cmd == "print") {
            s.print();
        }
    }
    return 0;
}
