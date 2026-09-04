/*
    Објектно ориентирано програмирање

    Аудиториска вежба 3 (Композиција, const објекти)

    1. Задачи
    1.1. Екипа

    Да се дефинира класа Team што содржи информации за име на екипата, година на формирање и градот од каде потекнува.

    Да се дефинира класа Game што содржи информации за домаќин, гостин (објекти од класата Team),
    голови кои ги постигнал домаќинот и голови кои ги постигнал гостинот.

    Да се дефинира посебна функција revans што како аргументи прима два константни (const) објекта од класата Game и
    проверува дали едниот натпревар е реванш на другиот. Еден натпревар е реваш на друг ако гостинот и домаќинот од
    првиот натпревар се истите екипи со домаќинот и гостинот од вториот натпревар, соодветно.

    Да се дефинира функцијата duel која што како аргументи прима два константни (const) објекта од класата Game.
    Ако едниот натпревар е реванш на другиот функцијата треба да ја врати екипата која е подобра во меѓусебниот дуел.
    Во спротивно, треба да испечати порака дека натпреварите не се совпаѓаат.
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
    int yearFounded;

public:
    Team(const char *name = "", const char *city = "", const int yearFounded = 0) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        strncpy(this->city, city, CityLen - 1);
        this->city[CityLen - 1] = '\0';
        this->yearFounded = yearFounded;
    }

    ~Team() = default;

    [[nodiscard]] const char *getName() const { return name; }
    [[nodiscard]] const char *getCity() const { return city; }
    [[nodiscard]] int getYear() const { return yearFounded; }

    void print() const {
        cout << name << " " << yearFounded << endl;
    }
};

class Game {
private:
    Team host;
    Team guest;
    int hostGoals;
    int guestGoals;

public:
    Game(const Team &host, const Team &guest, const int hostGoals = 0, const int guestGoals = 0)
        : host(host),
          guest(guest),
          hostGoals(hostGoals),
          guestGoals(guestGoals) {
    }

    ~Game() = default;

    [[nodiscard]] const Team &getHost() const { return host; }
    [[nodiscard]] const Team &getGuest() const { return guest; }
    [[nodiscard]] int getHostGoals() const { return hostGoals; }
    [[nodiscard]] int getGuestGoals() const { return guestGoals; }
};

bool rematch(const Game &game1, const Game &game2) {
    return strcmp(game1.getHost().getName(), game2.getGuest().getName()) == 0 &&
           strcmp(game1.getGuest().getName(), game2.getHost().getName()) == 0;
}

const Team *winner(const Game &game1, const Game &game2) {
    if (!rematch(game1, game2)) {
        cout << "Natprevarite ne se sovpagaat." << endl;
        return nullptr;
    }

    int goalsTeamA = game1.getHostGoals() + game2.getGuestGoals();
    int goalsTeamB = game1.getGuestGoals() + game2.getHostGoals();

    if (goalsTeamA > goalsTeamB) {
        return &game1.getHost();
    } else if (goalsTeamB > goalsTeamA) {
        return &game1.getGuest();
    } else {
        return nullptr;
    }
}

int main() {
    Team t1("Inter", "Milan", 1910);
    Team t2("Milan", "Milan", 1900);

    Game match1(t1, t2, 2, 0);
    Game match2(t2, t1, 5, 0);

    const Team *winner = winner(match1, match2);

    if (winner != nullptr) {
        cout << "Pobednik od duelot e: ";
        winner->print();
    } else {
        cout << "Duelot e nereshen (0)" << endl;
    }

    return 0;
}
