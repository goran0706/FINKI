/*
    Објектно ориентирано програмирање

    Аудиториска вежба 9 (Повеќекратно наследување)
    1. Возила

    Да се состави класа за автомобил со млазен погон кој наследува својства од две класи, автомобил и млазен авион (дијамант проблем).

    Како што може да се забележи кога се креира објект од класата JetCar, конструкторот на класата Vehicle се повикува два пати.

    Исто така и деструкторот на класата Vehicle се повикува два пати при повик на деструктор на објект од класата JetCar.

    За да се избегне оваа појава при повеќекратното наследување се воведува виртуелно наследување за класите Car и Jet од класата Vehicle.

*/
#include <iostream>
using namespace std;

// ==========================================
// 1. BASE VEHICLE CLASS
// ==========================================
class Vehicle {
public:
    Vehicle() {
        cout << "Vehicle Constructor" << endl;
    }

    virtual ~Vehicle() {
        cout << "Vehicle Destructor" << endl;
    }

    virtual void accelerate() const {
        cout << "Vehicle Accelerating" << endl;
    }

    void setAcceleration(double a) {
        acceleration = a;
    }

    double getAcceleration() const {
        return acceleration;
    }

protected:
    double acceleration;
};

// ==========================================
// 2. VIRTUAL INTERMEDIATE CLASSES
// ==========================================
// 'virtual public' ensures that any class inheriting from both Car and Jet
// will only contain ONE shared instance of Vehicle.
class Car : virtual public Vehicle {
public:
    Car() {
        cout << "Car Constructor" << endl;
    }

    void accelerate() const override {
        cout << "Car Accelerating" << endl;
    }

    virtual void drive() const {
        cout << "Car Driving" << endl;
    }

    ~Car() override {
        cout << "Car Destructor" << endl;
    }
};

class Jet : virtual public Vehicle {
public:
    Jet() {
        cout << "Jet Constructor" << endl;
    }

    ~Jet() override {
        cout << "Jet Destructor" << endl;
    }

    virtual void fly() const {
        cout << "Jet flying" << endl;
    }
};

// ==========================================
// 3. MULTIPLE INHERITANCE CHILD CLASS
// ==========================================
class JetCar : public Car, public Jet {
public:
    JetCar() {
        cout << "JetCar Constructor" << endl;
    }

    ~JetCar() override {
        cout << "JetCar Destructor" << endl;
    }

    void drive() const override {
        cout << "JetCar driving" << endl;
    }

    void fly() const override {
        cout << "JetCar flying" << endl;
    }
};

// ==========================================
// 4. GLOBAL PERFORMANCE ANALYZERS
// ==========================================
void analyzeCarPerformance(Car *testVehicle) {
    // Triggers dynamic binding. If a JetCar pointer is passed,
    // it executes JetCar::drive() instead of Car::drive().
    testVehicle->drive();
}

void analyzeJetPerformance(Jet *testVehicle) {
    testVehicle->fly();
}

// ==========================================
// 5. MAIN EXECUTION
// ==========================================
int main() {
    Car myCar;
    Jet myJet;

    cout << "\n--- Instantiating JetCar ---" << endl;
    // Because of virtual inheritance, 'Vehicle Constructor' runs exactly ONCE here.
    JetCar myJetCar;
    cout << "----------------------------\n" << endl;

    cout << "Car testing in progress" << endl;
    analyzeCarPerformance(&myCar);
    analyzeCarPerformance(&myJetCar);

    cout << "Jet testing in progress" << endl;
    analyzeJetPerformance(&myJet);
    analyzeJetPerformance(&myJetCar);

    cout << "\n--- Destruction Phase ---" << endl;
    return 0;
}
