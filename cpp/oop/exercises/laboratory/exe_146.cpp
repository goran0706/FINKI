// Да се дефинира класа Distance со променлива float meters.
// Да се имплементираат:
//
// Конструктор со default вредност 0
// Метод add(float m) кој додава метри
// Метод subtract(float m) кој одзема, но ако резултатот е помал од 0 → се поставува на 0 и се печати "Distance can't be negative"
// Метод get() кој ја враќа моменталната вредност

#include <iostream>
using namespace std;

class Distance {
private:
    float meters;

public:
    explicit Distance(float meters = 0) {
        this->meters = meters;
    }

    void add(float m) {
        meters += m;
    }

    void subtract(float m) {
        meters -= m;
        if (meters < 0) {
            meters = 0;
            cout << "Distance can't be negative";
        }
    }

    float get() {
        return meters;
    }
};

int main() {
    Distance d;
    int n;
    cin >> n;
    int cmd;
    float val;
    for (int i = 0; i < n; i++) {
        cin >> cmd >> val;
        if (cmd == 1)
            d.add(val);
        else if (cmd == 2)
            d.subtract(val);
        cout << d.get() << endl;
    }
}
