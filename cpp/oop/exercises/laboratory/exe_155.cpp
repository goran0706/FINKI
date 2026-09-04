// Да се дефинира класа FuelTank во која се чува реална променлива liters.
// За класата да се дефинираат:
// Потребни конструктори
// addFuel(float f) метода која додава гориво. Ако вкупната количина надмине 50 литри, да се постави на 50 и да се испечати: "Tank is full".
// get() метода која ја враќа моменталната количина.

#include <iostream>
using namespace std;

class FuelTank {
private:
    float liters;

public:
    explicit FuelTank(float liters = 0) {
        this->liters = liters;
    }

    void addFuel(float f) {
        liters += f;
        if (liters > 50) {
            liters = 50;
            cout << "Tank is full" << endl;
        }
    }

    double get() {
        return liters;
    }
};

int main() {
    FuelTank tank;
    int n;
    cin >> n;
    int cmd;
    float val;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1: {
                cin >> val;
                FuelTank t2(val);
                cout << t2.get() << endl;
                break;
            }
            case 2: {
                cin >> val;
                tank.addFuel(val);
                cout << tank.get() << endl;
                break;
            }
            default: {
                cout << tank.get() << endl;
                break;
            }
        }
    }
}
