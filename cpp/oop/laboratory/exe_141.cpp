// Дадена е класа Employee во која се чува податок за идентификацискиот број на вработениот, соодветниот конструктор, set метода и метод за печатење.
// Да се дефинира класа Manager која наследува од класата Employee, и која вклучува целобројна променлива
// за големината на тимот (int teamSize) иницијално поставена на 0.
//
// За класата Manager, дефинирајте го следново:
// Соодветен конструктор
// Метод за печатење void print(), кој го печати идентификацискиот број во првиот ред и големината на тимот во вториот ред.
// Метод за промена на големината на тимот за дадена вредност x - void changeTeamSize(int x), кој доколку големината
// на тимот со додадената вредност x надмине 50, ќе ја намали големината на тимот за 30, а во спротивно ќе ја зголеми за x.

#include <iostream>

using namespace std;


class Employee {
protected:
    int ID;

public:
    Employee(int ID = 0) {
        this->ID = ID;
    }

    void print() {
        cout << "ID=" << ID << endl;
    }

    void setID(int ID) {
        this->ID = ID;
    }

    ~Employee() {
    }
};

//YOUR CODE HERE
class Manager : public Employee {
private:
    int teamSize;

public:
    explicit Manager(int ID = 0, int teamSize = 0) : Employee(ID) {
        this->teamSize = teamSize;
    }

    void print() {
        cout << "Manager: ";
        cout << "ID=" << ID << endl;
        cout << "Manager team size: ";
        cout << teamSize << endl;
    }

    void changeTeamSize(int x) {
        if ((teamSize + x) > 50) {
            teamSize -= 30;
        } else {
            teamSize += x;
        }
    }
};

int main() {
    int testCase;
    cin >> testCase;
    if (testCase == 1) {
        Manager m1 = Manager();
        m1.print();
    } else if (testCase == 2) {
        Manager m2 = Manager(435, 45);
        m2.print();
        m2.changeTeamSize(43);
        m2.print();
    } else if (testCase == 3) {
        Manager m3 = Manager(78856, 15);
        m3.print();
        m3.setID(695);
        m3.changeTeamSize(20);
        m3.print();
        m3.changeTeamSize(74);
        m3.print();
    } else if (testCase == 4) {
        int id, a;
        cin >> id >> a;
        Manager m4 = Manager(id, a);
        m4.print();
        m4.changeTeamSize(32);
        m4.print();
    } else if (testCase == 5) {
        int n, id, a;
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> id >> a;
            Manager m = Manager(id, a);
            m.print();
            m.changeTeamSize(3);
            m.print();
        }
    }


    return 0;
}
