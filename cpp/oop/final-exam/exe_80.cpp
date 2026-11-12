#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class except : exception {
private:
    char message[50];
    char team[50];

public:
    except(const char *message = "", const char *team = "") {
        strcpy(this->message, message);
        strcpy(this->team, team);
    }

    void print() {
        cout << message << team << endl;
    }
};

class Goal {
private:
    char *name;
    int time;
    char teamName[50];

public:
    Goal(const char *name = "", int time = 0, const char *teamName = "") {
        this->name = new char [strlen(name) + 1];
        strcpy(this->name, name);
        this->time = time;
        strcpy(this->teamName, teamName);
    }

    Goal(const Goal &goal) {
        this->name = new char [strlen(goal.name) + 1];
        strcpy(this->name, goal.name);
        this->time = goal.time;
        strcpy(this->teamName, goal.teamName);
    }

    Goal &operator=(const Goal &goal) {
        if (this != &goal) {
            delete [] this->name;
            this->name = new char [strlen(goal.name) + 1];
            strcpy(this->name, goal.name);
            this->time = goal.time;
            strcpy(this->teamName, goal.teamName);
        }
        return *this;
    }

    ~Goal() {
        delete [] name;
    }

    friend ostream &operator<<(ostream &os, const Goal &goal) {
        os << goal.time << " " << goal.name << endl;
        return os;
    }

    Goal &operator++(int) {
        time++;
        return *this;
    }

    Goal &operator--() {
        time--;
        return *this;
    }

    char *getTeamName() {
        return teamName;
    }
};

class Game {
private:
    Goal *array;
    char team1[50];
    char team2[50];
    int n;

public:
    Game(const char *team1 = "", const char *team2 = "") {
        strcpy(this->team1, team1);
        strcpy(this->team2, team2);
        array = nullptr;
        n = 0;
    }

    Game(const Game &g) {
        strcpy(this->team1, g.team1);
        strcpy(this->team2, g.team2);
        for (int i = 0; i < n; i++) {
            this->array[i] = g.array[i];
        }
    }

    Game &operator=(const Game &g) {
        if (this != &g) {
            delete [] this->array;
            strcpy(this->team1, g.team1);
            strcpy(this->team2, g.team2);
            for (int i = 0; i < n; i++) {
                this->array[i] = g.array[i];
            }
        }
        return *this;
    }

    ~Game() {
        delete [] array;
    }

    Game &operator+=(Goal &goal) {
        if (strcmp(goal.getTeamName(), this->team1) == 0 || strcmp(goal.getTeamName(), this->team2) == 0) {
            Goal *temp = new Goal [n + 1];
            for (int i = 0; i < n; i++) {
                temp[i] = this->array[i];
            }
            temp[n] = goal;
            delete [] array;
            array = temp;
            n++;
            return *this;
        } else {
            throw except("Invalid team name: ", goal.getTeamName());
        }
    }

    friend ostream &operator<<(ostream &os, const Game &g) {
        os << g.team1 << " - " << g.team2 << endl;
        for (int i = 0; i < g.n; i++) {
            cout << g.array[i];
        }
        return os;
    }
};

int main() {
    char team1[50];
    char team2[50];
    cin >> team1;
    cin >> team2;
    Game n(team1, team2);
    int x;
    cin >> x;
    char player[100];
    int m;
    for (int i = 0; i < x; ++i) {
        cin >> player;
        cin >> m;
        cin >> team1;
        Goal g(player, m, team1);
        try {
            n += g;
        } catch (except &e) {
            e.print();
        }
    }
    cout << n << endl;


    return 0;
}
