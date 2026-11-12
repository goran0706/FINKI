// Дадена е класа Vehicle во која се чува податок за регистрацијата на едно возило, соодветен конструктор, сет метод и метод за печатење.
// Да се дефинира класа Car која наследува од класата Vehicle во која се чува целобројна променлива за
// брзината на возилото (int speed) иницијално поставена на 0.
//
// За класата Car да се дефинира:
// соодветен конструктор
// метод за печатење - void displayInfo()  - во формат: The car with REGISTRATION NUMBER=[regNum] is driving with speed=[speed]km/h.
// метод за промена на брзината за вредност y - void changeSpeed(int y), кој доколку брзината со додадената вредност у надмине 60,
// ќе ја намали за 10, а во спротивно ќе ја зголеми за у.

#include <iostream>

using namespace std;

class Vehicle {
protected:
    string registration_number;

public:
    Vehicle(string registration_number = "XXX") {
        this->registration_number = registration_number;
    }

    void print() {
        cout << "REGISTRATION NUMBER=" << registration_number;
    }

    void setRegNumber(string s) {
        registration_number = s;
    }

    ~Vehicle() {
    }
};

//YOUR CODE HERE!!!
class Car : public Vehicle {
private:
    int speed;

public:
    explicit Car(string registration_number = "XXX", int speed = 0) : Vehicle(registration_number) {
        this->speed = speed;
    }

    void displayInfo() {
        cout << "The car with REGISTRATION NUMBER=" << registration_number << " is driving with speed=" << speed <<
                "km/h." << endl;
    }

    void changeSpeed(int y) {
        if ((speed + y) > 60) {
            speed -= 10;
        } else {
            speed += y;
        }
    }
};

int main() {
    int testCase;
    cin >> testCase;
    if (testCase == 1) {
        Car m1 = Car();
        m1.displayInfo();
    } else if (testCase == 2) {
        Car m2 = Car("SK34565BP", 45);
        m2.displayInfo();
        m2.changeSpeed(20);
        m2.displayInfo();
    } else if (testCase == 3) {
        Car m3 = Car("AE45TYY", 15);
        m3.displayInfo();
        m3.setRegNumber("GV3456AW");
        m3.changeSpeed(20);
        m3.displayInfo();
        m3.changeSpeed(88);
        m3.displayInfo();
    } else if (testCase == 4) {
        string regNum;
        int a;
        cin >> regNum >> a;
        Car m4 = Car(regNum, a);
        m4.displayInfo();
        m4.changeSpeed(32);
        m4.displayInfo();
    } else if (testCase == 5) {
        int n, a;
        string regNum;
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> regNum >> a;
            Car m = Car(regNum, a);
            m.displayInfo();
            m.changeSpeed(3);
            m.displayInfo();
        }
    }


    return 0;
}
