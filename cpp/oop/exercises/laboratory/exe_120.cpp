// Да се креира класа Game за опишување на видеоигра. Класата треба да содржи:
//      name (низа од максимум 50 знаци),
//      конструктор со аргументи,
//      оператор == за споредба на две игри (споредба по име)
//      гетер getName()

// Потоа да се креира апстрактна класа Gamer која содржи информации за гејмер и тоа:
//      username (динамички алоцирана низа од знаци)
//      games (низа од максимум 50 игри)
//      numGames (цел број)
//      hoursPerWeek (цел број)

// Класата треба да содржи:
//      Конструктор со аргументи
//      Copy конструктор
//      Оператор=
//      Деструктор
//      Функција bool playsGame(const Game &game) која враќа дали гејмерот ја игра дадената игра
//      Дополнително класата треба да содржи два чисто виртуелни (апстрактни) методи:
//      const char* calculateSkillLevel() - за пресметување на нивото на вештина на гејмерот.
//      void printInfo() - за печатење на информациите за гејмерот

// Од оваа класа да се изведат класите PCGamer и ConsoleGamer кои го специфицираат типот на гејмерот.
//
// За секој PCGamer дополнително се чуваат следните информации:
//      streamHours (цел број)
//      Класата треба да содржи:
//      Конструктор со аргументи
//      Copy конструктор
//      Оператор=
//      Деструктор
//      Имплементација на чисто виртуелните методи од Gamer
//      Нивото на вештина (calculateSkillLevel()) за PCGamer се одредува според следниве правила:
//
// Доколку гејмерот игра повеќе од 30 часа неделно и стримува повеќе од 20 часа, се смета за „Pro PCGamer“.
// Во спротивно, се смета за „Casual PCGamer“.
// Функцијата за печатење (printInfo()) на податоци треба да биде во следниов формат:
// PCGamer : [име], Hours Per Week: [часови]h, Skill Level: [ниво]
//
// За секој ConsoleGamer дополнително се чуваат следните информации:
//      isProPlayer (bool вредност)
//      Класата треба да содржи:
//      Конструктор со аргументи
//      Copy конструктор
//      Оператор=
//      Деструктор
//      Имплементација на чисто виртуелните методи од Gamer
//      Нивото на вештина (calculateSkillLevel()) за ConsoleGamer се одредува според следниве правила:
//      Доколку е означен како професионален играч, се смета за „Pro ConsoleGamer“.
// Во спротивно, се смета за „Casual ConsoleGamer“.
// Функцијата за печатење (printInfo()) на податоци треба да биде во следниов формат:
//
// ConsoleGamer: [име], Hours Per Week: [часови]h, Skill Level: [ниво]
//
// Да се дефинира глобална функција void printGamersThatPlayGame(Gamer *gamers[], int n, const Game &game)
// што на влез прима низа од покажувачи кон објекти од класата Gamer, нивниот број и игра,
// а како резултат ги печати информациите за сите играчи кои ја играат дадената игра и дополнително имаат
// hoursPerWeek поголем од просечниот на играчите кои ја играат дадената игра.

#include <iostream>
#include <cstring>
using namespace std;

class Game {
    char name[50];

public:
    Game(const char *n = "") {
        strcpy(this->name, name);
    }

    bool operator==(const Game &g) const {
        return strcmp(name, g.name) == 0;
    }

    const char *getName() const {
        return name;
    }
};

class Gamer {
protected:
    char *username;
    Game games[50];
    int numGames;
    int hoursPerWeek;

public:
    Gamer(const char *uname, Game *g, int ng, int hpw) {
        username = new char[strlen(uname) + 1];
        strcpy(username, uname);
        numGames = ng;
        hoursPerWeek = hpw;
        for (int i = 0; i < ng; ++i) {
            games[i] = g[i];
        }
    }

    Gamer(const Gamer &g) {
        username = new char[strlen(g.username) + 1];
        strcpy(username, g.username);
        numGames = g.numGames;
        hoursPerWeek = g.hoursPerWeek;
        for (int i = 0; i < numGames; ++i) {
            games[i] = g.games[i];
        }
    }

    Gamer &operator=(const Gamer &g) {
        if (this != &g) {
            delete[] username;
            username = new char[strlen(g.username) + 1];
            strcpy(username, g.username);
            numGames = g.numGames;
            hoursPerWeek = g.hoursPerWeek;
            for (int i = 0; i < numGames; ++i) {
                games[i] = g.games[i];
            }
        }
        return *this;
    }

    virtual ~Gamer() {
        delete[] username;
    }

    bool playsGame(const Game &game) const {
        for (int i = 0; i < numGames; ++i) {
            if (games[i] == game) return true;
        }
        return false;
    }

    virtual const char *calculateSkillLevel() const = 0;

    virtual void printInfo() const = 0;

    int getHoursPerWeek() const {
        return hoursPerWeek;
    }
};

class PCGamer : public Gamer {
    int streamHours;

public:
    PCGamer(const char *uname, Game g[], int ng, int hpw, int sh)
        : Gamer(uname, g, ng, hpw), streamHours(sh) {
    }

    PCGamer(const PCGamer &pg) : Gamer(pg), streamHours(pg.streamHours) {
    }

    PCGamer &operator=(const PCGamer &pg) {
        if (this != &pg) {
            Gamer::operator=(pg);
            streamHours = pg.streamHours;
        }
        return *this;
    }

    ~PCGamer() override {
    }

    const char *calculateSkillLevel() const override {
        if (hoursPerWeek > 30 && streamHours > 20)
            return "Pro PCGamer";
        return "Casual PCGamer";
    }

    void printInfo() const override {
        cout << "PCGamer: " << username << ", Hours Per Week: " << hoursPerWeek << "h, Skill Level: " <<
                calculateSkillLevel() << endl;
    }
};

class ConsoleGamer : public Gamer {
    bool isProPlayer;

public:
    ConsoleGamer(const char *uname, Game g[], int ng, int hpw, bool isPro)
        : Gamer(uname, g, ng, hpw), isProPlayer(isPro) {
    }

    ConsoleGamer(const ConsoleGamer &cg) : Gamer(cg), isProPlayer(cg.isProPlayer) {
    }

    ConsoleGamer &operator=(const ConsoleGamer &cg) {
        if (this != &cg) {
            Gamer::operator=(cg);
            isProPlayer = cg.isProPlayer;
        }
        return *this;
    }

    ~ConsoleGamer() override {
    }

    const char *calculateSkillLevel() const override {
        return isProPlayer ? "Pro ConsoleGamer" : "Casual ConsoleGamer";
    }

    void printInfo() const override {
        cout << "ConsoleGamer: " << username << ", Hours Per Week: " << hoursPerWeek << "h, Skill Level: " <<
                calculateSkillLevel() << endl;
    }
};

void printGamersThatPlayGame(Gamer *gamers[], int n, const Game &game) {
    int totalHours = 0, count = 0;
    for (int i = 0; i < n; ++i) {
        if (gamers[i]->playsGame(game)) {
            totalHours += gamers[i]->getHoursPerWeek();
            ++count;
        }
    }
    if (count == 0) return;
    double avg = totalHours / (double) count;

    cout << "Top Gamers that play " << game.getName() << ":" << endl;
    for (int i = 0; i < n; ++i) {
        if (gamers[i]->playsGame(game) && gamers[i]->getHoursPerWeek() > avg) {
            gamers[i]->printInfo();
        }
    }
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    Gamer *gamers[n];

    for (int i = 0; i < n; ++i) {
        char username[30];
        char gameName[50];
        int numGames, hoursPerWeek, streamHours, isProPlayer;

        cin.getline(username, 30);
        cin >> numGames;
        cin.ignore();

        Game games[50];
        for (int j = 0; j < numGames; ++j) {
            cin.getline(gameName, 50);
            games[j] = Game(gameName);
        }

        cin >> hoursPerWeek;
        cin.ignore();

        if (i % 2 == 0) {
            cin >> streamHours;
            cin.ignore();
            gamers[i] = new PCGamer(username, games, numGames, hoursPerWeek, streamHours);
        } else {
            cin >> isProPlayer;
            cin.ignore();
            gamers[i] = new ConsoleGamer(username, games, numGames, hoursPerWeek, isProPlayer);
        }
    }

    char gameQuery[50];
    cin.getline(gameQuery, 50);
    printGamersThatPlayGame(gamers, n, Game(gameQuery));

    for (int i = 0; i < n; ++i) {
        delete gamers[i];
    }

    return 0;
}
