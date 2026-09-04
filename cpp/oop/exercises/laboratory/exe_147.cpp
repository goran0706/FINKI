// Да се дефинира класа Switch со bool state (true = ON, false = OFF). За класата да се дефинираат:
// Подразбирлив конструктор (default: OFF)
// Метод toggle() кој го менува статусот
// Метод print() кој печати "ON" или "OFF"

#include <iostream>
using namespace std;

class Switch {
private:
    bool state;

public:
    explicit Switch(bool state = false) {
        this->state = state;
    }

    void toggle() {
        if (state) {
            state = false;
        } else if (!state) {
            state = true;
        }
    }

    void print() {
        if (state) {
            cout << "ON";
        } else {
            cout << "OFF";
        }
    }
};

int main() {
    Switch s;
    int n;
    cin >> n;
    int cmd;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        if (cmd == 1) {
            s.toggle();
        }
        s.print();
    }
}
