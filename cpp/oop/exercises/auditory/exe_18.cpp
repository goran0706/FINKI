/*
    Објектно ориентирано програмирање

    Аудиториска вежба 6 (inheritance)
    1. Наследување
    1.1. Задача

    Да се дефинира класа за репрезентација на тениски играч.

    За секој тениски играч треба да се чуваат името, презимето како и тоа дали игра во лига (bool).

    Од класата тениски играч да се изведе класа за рангиран тениски играч, која ќе репрезентира играч кој игра на меѓународно ниво.

    За рангираните тениски играчи дополнително треба да се чува и рангот на тенискиот играч.
*/
#include <cstring>
#include <iostream>
using namespace std;

class Player {
private:
    static constexpr int MAX_LEN = 50;
    char firstName[MAX_LEN]{};
    char lastName[MAX_LEN]{};
    bool isPlaying = false;

public:
    Player() = default;

    Player(const char *firstName, const char *lastName, bool isPlaying) {
        strncpy(this->firstName, firstName, MAX_LEN - 1);
        this->firstName[MAX_LEN - 1] = '\0';
        strncpy(this->lastName, lastName, MAX_LEN - 1);
        this->lastName[MAX_LEN - 1] = '\0';
        this->isPlaying = isPlaying;
    }

    void setFirstName(const char *_firstName) {
        strncpy(this->firstName, _firstName, MAX_LEN - 1);
        this->firstName[MAX_LEN - 1] = '\0';
    }

    void setLastName(const char *_lastName) {
        strncpy(this->lastName, _lastName, MAX_LEN - 1);
        this->lastName[MAX_LEN - 1] = '\0';
    }

    void setIsPlaying(const char *_isPlaying) {
        this->isPlaying = _isPlaying;
    }

    [[nodiscard]] const char *getFirstName() const {
        return firstName;
    }

    [[nodiscard]] const char *getLastName() const {
        return lastName;
    }

    [[nodiscard]] bool getIsPlaying() const {
        return isPlaying;
    }

    void print() const {
        cout << firstName << " " << lastName << " | " << isPlaying << endl;
    }
};

class RankedPlayer : public Player {
private:
    int rank;

public:
    RankedPlayer() {
        rank = 0;
    }

    RankedPlayer(int rank) {
        this->rank = rank;
    }

    RankedPlayer(const char *firstName, const char *lastName, bool isPlaying, int rank)
        : Player(firstName, lastName, isPlaying), rank(rank) {
    }

    [[nodiscard]] int getRank() const {
        return rank;
    }

    void print() const {
        Player::print();
        cout << "Rank: " << rank << "\n";
    }
};

int main() {
    const Player p1("FirstName", "LastName", true);
    p1.print();

    const RankedPlayer rp("FirstName", "LastName", true, 100);
    rp.print();
}
