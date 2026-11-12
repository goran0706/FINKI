// Да се дефинира класа City во која се чуваат информации за:
//
//     cityID - идентификационен број на градот (int)
//
//     baseConsumption - основна потрошувачка на енергија во мегавати (double)
//
// За класата да се дефинираат:
//
//     Default конструктор (поставува ID 0 и потрошувачка 0)
//
//     Конструктор со аргументи
//
//     Copy конструктор
//
//     double totalConsumption() - ја враќа моменталната потрошувачка (во оваа класа е еднаква на baseConsumption)
//
//     double efficiencyIndex() - пресметува индекс на ефикасност (се пресметува како baseConsumption * 0.9)
//
//     void display() - печати информации за градот како во тест примерите.
//
// Да се имплементира класа SmartCity што наследува од класата City. Во неа се чуваат дополнителни информации за:
//
//     solarGain - енергија добиена од соларни панели (double)
//
//     windGain - енергија добиена од ветерници (double)
//
// Паметниот град сега ќе има вкупна потрошувачка еднаква на baseConsumption - solarGain, а индексот на ефикасност ќе биде подобрен и ќе изнесува (baseConsumption * 0.9) + (windGain * 1.1).
//
// Напомени:
//
//     Ако solarGain и windGain се 0, тогаш градот не е паметен. Во тој случај display() се повикува исто како за City.
//
//     При препокривање на методите во SmartCity задолжително мора да има повик кон истоимените методи од основната класа City.
//
// ------------------------------------------------------------------------------------------
//
// Define a class City which stores information about:
//
//     cityID - the identification number of the city (int)
//
//     baseConsumption - basic energy consumption in Megawatts (double)
//
// Define the following for the class:
//
//     Default constructor (sets ID to 0 and consumption to 0.0)
//
//     Parameterized constructor (constructor with arguments)
//
//     Copy constructor
//
//     double totalConsumption(): returns the current consumption (in this class, it is equal to baseConsumption).
//
//     double efficiencyIndex(): calculates an efficiency index (calculated as baseConsumption * 0.9).
//
//     void display(): prints city information as shown in the test cases.
//
// Implement a class SmartCity that inherits from the class City. It stores additional information about:
//
//     solarGain - energy generated from solar panels (double)
//
//     windGain - energy generated from wind turbines (double)
//
// A Smart City has a total consumption equal to baseConsumption - solarGain. The efficiency index is improved and calculated as (baseConsumption * 0.9) + (windGain * 1.1).
//
// Notes:
//
//     If solarGain and windGain are both 0, then the city is not a smart city. In this case, display() should be called exactly as it is for the City class.
//
//     When overriding methods in the SmartCity class, it is mandatory to include a call to the same methods from the base class City.
//
// For example:
// Input 	Result
//
// 2
// 101 500
// 202 800
// 50 30
// 100 40
// 1
//
//
//
// === Testing City Class ===
// ID: 101 - Total: 500MW, Efficiency: 450
// ID: 202 - Total: 800MW, Efficiency: 720
//
// 2
// 101 500
// 202 800
// 50 30
// 100 40
// 2
//
//
//
// === Testing SmartCity Class ===
// SmartCity ID: 101 - Net: 450MW, Efficiency: 483
// SmartCity ID: 202 - Net: 700MW, Efficiency: 764

#include <iostream>
using namespace std;

class City {
protected:
    int cityID;
    double baseConsumption;

public:
    // TODO: Default konstruktor

    // TODO: Konstruktor so argumenti

    // TODO: Copy konstruktor

    // TODO: double totalConsumption()

    // TODO: double efficiencyIndex()

    // TODO: void display()
};

class SmartCity : public City {
private:
    double solarGain;
    double windGain;

public:
    // TODO: Default konstruktor

    // TODO: Konstruktor SmartCity(const City &c, double solar, double wind)

    // TODO: Copy konstruktor

    // TODO: Prepokrivanje na metodite
};

int main() {
    int n, id;
    double cons, solar, wind;
    cin >> n;

    City *gradovi = new City[n];
    SmartCity *p_gradovi = new SmartCity[n];

    for (int i = 0; i < n; i++) {
        cin >> id >> cons;
        gradovi[i] = City(id, cons);
    }

    for (int i = 0; i < n; i++) {
        cin >> solar >> wind;
        p_gradovi[i] = SmartCity(gradovi[i], solar, wind);
    }

    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "=== Testing City Class ===" << endl;
        for (int i = 0; i < n; i++)
            gradovi[i].display();
    } else {
        cout << "=== Testing SmartCity Class ===" << endl;
        for (int i = 0; i < n; i++)
            p_gradovi[i].display();
    }

    delete[] gradovi;
    delete[] p_gradovi;
    return 0;
}
