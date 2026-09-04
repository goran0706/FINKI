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

class Manager : public Employee {
private:
    int teamSize;

public:
    Manager(int ID = 0, int teamSize = 0) : Employee(ID) {
        this->teamSize = teamSize;
    }

    Manager(const Manager &m) {
        this->ID = m.ID;
        this->teamSize = m.teamSize;
    }

    Manager &operator=(const Manager &m) {
        if (this != &m) {
            this->ID = m.ID;
            this->teamSize = m.teamSize;
        }
        return *this;
    }

    ~Manager() {
    }

    void print() {
        cout << "Manager: ID=" << ID << endl;
        cout << "Manager team size: " << teamSize << endl;
    }

    void changeTeamSize(int x) {
        if (teamSize + x > 50) {
            teamSize = teamSize - 30;
        } else {
            teamSize = teamSize + x;
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
