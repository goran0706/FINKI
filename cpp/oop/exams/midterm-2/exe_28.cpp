#include <iostream>
#include <cstring>

using namespace std;

enum tip {
    SMARTPHONE, PC
};

class InvalidProductionDate {
public:
    void showMessage() {
        cout << "Невалидна година на производство" << endl;
    }
};

class Device {
private:
    char model[101];
    tip type;
    static double hours;
    int production_year;

public:
    Device(const char *model = "", tip type = {}, int production_year = 0) {
        static double hours = 0;
        strcpy(this->model, model);
        this->type = type;
        this->production_year = production_year;
    }

    static void setPocetniCasovi(int i) {
        hours = i;
    }

    double proverka() const {
        if (production_year > 2015 && type == PC) {
            return hours + 2.0 + 2.0;
        } else if (type == PC) {
            return hours + 2.0;
        } else if (production_year > 2015) {
            return hours + 2.0;
        } else {
            return hours;
        }
    }

    friend ostream &operator<<(ostream &os, const Device &device) {
        os << device.model << endl;
        if (device.type == SMARTPHONE) {
            os << "Mobilen";
        } else if (device.type == PC) {
            os << "Laptop";
        }
        os << " " << device.proverka() << endl;
        return os;
    }

    int getProductionYear() const {
        return production_year;
    }
};

double Device::hours = 1.0;


class MobileServis {
private:
    char adress[101];
    Device *devices;
    int n;

public:
    MobileServis(const char *adress = "") {
        strcpy(this->adress, adress);
        this->devices = nullptr;
        this->n = 0;
    }

    MobileServis(const MobileServis &m) {
        strcpy(this->adress, m.adress);
        this->n = m.n;
        this->devices = new Device[m.n];
        for (int i = 0; i < n; ++i) {
            devices[i] = m.devices[i];
        }
    }

    MobileServis &operator=(const MobileServis &m) {
        if (this != &m) {
            strcpy(this->adress, m.adress);
            this->n = m.n;
            delete[] devices;
            this->devices = new Device[m.n];
            for (int i = 0; i < m.n; ++i) {
                devices[i] = m.devices[i];
            }
        }
        return *this;
    }

    ~MobileServis() {
        delete [] devices;
    }

    void operator+=(Device &d) {
        if (d.getProductionYear() > 2019 || d.getProductionYear() < 2000) {
            throw InvalidProductionDate();
        }

        Device *tmp = new Device[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = devices[i];
        }
        tmp[n++] = d;
        delete [] devices;
        devices = tmp;
    }

    void pecatiCasovi() {
        cout << "Ime: " << adress << endl;
        for (int i = 0; i < n; ++i) {
            cout << devices[i];
        }
    }
};

int main() {
    int testCase;
    cin >> testCase;
    char ime[100];
    int tipDevice;
    int godina;
    int n;
    Device devices[50];
    if (testCase == 1) {
        cout << "===== Testiranje na klasite ======" << endl;
        cin >> ime;
        cin >> tipDevice;
        cin >> godina;
        Device ig(ime, (tip) tipDevice, godina);
        cin >> ime;
        MobileServis t(ime);
        cout << ig;
    }
    if (testCase == 2) {
        cout << "===== Testiranje na operatorot += ======" << endl;
        cin >> ime;
        cin >> n;
        MobileServis t(ime);
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> tipDevice;
            cin >> godina;
            Device tmp(ime, (tip) tipDevice, godina);
            try {
                t += tmp;
            } catch (InvalidProductionDate e) {
                e.showMessage();
            }
        }
        t.pecatiCasovi();
    }
    if (testCase == 3) {
        cout << "===== Testiranje na isklucoci ======" << endl;
        cin >> ime;
        cin >> n;
        MobileServis t(ime);
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> tipDevice;
            cin >> godina;
            Device tmp(ime, (tip) tipDevice, godina);
            try {
                t += tmp;
            } catch (InvalidProductionDate &e) {
                e.showMessage();
            }
        }
        t.pecatiCasovi();
    }
    if (testCase == 4) {
        cout << "===== Testiranje na konstruktori ======" << endl;
        cin >> ime;
        cin >> n;
        MobileServis t(ime);
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> tipDevice;
            cin >> godina;
            Device tmp(ime, (tip) tipDevice, godina);
            try {
                t += tmp;
            } catch (InvalidProductionDate e) {
                e.showMessage();
            }
        }
        MobileServis t2 = t;
        t2.pecatiCasovi();
    }
    if (testCase == 5) {
        cout << "===== Testiranje na static clenovi ======" << endl;
        cin >> ime;
        cin >> n;
        MobileServis t(ime);
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> tipDevice;
            cin >> godina;
            Device tmp(ime, (tip) tipDevice, godina);

            t += tmp;
        }
        t.pecatiCasovi();
        cout << "===== Promena na static clenovi ======" << endl;
        Device::setPocetniCasovi(2);
        t.pecatiCasovi();
    }

    if (testCase == 6) {
        cout << "===== Testiranje na kompletna funkcionalnost ======" << endl;
        cin >> ime;
        cin >> n;
        MobileServis t(ime);
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> tipDevice;
            cin >> godina;
            Device tmp(ime, (tip) tipDevice, godina);
            try {
                t += tmp;
            } catch (InvalidProductionDate e) {
                e.showMessage();
            }
        }
        Device::setPocetniCasovi(3);
        MobileServis t2 = t;
        t2.pecatiCasovi();
    }

    return 0;
}
