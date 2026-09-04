// Да се напише класа Automobile во која се чуваат информации за
//      марката на автомобилот (динамички алоцирана низа од знаци),
//      регистрација (динамички алоцирана низа од 5 цели броја) и
//      максимална брзина (цел број).
//
// За класата да се обезбедат set и get методите што се користат и да се преоптоварат следните оператори:
//      оператор == за споредување на два автомобила според регистрацијата
//      оператор << за печатење на податоци на автомобил во формат Marka:име Registracija:[x y z k l]
// ------------------------------------------
// Да се напише класа RentACar за агенција за измајмување возила во која се чуваат
//      информација за името на агенцијата (низа од 100 знци),
//      низа од автомобили (динамички алоациана низа од објекти од класата Automobile) и
//      број на автомобили со кој располага (цел број).
//
//  Во класата RentACar да се напише конструктор со еден аргумент за иницијализација на името на агенцијата.
//  При секое додавање на нов автомобил, динамички алоцираната низа да го зголемува капацитетот за 1 елемент.
//  Во оваа класа да се преоптоварат операторите:
//      += за додавање на нов автомобил во агенцијата и
//      -= за отстранување на даден автомобил од агенцијата (оној со иста регистрација).
// ------------------------------------------
// Да се напише main функција во која се инстанцира објект од класата RentACar.
// Во овој објект да се додадат сите автомобили чии информации се читаат од тастатура со операторот +=.
// Меѓутоа, откриено е дека во внесувањето на податоците има грешка затоа што при обид да се додаде нов автомобил во агенцијата,
// увидено е дека таа регистрација веќе постои. Во последниот ред од влезот дадени се инфромации тој автомобил.
// Потребно е да се избрише автомобилот што претходно е погрешно внесен и да се додаде новиот.
// ------------------------------------------
// На излез да се отпечатат името на агенцијата и листа на автомобили што таа ги изнајмува, а чија максимална брзина е поголема од 150.
// Последново да се направи со функција pecatiNadBrzina(int max) што треба да се дефинира во класата RentACar.
// Се признаваат решенија без динамичка алокација!

#include <iostream>
#include <cstring>
using namespace std;

constexpr int REG_SIZE = 5;
constexpr int AGENCY_NAME_SIZE = 100;

class Automobile {
private:
    char *model;
    int *registrationNumber;
    int maxSpeed;

public:
    explicit Automobile(const char *model = "", const int *registrationNumber = nullptr, const int maxSpeed = 100) {
        this->model = new char[strlen(model) + 1];
        strcpy(this->model, model);

        this->registrationNumber = new int[REG_SIZE]();
        if (registrationNumber) {
            memcpy(this->registrationNumber, registrationNumber, REG_SIZE * sizeof(int));
        }

        this->maxSpeed = maxSpeed;
    }

    // DEEP COPPY
    Automobile(const Automobile &other) {
        model = new char[strlen(other.model) + 1];
        strcpy(model, other.model);

        registrationNumber = new int[REG_SIZE];
        memcpy(registrationNumber, other.registrationNumber, REG_SIZE * sizeof(int));

        maxSpeed = other.maxSpeed;
    }

    Automobile &operator=(const Automobile &other) {
        if (this != &other) {
            delete[] model;
            delete[] registrationNumber;

            model = new char[strlen(other.model) + 1];
            strcpy(model, other.model);

            registrationNumber = new int[REG_SIZE];
            memcpy(registrationNumber, other.registrationNumber, REG_SIZE * sizeof(int));

            maxSpeed = other.maxSpeed;
        }
        return *this;
    }

    ~Automobile() {
        delete[] model;
        delete[] registrationNumber;
    }

    [[nodiscard]] const char *getModel() const {
        return model;
    }

    void setModel(const char *_model) {
        delete[] model;
        model = new char[strlen(_model) + 1];
        strcpy(model, _model);
    }

    [[nodiscard]] int *getRegistrationNumber() const {
        return registrationNumber;
    }

    void setRegistrationNumber(const int *_registrationNumber) const {
        memcpy(registrationNumber, _registrationNumber, REG_SIZE * sizeof(int));
    }

    [[nodiscard]] int getSpeed() const {
        return maxSpeed;
    }

    void setSpeed(const int speed) {
        maxSpeed = speed;
    }

    bool operator==(const Automobile &other) const {
        for (int i = 0; i < REG_SIZE; i++) {
            if (registrationNumber[i] != other.registrationNumber[i])
                return false;
        }
        return true;
    }

    friend ostream &operator<<(ostream &out, const Automobile &car) {
        out << "Marka:" << car.model << " Registracija:[";
        for (int i = 0; i < REG_SIZE; i++) {
            out << car.registrationNumber[i];
            if (i < REG_SIZE - 1) out << " ";
        }
        out << "]";
        return out;
    }
};


class RentACar {
private:
    char agencyName[AGENCY_NAME_SIZE]{};
    int automobileCount;
    Automobile *catalog;

public:
    explicit RentACar(const char *name = "") {
        strncpy(agencyName, name, 99);
        agencyName[99] = '\0';
        automobileCount = 0;
        catalog = nullptr;
    }

    ~RentACar() {
        delete[] catalog;
    }


    RentACar &operator+=(const Automobile &a) {
        auto *newCatalog = new Automobile[automobileCount + 1];
        for (int i = 0; i < automobileCount; i++) {
            newCatalog[i] = catalog[i];
        }
        newCatalog[automobileCount++] = a;

        delete[] catalog;
        catalog = newCatalog;

        return *this;
    }

    RentACar &operator-=(const Automobile &a) {
        return *this;
    }


    void pecatiNadBrzina(int max) const {
        cout << agencyName << endl;
        for (int i = 0; i < automobileCount; i++) {
            if (catalog[i].getSpeed() > max) {
                cout << catalog[i] << endl;
            }
        }
    }
};

int main() {
    int reg1[REG_SIZE] = {1, 2, 3, 4, 5};
    const Automobile car1;
    const Automobile car2("BMW", reg1, 200);

    cout << car1 << endl;
    cout << car2 << endl;

    RentACar agency("MyAgency");
    agency += car1;
    agency += car2;

    agency.pecatiNadBrzina(150);

    return 0;
}


// RentACar &operator+=(const Automobile &a) {
//     Automobile *tmp = new Automobile[automobileCount + 1];
//
//     for (int i = 0; i < automobileCount; i++)
//         tmp[i] = catalog[i];
//
//     tmp[automobileCount] = a;
//     delete[] catalog;
//     catalog = tmp;
//     automobileCount++;
//     return *this;
// }
//
// RentACar &operator-=(const Automobile &a) {
//     int index = -1;
//     for (int i = 0; i < automobileCount; i++) {
//         if (catalog[i] == a) {
//             index = i;
//             break;
//         }
//     }
//     if (index == -1) return *this;
//     Automobile *tmp = new Automobile[automobileCount - 1];
//     int j = 0;
//     for (int i = 0; i < automobileCount; i++)
//         if (i != index)
//             tmp[j++] = catalog[i];
//     delete[] catalog;
//     catalog = tmp;
//     automobileCount--;
//     return *this;
// }
