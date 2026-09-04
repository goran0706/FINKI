// Дадена е класа Project, во која се чува кодот на проектот и времетраење (во месеци), со соодветен конструктор и метода за печатење.
//
// Да се дефинира класа TeamProject која наследува од класата Project и која вклучува целобројна променлива за големината на тимот.
// Големината на тимот мора да е вредност поголема од 0 и помала од 10,  во спротивно големината поставете ја на 5.
//
// За класата TeamProject да се дефинира
//
// соодветен конструктор
// метод int calculateTotalTeamHours() со којшто се пресметува  бројот на тимски часови врз основа на времетраењето
// на проектот  и големината на тимот (времетраење + големина_на_тим * 160)
// метод void showInfo(), којшто го печати кодот на проектот и големина на тимот

#include <iostream>

using namespace std;

class Project {
protected:
    string name;
    int duration;

public:
    Project(string name = "Project1", int duration = 2) : name(name), duration(duration) {
    }

    ~Project() {
    }

    void showInfo() {
        cout << name << " " << duration << " ";
    }
};

class TeamProject : public Project {
private:
    int golemina;

public:
    explicit TeamProject(string name = "Project1", int duration = 2, int golemina = 0) : Project(name, duration) {
        if (golemina > 0 && golemina < 10) {
            this->golemina = golemina;
        } else {
            this->golemina = 5;
        }
    }

    int calculateTotalTeamHours() {
        return duration + golemina * 160;
    }

    void showInfo() {
        cout << name << " " << duration << " " << golemina << endl;
    }
};

TeamProject *createTeamProjects(int n) {
    TeamProject *teamProjects = new TeamProject[n];
    string name;
    int duration, teamSize;
    for (int i = 0; i < n; i++) {
        cin >> name >> duration >> teamSize;
        teamProjects[i] = TeamProject(name, duration, teamSize);
    }
    return teamProjects;
}


int main() {
    int testCase;
    cin >> testCase;

    switch (testCase) {
        case 1: {
            TeamProject teamProject;
            teamProject.showInfo();
            break;
        }
        case 2: {
            TeamProject teamProject("CS101", 5, 3);
            teamProject.showInfo();
            TeamProject teamProject1("CS102", 7, 2);
            teamProject1.showInfo();
            break;
        }
        case 3: {
            TeamProject teamProject("CS101", 5, 13);
            teamProject.showInfo();
            TeamProject teamProject1("CS102", 7, 0);
            teamProject1.showInfo();
            break;
        }
        case 4: {
            TeamProject teamProject("CS101", 4, 1);
            cout << teamProject.calculateTotalTeamHours();
            break;
        }
        case 5: {
            int n;
            cin >> n;
            TeamProject *teamProjects = createTeamProjects(n);
            for (int i = 0; i < n; i++) {
                teamProjects[i].showInfo();
            }
            delete [] teamProjects;
            break;
        }
        default: {
            int n;
            cin >> n;
            TeamProject *teamProjects = createTeamProjects(n);
            for (int i = 0; i < n; i++) {
                teamProjects[i].showInfo();
            }
            for (int i = 0; i < n; i++) {
                cout << teamProjects[i].calculateTotalTeamHours() << endl;
            }
            delete [] teamProjects;
            break;
        }
    }
}
