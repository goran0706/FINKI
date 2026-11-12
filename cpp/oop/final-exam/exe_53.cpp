#include <iostream>
using namespace std;

class Car {
private:
    string id;
    double size;

public:
    Car(const string &id = "SK-0001-AA", const double size = 0.0) {
        this->id = id;
        this->size = size;
    }

    Car(const Car &other) {
        this->id = other.id;
        this->size = other.size;
    }

    Car &operator=(const Car &other) {
        if (this != &other) {
            this->id = other.id;
            this->size = other.size;
        }
        return *this;
    }

    ~Car() {
    }

    double refuel(double liters) {
        if (size + liters < 50) {
            size = size + liters;
            return size;
        } else {
            size = 50;
            return size;
        }
    }

    void print() {
        if (size == 0) {
            cout << id << " - " << size << " - " << "EMPTY" << endl;
        }
        if (size > 0 && size < 10) {
            cout << id << " - " << size << " - " << "LOW" << endl;
        }
        if (size >= 10) {
            cout << id << " - " << size << " - " << "ENOUGH" << endl;
        }
    }
};

int main() {
    string command;
    Car s;
    string id;
    double liters;

    while (cin >> command) {
        if (command == "constructor1") {
            cin >> id >> liters;
            s = Car(id, liters);
        } else if (command == "constructor2") {
            cin >> id;
            s = Car(id);
        } else if (command == "refuel") {
            cin >> liters;
            s.refuel(liters);
        } else if (command == "print") {
            s.print();
        }
    }


    return 0;
}
