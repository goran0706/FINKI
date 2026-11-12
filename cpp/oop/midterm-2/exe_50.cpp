#include <iostream>
#include <cstring>
using namespace std;

class Vozac {
protected:
    char name[100];
    int age;
    int numberOfRaces;
    bool veteran;

public:
    Vozac(const char *name = "", const int age = 0, const int numberOfRaces = 0, const bool veteran = false) {
        strcpy(this->name, name);
        this->age = age;
        this->numberOfRaces = numberOfRaces;
        this->veteran = veteran;
    }

    Vozac(const Vozac &vozac) {
        strcpy(this->name, vozac.name);
        this->age = vozac.age;
        this->numberOfRaces = vozac.numberOfRaces;
        this->veteran = vozac.veteran;
    }

    Vozac &operator=(const Vozac &vozac) {
        if (this != &vozac) {
            strcpy(this->name, vozac.name);
            this->age = vozac.age;
            this->numberOfRaces = vozac.numberOfRaces;
            this->veteran = vozac.veteran;
        }
        return *this;
    }

    ~Vozac() {
    }

    virtual float Zarabotuvacka() = 0;

    virtual float danok() = 0;

    friend ostream &operator<<(ostream &os, const Vozac &vozac) {
        os << vozac.name << endl;
        os << vozac.age << endl;
        os << vozac.numberOfRaces << endl;
        if (vozac.veteran) {
            os << "VETERAN" << endl;
        }
        return os;
    }
};

class Avtomobilist : public Vozac {
private:
    float price;

public:
    Avtomobilist(const char *name = "", const int age = 0, const int numberOfRaces = 0, const bool veteran = false,
                 const float price = 0) : Vozac(name, age, numberOfRaces, veteran) {
        this->price = price;
    }

    Avtomobilist(const Avtomobilist &avtomobilist) : Vozac(avtomobilist) {
        this->price = avtomobilist.price;
    }

    Avtomobilist &operator=(const Avtomobilist &avtomobilist) {
        if (this != &avtomobilist) {
            strcpy(this->name, avtomobilist.name);
            this->age = avtomobilist.age;
            this->numberOfRaces = avtomobilist.numberOfRaces;
            this->veteran = avtomobilist.veteran;
            this->price = avtomobilist.price;
        }
        return *this;
    }

    ~Avtomobilist() {
    }

    float Zarabotuvacka() override {
        return price / 5;
    }

    float danok() override {
        if (this->numberOfRaces > 10) {
            return Zarabotuvacka() * 0.15;
        } else {
            return Zarabotuvacka() * 0.1;
        }
    }
};

class Motociklist : public Vozac {
private:
    int power;

public:
    Motociklist(const char *name = "", const int age = 0, const int numberOfRaces = 0, const bool veteran = false,
                const int power = 0) : Vozac(name, age, numberOfRaces, veteran) {
        this->power = power;
    }

    Motociklist(const Motociklist &motociklist) : Vozac(motociklist) {
        this->power = motociklist.power;
    }

    Motociklist &operator=(const Motociklist &motociklist) {
        if (this != &motociklist) {
            strcpy(this->name, motociklist.name);
            this->age = motociklist.age;
            this->numberOfRaces = motociklist.numberOfRaces;
            this->veteran = motociklist.veteran;
            this->power = motociklist.power;
        }
        return *this;
    }

    ~Motociklist() {
    }

    float Zarabotuvacka() override {
        return power * 20;
    }

    float danok() override {
        if (this->veteran) {
            return Zarabotuvacka() * 0.25;
        } else {
            return Zarabotuvacka() * 0.20;
        }
    }
};

int soIstaZarabotuvachka(Vozac **array, int n, Vozac *obj) {
    int counter = 0;
    for (int i = 0; i < n; i++) {
        if (array[i]->Zarabotuvacka() == obj->Zarabotuvacka()) {
            counter++;
        }
    }
    return counter;
}

int main() {
    int n, x;
    cin >> n >> x;
    Vozac **v = new Vozac *[n];
    char ime[100];
    int vozrast;
    int trki;
    bool vet;
    for (int i = 0; i < n; ++i) {
        cin >> ime >> vozrast >> trki >> vet;
        if (i < x) {
            float cena_avto;
            cin >> cena_avto;
            v[i] = new Avtomobilist(ime, vozrast, trki, vet, cena_avto);
        } else {
            int mokjnost;
            cin >> mokjnost;
            v[i] = new Motociklist(ime, vozrast, trki, vet, mokjnost);
        }
    }
    cout << "=== DANOK ===" << endl;
    for (int i = 0; i < n; ++i) {
        cout << *v[i];
        cout << v[i]->danok() << endl;
    }
    cin >> ime >> vozrast >> trki >> vet;
    int mokjnost;
    cin >> mokjnost;
    Vozac *vx = new Motociklist(ime, vozrast, trki, vet, mokjnost);
    cout << "=== VOZAC X ===" << endl;
    cout << *vx;
    cout << "=== SO ISTA ZARABOTUVACKA KAKO VOZAC X ===" << endl;
    cout << soIstaZarabotuvachka(v, n, vx);
    for (int i = 0; i < n; ++i) {
        delete v[i];
    }
    delete [] v;
    delete vx;
    return 0;
}
