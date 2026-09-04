// Во рамките на една видео игра се чуваат податоци за кориснички профили (UserProfile) и нивните достигнувања во играта (Achievement).
// Вие треба да ги дефинирате класите и функциите за коректна имплементација на системот. Не го менувајте дадениот код.
//
// За таа цел, дефинирајте класа Achievement со приватни податочни членки:
//
// name - име на достигнувањето (низа од знаци);
// description - опис на достигнувањето (низа од знаци);
// totalUserAchievements - вкупен број на достигнувања на сите кориснички профили (static int).
// Дополнете ја класата со default конструктор, конструктор со аргументи и copy конструктор како и следните функции:
//
// print - функција која ги печати името и описот на достигнувањето во нов ред;
// incrementTotalUserAchievements - функција која ја зголемува вредноста на totalUserAchievements за 1.
// Потребно е да работите без get/set методи.
//
// Понатаму, дефинирајте класа UserProfile со приватни податочни членки:
//
// name - име на профилот (низа од знаци);
// achievements - низа од добиени достигнувања на корисникот за дадената игра (максимална големина е 50);
// n - број на добиени достигнувања на корисникот за дадената игра (иницијално поставен на 0).
// Дополнете ја класата со default конструктор и конструктор со аргумент name.
//
// Напишете ги функциите:
//
// print - функција која го печати името на корисникот и неговите добиени достигнувања во играта во формат даден во тест примерите.
// void addAchievement(const Achievement& achievement) - функција која во низата од достигнувања achievements
// го додава достигнувањето achievement и ја зголемува вредноста на totalUserAchievements.
// На крај, да се напише функција void showAchievementsProgress(UserProfile profiles[], int n, Achievement achievements[], int m)
// која директно пристапува до приватните членки на класите Achievement и UserProfile, и за секое достигнување во играта
// на екран ќе ги испечати името и описот на достигнувањето, како и процентот на корисници кои го добиле тоа достигнување.
// На крај да се испечати просечниот број на добиени достигнувања со формулата totalUserAchievements * 100.0 / (n * m).
// Форматот на печатењето е даден во тест примерите.

#include <iostream>
#include <cstring>
using namespace std;

// TODO: Implement 'Achievement' and 'UserProfile' classes
class Achievement {
private:
    char name[100];
    char description[100];
    static int totalUserAchievements;

public:
    Achievement() {
    }

    Achievement(char *name, char *description) {
        strcpy(this->name, name);
        strcpy(this->description, description);
    }

    Achievement(const Achievement &a) {
        strcpy(this->name, a.name);
        strcpy(this->description, a.description);
    }

    void print() {
        cout << name << endl;
        cout << description << endl;
    }

    static void incrementTotalUserAchievements() {
        Achievement::totalUserAchievements++;
    }

    friend class UserProfile;

    const char *getName() const {
        return name;
    }

    const char *getDescription() const {
        return description;
    }

    static int getTotalUserAchievements() {
        return totalUserAchievements;
    }
};

int Achievement::totalUserAchievements;

class UserProfile {
private:
    char name[100];
    Achievement achievements[50];
    int n;

public:
    UserProfile() {
    }

    UserProfile(char *name) {
        strcpy(this->name, name);
        n = 0;
    }

    void print() {
        cout << "User: " << name << endl;
        cout << "Achievements: " << endl;
        for (int i = 0; i < n; ++i) {
            achievements[i].print();
        }
    }

    void addAchievement(const Achievement &achievement) {
        achievements[n] = achievement;
        n++;
        Achievement::incrementTotalUserAchievements();
    }

    friend class Achievement;

    friend void showAchievementsProgress(UserProfile profiles[], int n, Achievement achievements[], int m);
};

// TODO: Implement showAchievementsProgress function

void showAchievementsProgress(UserProfile profiles[], int n, Achievement achievements[], int m) {
    for (int i = 0; i < m; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < profiles[j].n; k++) {
                if (strcmp(profiles[j].achievements[k].getName(), achievements[i].getName()) == 0) {
                    count++;
                    break;
                }
            }
        }
        cout << achievements[i].getName() << "\n" << achievements[i].getDescription() << endl;
        cout << "---Percentage of users who have this achievement: " << (count * 100.0 / n) << "%" << endl;
    }
    cout << "------Average completion rate of the game: " << (Achievement::getTotalUserAchievements() * 100.0 / (n * m))
            << "%" << endl;
}

// Don't modify
int main() {
    char testcase[100];
    cin.getline(testcase, 100);

    int n;
    cin >> n;
    cin.ignore();

    char ignore[100];
    cin.getline(ignore, 100);
    UserProfile users[100];
    for (int i = 0; i < n; ++i) {
        char name[100];
        cin >> name;
        users[i] = UserProfile(name);
    }

    int m;
    cin >> m;
    cin.ignore();

    cin.getline(ignore, 100);
    Achievement achievements[100];
    for (int i = 0; i < m; ++i) {
        char name[100], description[100];
        cin.getline(name, 100);
        cin.getline(description, 100);
        achievements[i] = Achievement(name, description);
    }

    int k;
    cin >> k;
    cin.ignore();

    cin.getline(ignore, 100);
    for (int i = 0; i < k; ++i) {
        int numUser, numAchievement;
        cin >> numUser >> numAchievement;
        numUser -= 1;
        numAchievement -= 1;
        users[numUser].addAchievement(achievements[numAchievement]);
    }

    if (testcase[8] == 'A') {
        // Testing Achievement methods.
        for (int i = 0; i < m; ++i) {
            achievements[i].print();
        }
        Achievement::incrementTotalUserAchievements();
    } else if (testcase[8] == 'U') {
        // Testing UserProfile methods.
        for (int i = 0; i < n; ++i) {
            users[i].print();
        }
    } else {
        // Testing showAchievementsProgress function.
        showAchievementsProgress(users, n, achievements, m);
    }

    return 0;
}
