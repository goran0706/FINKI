#include <iostream>
using namespace std;

class Temperature {
private:
    float temp;

public:
    void set(float value) {
        temp = value;
    }

    void changeTemp() {
        if (temp < 0) {
            temp++;
        } else {
            temp--;
        }
    }

    void print() {
        cout << temp << endl;
    }
};

int main() {
    Temperature obj;
    int n;
    cin >> n;
    int cmd;
    float k;
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
                obj.changeTemp();
                obj.print();
                break;
            }
            case 3: {
                Temperature obj3;
                cin >> k;
                obj3.set(k);
                obj3.changeTemp();
                obj3.print();
                break;
            }
            default: {
                obj.print();
                break;
            }
        }
    }
}
