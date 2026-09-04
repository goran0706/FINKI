#include "iostream"
using namespace std;

class InvalidSerialNumberFormatException {
private:
    string serial;

public:
    InvalidSerialNumberFormatException(string serial) {
        this->serial = serial;
    }

    void message() {
        cout << "The serial number " << serial << " is invalid macine serial number format. " << endl;
    }
};

class Machine {
protected:
    string model;
    int powerConsumption;
    float basePrice;
    string serialNumber;

public:
    Machine(string model = "", int powerConsumption = 0, string serialNumber = "") {
        //        bool flag = false;
        if (serialNumber.length() != 12 || serialNumber.find(' ') != string::npos) {
            throw InvalidSerialNumberFormatException(serialNumber);
        }
        this->model = model;
        this->powerConsumption = powerConsumption;
        this->basePrice = basePrice;
        this->serialNumber = serialNumber;
    }

    virtual float calculateCost() = 0;

    virtual void showDetails() = 0;
};

class WashingMachine : public Machine {
private:
    int capacity;

public:
    WashingMachine(string model = "", int powerConsumption = 0, string serialNumber = "", int capacity = 0)
        : Machine(model, powerConsumption, serialNumber) {
        this->capacity = capacity;
    }

    float calculateCost() override {
        float price = 500;
        if (capacity > 8) {
            price *= 1.12;
        }
        price += (powerConsumption / 100) * 20;
        return price;
    }

    void showDetails() override {
        cout << "Washine Machine " << model << " cost: " << calculateCost() << "$" << endl;
    }
};

class DryingMachine : public Machine {
private:
    bool sensor;

public:
    DryingMachine(string model = "", int powerConsumption = 0, string serialNumber = "", bool sensor = false) : Machine(
        model, powerConsumption, serialNumber) {
        this->sensor = sensor;
    }

    float calculateCost() override {
        float price = 600;
        if (sensor) {
            price *= 1.15;
        }
        price += (powerConsumption / 100) * 25;
        return price;
    }

    void showDetails() override {
        cout << "Drying Machine " << model << " cosst: " << calculateCost() << "$" << endl;
    }
};

void calculatePercentageOfCost(Machine **machines, int n) {
    float total = 0;
    float washing = 0;
    float drying = 0;
    for (int i = 0; i < n; ++i) {
        total += machines[i]->calculateCost();

        if (dynamic_cast<WashingMachine *>(machines[i]) != nullptr) {
            washing += machines[i]->calculateCost();
        } else {
            drying += machines[i]->calculateCost();
        }
    }
    float totalW = (washing / total) * 100;
    float totalD = (drying / total) * 100;
    cout << "The total cost of washing machines is " << washing << "$, which is " << totalW <<
            "% of total cost of machines." << endl;
    cout << "The total cost of drying machines is " << drying << "$, which is " << totalD <<
            "% of total cost of machines." << endl;
}

Machine **createMachines(int &n) {
    Machine **machines = new Machine *[n];
    string model, serialNumber;
    int t, powerConsumption, value;
    for (int i = 0; i < n; ++i) {
        cin >> t;
        cin >> model >> powerConsumption >> serialNumber >> value;
        try {
            (t == 1)
                ? machines[i] = new WashingMachine(model, powerConsumption, serialNumber, value)
                : machines[i] = new DryingMachine(model, powerConsumption, serialNumber, value);
        } catch (InvalidSerialNumberFormatException &e) {
            e.message();
            n--;
            i--;
        }
    }
    return machines;
}

void cleanUp(Machine **machines, int n) {
    for (int i = 0; i < n; ++i) {
        delete machines[i];
    }
}

int main() {
    int testCase, n;
    cin >> testCase;

    switch (testCase) {
        case 1: {
            cout << "TESTING ABSTRACT CLASS AND CHILD CLASSES" << endl;
            cin >> n;
            Machine **machines = createMachines(n);
            for (int i = 0; i < n; i++) {
                machines[i]->showDetails();
            }
            cleanUp(machines, n);
            cout << "ABSTRACT CLASS AND CHILD CLASSES OK" << endl;
            break;
        }
        case 2: {
            cout << "TEST EXCEPTION HANDLING" << endl;
            cin >> n;
            Machine **machines = createMachines(n);
            for (int i = 0; i < n; i++) {
                machines[i]->showDetails();
            }
            cleanUp(machines, n);
            cout << "EXCEPTION HANDLING OK" << endl;
            break;
        }
        default: {
            cout << "INTEGRATION TEST AND TESTING GLOBAL FUNCTION" << endl;
            cin >> n;
            Machine **machines = createMachines(n);
            for (int i = 0; i < n; i++) {
                machines[i]->showDetails();
            }
            calculatePercentageOfCost(machines, n);
            cleanUp(machines, n);
            cout << "INTEGRATION TEST AND TESTING GLOBAL FUNCTION OK" << endl;
            break;
        }
    }
}
