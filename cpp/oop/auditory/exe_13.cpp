/*
    Објектно ориентирано програмирање

    Аудиториска вежба 4 (copy constructor, this, friends, static)
    1. Задачи
    1.1. Екипа

    Да се дефинира класа Ekipa што содржи информации за:

    - име на екипата,
    - година на формирање и
    - градот од каде потекнува.

    Да се дефинира класа Natprevar што содржи информации за

    - домаќин, гостин (објекти од класата Ekipa),
    - голови кои ги постигнал домаќинот и
    - голови кои ги постигнал гостинот.

    Да се дефинира посебна функција revans што како аргументи прима два објекта од класата Natprevar и проверува дали едниот натпревар е реванш на другиот.
    Еден натпревар е реваш на друг ако гостинот и домаќинот од првиот натпревар се истите екипи со домаќинот и гостинот од вториот натпревар, соодветно.

    Да се дефинира функцијата duel која што како аргументи прима два објекта од класата Natprevar и
    ако едниот натпревар е ревашн на другиот функцијата треба да ја врати екипата која е подобра во меѓусебниот дуел.
    Во спротивно да испечати порака дека натпреварите не се совпаѓаат.
    Во случајот кога е нерешено функцијата враќа 0.
*/
#include <cstring>
#include <iostream>
using namespace std;

enum {
    NameLen = 50,
    CityLen = 50
};

class Team {
private:
    char name[NameLen]{};
    char city[CityLen]{};
    int yearFounded{0};

public:
    Team() {
        name[0] = '\0';
        city[0] = '\0';
    }

    Team(const char *name, const int yearFounded, const char *city) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        strncpy(this->city, city, CityLen - 1);
        this->city[CityLen - 1] = '\0';
        this->yearFounded = yearFounded;
    }

    Team(const Team &other) {
        strcpy(name, other.name);
        strcpy(city, other.city);
        yearFounded = other.yearFounded;
    }

    ~Team() = default;

    void setName(const char *_name) {
        strncpy(this->name, _name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
    }

    void setCity(const char *_city) {
        strncpy(this->city, _city, CityLen - 1);
        this->city[CityLen - 1] = '\0';
    }

    void setYear(const int _year) { this->yearFounded = _year; }

    [[nodiscard]] const char *getName() const { return name; }
    [[nodiscard]] const char *getCity() const { return city; }
    [[nodiscard]] int getYear() const { return yearFounded; }

    void print() const { cout << name << " " << yearFounded << endl; }
};

class Game {
private:
    Team host;
    Team guest;
    int hostGoals{0};
    int guestGoals{0};

public:
    Game() = default;

    Game(const Team &host, const Team &guest, const int hostGoals, const int guestGoals) {
        this->host = host;
        this->guest = guest;
        this->hostGoals = hostGoals;
        this->guestGoals = guestGoals;
    }

    ~Game() = default;

    void setHost(const Team &_host) { this->host = _host; }
    void setGuest(const Team &_guest) { this->guest = _guest; }
    void setHostGoals(const int _goals) { this->hostGoals = _goals; }
    void setGuestGoals(const int _goals) { this->guestGoals = _goals; }

    [[nodiscard]] const Team &getHost() const { return host; }
    [[nodiscard]] const Team &getGuest() const { return guest; }
    [[nodiscard]] int getHostGoals() const { return hostGoals; }
    [[nodiscard]] int getGuestGoals() const { return guestGoals; }
};

bool rematch(const Game &g1, const Game &g2) {
    return strcmp(g1.getHost().getName(), g2.getGuest().getName()) == 0 &&
           strcmp(g1.getGuest().getName(), g2.getHost().getName()) == 0;
}

const Team *winner(const Game &g1, const Game &g2) {
    if (!rematch(g1, g2)) {
        cout << "Natprevarite ne se sofpagaat." << endl;
        return nullptr;
    }

    int totalHostGoals = g1.getHostGoals() + g2.getGuestGoals();
    int totalGuestGoals = g1.getGuestGoals() + g2.getHostGoals();

    if (totalHostGoals > totalGuestGoals) {
        return &g1.getHost();
    } else if (totalGuestGoals > totalHostGoals) {
        return &g1.getGuest();
    } else {
        return nullptr;
    }
}

int main() {
    const Team t1("Barcelona", 1930, "Barcelona");
    const Team t2("Real Madrid", 1920, "Madrid");

    const Game g1(t1, t2, 3, 1);
    const Game g2(t2, t1, 3, 0);

    const Team *w = winner(g1, g2);

    if (w != nullptr) {
        w->print();
    } else {
        cout << "Neresheno (0)" << endl;
    }

    return 0;
}
