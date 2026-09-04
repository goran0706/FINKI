#include <iostream>
#include <cstring>

using namespace std;

class Number {
private:
    int number;

public:
    Number(int number = 0) {
        this->number = number;
    }

    void increaseNumber(int increase) {
        if (number + increase > 100) {
            number = 100;
            cout << "Sum is greater than 100" << endl;
        } else {
            number += increase;
        }
    }

    int get() {
        return number;
    }
};

int main() {
    Number obj1;
    int n;
    cin >> n;
    int cmd;
    int k;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1: {
                cin >> k;
                Number obj2(k);
                cout << obj2.get() << endl;
                break;
            }
            case 2: {
                cin >> k;
                obj1.increaseNumber(k);
                cout << obj1.get() << endl;
                break;
            }
            case 3: {
                cin >> k;
                Number obj3(k);
                cin >> k;
                obj3.increaseNumber(k);
                cout << obj3.get() << endl;
                break;
            }
            default: {
                cout << obj1.get() << endl;
                break;
            }
        }
    }
}
