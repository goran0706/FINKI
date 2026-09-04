// Опис: Дефинирај класа Battery со:
//
// id (string, default: "BAT-001")
// capacity (double, default: 100.0) – максимален капацитет во Wh
// currentCharge (double, default: 0.0) – моментален полнеж
//
// Методи:
// charge(double amount) – додава енергија, но не смее да надмине капацитет
// use(double amount) – троши енергија, ако има доволно
// print() – печати: ID - XX% - [EMPTY | LOW | OK]
// LOW ако е < 20%, EMPTY ако е 0%, OK инаку.

#include "iostream"
#include "cstring"
using namespace std;

class Battery {
    char id[15];
    double capacity;
    double currentCharge;

public:
    Battery(char *id = "BAT-001", double capacity = 100.0, double currentCharge = 0.0) {
        strcpy(this->id, id);
        this->capacity = capacity;
        this->currentCharge = currentCharge;
    }

    void use(double amount) {
        if (currentCharge >= amount) {
            currentCharge -= amount;
        } else {
            currentCharge = 0;
        }
    }

    void charge(double amount) {
        currentCharge += amount;
        if (currentCharge > capacity) {
            currentCharge = capacity;
        }
    }

    void print() {
        cout << id << " - " << capacity << "% - ";
        if (capacity == 0) {
            cout << "EMPTY" << endl;
        } else if (capacity < 20) {
            cout << "LOW" << endl;
        } else {
            cout << "OK" << endl;
        }
    }
};

int main() {
    Battery b;
    string cmd;
    double val;

    while (cin >> cmd) {
        if (cmd == "charge") {
            cin >> val;
            b.charge(val);
        } else if (cmd == "use") {
            cin >> val;
            b.use(val);
        } else if (cmd == "print") {
            b.print();
        }
    }
}
