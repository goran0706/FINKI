#include <iostream>

using namespace std;
class Temperature{
private:
    float temp;
public:
    explicit Temperature(float temp=0) {
        this->temp=temp;
    }
    void changeTemp(){
        if (temp >= 0){
            temp++;
        }else if (temp < 0){
            temp--;
        }
    }
    float get(){
        return temp;
    }
};

int main() {
    Temperature obj1;
    int n;
    cin >> n;
    int cmd;
    float k;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1: {
                cin >> k;
                Temperature obj2(k);
                cout << obj2.get() << endl;
                break;
            }
            case 2: {
                obj1.changeTemp();
                cout << obj1.get() << endl;
                break;
            }
            case 3: {
                cin >> k;
                Temperature obj3(k);
                obj3.changeTemp();
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