#include <iostream>
using namespace std;

class Number {
private:
    int number;

public:
    void set(int num) {
        this->number = num;
    }

    void decreaseNumber(int num) {
        if (number - num < 0) {
            number = 0;
            cout << "Difference is less than 0" << endl;
        } else {
            number = number - num;
        }
    }

    void print() {
        cout << number << endl;
    }
};

int main() {
    Number obj;
    int n;
    cin >> n;
    int cmd;
    int k;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1: {
                cin >> k;
                obj.set(k);
                obj.print();
                break;
            }
            case 2: {
                cin >> k;
                obj.decreaseNumber(k);
                obj.print();
                break;
            }
            case 3: {
                Number obj2;
                cin >> k;
                obj2.set(k);
                cin >> k;
                obj2.decreaseNumber(k);
                obj2.print();
                break;
            }
            default: {
                obj.print();
                break;
            }
        }
    }
}
