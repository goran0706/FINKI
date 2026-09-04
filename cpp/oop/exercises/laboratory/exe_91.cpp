// Да се дефинира класа Device, која чува податоци за паметен домашен уред.
// Класата Device се состои од следните полиња:
//
// Име (текстуална низа од 50 знаци)
// Потрошувачка на енергија (цел број)
// Категорија (енумерациски тип: security, kitchen или entertainment)
// Цена (double)
// Статус (boolean)
// За оваа класа да се обезбедат потребните конструктори и get/set методи.
//
// Да се имплементира методa print() со којaшто ќе се печатат информациите за електронскиот уред во следниот формат:
//
// [име] ([категорија]) - Power: [потрошувачка на енергија]W - Price: [цена]$ - Status: [ON|OFF]
//
// Да се имплементира метода void togglePower() која го менува статусот на уредот во вклучен ако е исклучен и обратно.
// Да се имплементира метода void increasePowerConsumption(int watts) која ја зголемува потрошувачката на енергија на уредот за дадена вредност.
//
// Да се дефинира класа SmartHome, во која се чуваат следните информации:
//
// Име (текстуална низа од 50 знаци)
// Идентификациски број (цел број)
// Листа на уреди (низа со максимум 100 објекти од класа Device)
// Број на уреди (број на елементи во листа на уреди, иницијално е 0).
// За оваа класа да се дефинираат потребните конструктори, деструктор и get/set методи.
//
// Идентификацискиот број за секој дом е единствен и неговата почетна вредност е 100.
// Да се обезбеди генерирање на овој број така што првиот дом има идентификациски број 101 (100+1), вториот 103 (101+2), третиот 106 (103+3), четвртиот 110 (106+4) итн...
// Да се имплементира метода print() која ќе ги печати информациите за еден дом во следен формат:
//
// [идентификациски број]: [име]
// Devices:
// [печатење на сите уреди]
//
// Да се имплементираат следните методи во класата SmartHome:
//
// addDevice(const Device&) - за додавање нов електронски уред во домот. Електронските уреди се управуваат на следниот начин:
// не смее да се дозволи додавање на уред со исто име во иста категорија.
// Доколку се обидеме да додадеме уред со исто име и категорија треба да се испише порака „Device already exists!“.
// void toggleAllDevicesByCategory(Category category), која го изменува статусот на сите електронски уреди во домот кои припаѓаат на таа категорија.
// void increasePowerConsumptionForCategory(int watts, Category category), каде ќе се зголеми потрошувачката на енергија на сите уреди од дадена категорија.
//
// Да се дефинира глобална функција:
// SmartHome& mostAutomatedHome(SmartHome *smartHomes, int n)
// која прима низа од објекти од класата SmartHome и бројот на домови.
// Како резултат оваа функција враќа кој дом има најмногу електронски уреди.
// Доколку повеќе домови имаат ист број на електронски уреди, да се врати последниот од нив.

#include <iostream>
#include <cstring>
using namespace std;

enum Category {
    security, kitchen, entertainment
};

class Device {
    char name[51];
    int energy;
    Category category;
    double price;
    bool status;

public:
    const char *getName() const {
        return name;
    }

    int getEnergy() const {
        return energy;
    }

    Category getCategory() const {
        return category;
    }

    double getPrice() const {
        return price;
    }

    bool getStatus() const {
        return status;
    }

    Device(const char *name = "", int energy = 0, Category category = kitchen, double price = 0, bool status = false) {
        strcpy(this->name, name);
        this->energy = energy;
        this->category = category;
        this->price = price;
        this->status = status;
    }

    void print() const {
        cout << name << " (";
        if (category == security) {
            cout << "security";
        } else if (category == kitchen) {
            cout << "kitchen";
        } else {
            cout << "entertainment";
        }
        cout << ") - Power: " << energy << "W - Price: " << price << "$ - Status: ";
        if (status) {
            cout << "ON";
        } else {
            cout << "OFF";
        }
        cout << endl;
    }

    void togglePower() {
        if (status) {
            status = false;
        } else {
            status = true;
        }
    }

    void increasePowerConsumption(int watts) {
        energy += watts;
    }
};

class SmartHome {
    char name[51];
    int id;
    static int COUNTER;
    static int HELP;
    Device devices[100];
    int n;

public:
    int getN() const {
        return n;
    }

    SmartHome(const char *name = "") {
        strcpy(this->name, name);
        n = 0;
        HELP++;
        id = COUNTER + HELP;
        COUNTER = id; //za da se azhurira COUNTER pravilno
        //prvo e 101 (100+1), pa 103 (101(prethodniot, zatoa COUNTER=id)+2(HELP-ot), pa 106 (103+3) ...
        //tl;dr 101,103,106,110,...
    }

    ~SmartHome() {
    }

    void print() const {
        cout << id << ": " << name << endl;
        cout << "Devices:" << endl;
        for (int i = 0; i < n; i++) {
            devices[i].print();
        }
    }

    void addDevice(const Device &d) {
        for (int i = 0; i < n; i++) {
            if (strcmp(devices[i].getName(), d.getName()) == 0 && devices[i].getCategory() == d.getCategory()) {
                cout << "Device already exists!" << endl;
                return;
            }
        }
        devices[n++] = d;
    }

    void toggleAllDevicesByCategory(Category c) {
        for (int i = 0; i < n; i++) {
            if (devices[i].getCategory() == c) {
                devices[i].togglePower();
            }
        }
    }

    void increasePowerConsumptionForCategory(int w, Category c) {
        for (int i = 0; i < n; i++) {
            if (devices[i].getCategory() == c) {
                devices[i].increasePowerConsumption(w);
            }
        }
    }
};

int SmartHome::COUNTER = 100;
int SmartHome::HELP = 0;

SmartHome &mostAutomatedHome(SmartHome *s, int n) {
    int index = 0;
    int max = 0;
    for (int i = 0; i < n; i++) {
        if (s[i].getN() >= max) {
            //>= oti se zema posledniot
            max = s[i].getN();
            index = i;
        }
    }
    return s[index];
}

int main() {
    int testCase;
    cin >> testCase;

    if (testCase == 0) {
        cout << "TESTING DEVICE CONSTRUCTORS" << endl;
        Device d1;
        Device d2("Fridge", 150, kitchen, 499.99, true);
        Device d3("TV", 200, entertainment, 299.50, false);
        Device d4("Camera", 15, security, 149.99, true);
        Device d5(d2);
        cout << "TEST PASSED" << endl;
    } else if (testCase == 1) {
        cout << "TESTING DEVICE print()" << endl;
        Device d1("TV", 200, entertainment, 299.50, false);
        Device d2("Fridge", 150, kitchen, 499.99, true);
        d1.print();
        d2.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 2) {
        cout << "TESTING DEVICE togglePower()" << endl;
        Device d("Alarm", 10, security, 49.99, false);
        d.print();
        d.togglePower();
        cout << "After toggle: ";
        d.print();
        d.togglePower();
        cout << "After toggle: ";
        d.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 3) {
        cout << "TESTING DEVICE increasePowerConsumption()" << endl;
        Device d("Oven", 480, kitchen, 199.99, true);
        d.print();
        d.increasePowerConsumption(15);
        d.print();
        d.increasePowerConsumption(5);
        d.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 4) {
        cout << "TESTING SMARTHOME CONSTRUCTOR" << endl;
        SmartHome h1("Home A");
        h1.print();
        SmartHome h2(h1);
        h2.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 5) {
        cout << "TESTING addDevice() and print()" << endl;
        SmartHome home("My Smart Home");
        Device d1("Light", 20, kitchen, 15.00, true);
        Device d2("Camera", 25, security, 35.00, false);
        Device d3("Camera", 25, entertainment, 35.00, false);
        Device d4("Light", 25, security, 35.00, false);
        Device d5("Camera", 21, security, 32.00, true);
        home.addDevice(d1);
        home.addDevice(d2);
        home.addDevice(d3);
        home.addDevice(d4);
        home.addDevice(d5);
        home.print();
        SmartHome home2(home);
        home2.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 6) {
        cout << "TESTING toggleAllDevicesByCategory()" << endl;
        SmartHome home("House");
        Device a("Sensor", 5, security, 25.0, false);
        Device b("Speaker", 50, entertainment, 99.0, false);
        Device c("Front house Camera", 10, security, 45.0, false);
        Device d("Fridge", 25, kitchen, 100.0, true);
        Device e("Alarm", 20, security, 70.0, true);
        Device f("Garden Camera", 10, security, 30.0, true);
        Device g("TV", 90, entertainment, 200.0, true);
        home.addDevice(a);
        home.addDevice(b);
        home.addDevice(c);
        home.addDevice(d);
        home.addDevice(e);
        home.addDevice(f);
        home.addDevice(g);
        home.print();
        home.toggleAllDevicesByCategory(security);
        home.print();
        home.toggleAllDevicesByCategory(security);
        home.print();
        home.toggleAllDevicesByCategory(entertainment);
        home.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 7) {
        cout << "TESTING increasePowerConsumptionForCategory()" << endl;
        SmartHome home("Villa");
        Device a("Sensor", 5, security, 25.0, false);
        Device b("Speaker", 50, entertainment, 99.0, false);
        Device c("Front house Camera", 10, security, 45.0, false);
        Device d("Fridge", 25, kitchen, 100.0, true);
        Device e("Alarm", 20, security, 70.0, true);
        Device f("Garden Camera", 10, security, 30.0, true);
        Device g("TV", 90, entertainment, 200.0, true);
        home.addDevice(a);
        home.addDevice(b);
        home.addDevice(c);
        home.addDevice(d);
        home.addDevice(e);
        home.addDevice(f);
        home.addDevice(g);
        home.increasePowerConsumptionForCategory(50, security);
        home.print();
        home.increasePowerConsumptionForCategory(80, entertainment);
        home.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 8) {
        cout << "TESTING mostAutomatedHome()" << endl;
        SmartHome homes[3] = {
            SmartHome("A"),
            SmartHome("B"),
            SmartHome("C")
        };
        Device x("X", 1, kitchen, 1.0, true);
        Device y("Y", 2, security, 2.0, true);
        homes[0].addDevice(x);
        homes[0].addDevice(y);
        homes[2].addDevice(x);
        homes[2].addDevice(y);
        SmartHome &best1 = mostAutomatedHome(homes, 3);
        best1.print();

        Device z("Z", 10, entertainment, 5.0, true);
        homes[1].addDevice(z);
        homes[1].addDevice(x);
        homes[1].addDevice(y);
        SmartHome &best2 = mostAutomatedHome(homes, 3);
        best2.print();
        cout << "TEST PASSED" << endl;
    } else if (testCase == 9) {
        cout << "TESTING mostAutomatedHome()" << endl;
        SmartHome homes[3] = {
            SmartHome("A"),
            SmartHome("B"),
            SmartHome("C")
        };
        Device x("X", 1, kitchen, 1.0, true);
        Device y("Y", 2, security, 2.0, true);
        homes[0].addDevice(x);
        homes[0].addDevice(y);
        homes[1].addDevice(x);
        homes[1].addDevice(y);
        SmartHome &best1 = mostAutomatedHome(homes, 3);
        best1.print();

        Device z("Z", 10, entertainment, 5.0, true);
        homes[2].addDevice(z);
        homes[2].addDevice(x);
        homes[2].addDevice(x);
        homes[0].addDevice(z);
        SmartHome &best2 = mostAutomatedHome(homes, 3);
        best2.print();
        cout << "TEST PASSED" << endl;
    }

    return 0;
}
