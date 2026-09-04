#include <iostream>
using namespace std;

class Project {
protected:
    string code;
    int time;

public:
    Project(const string &code = "Project1", const int time = 2) {
        this->code = code;
        this->time = time;
    }

    Project(const Project &other) {
        this->code = other.code;
        this->time = other.time;
    }

    Project &operator=(const Project &other) {
        if (this != &other) {
            this->code = other.code;
            this->time = other.time;
        }
        return *this;
    }

    ~Project() {
    }

    void print() {
        cout << code << " " << time;
    }
};

class TeamProject : public Project {
private:
    int size;

public:
    TeamProject(const string &code = "Project1", const int time = 2, const int size = 5) : Project(code, time) {
        if (size > 0 && size < 10) {
            this->size = size;
        } else {
            this->size = 5;
        }
    }

    TeamProject(const TeamProject &other) {
        this->code = other.code;
        this->time = other.time;
        this->size = other.size;
    }

    TeamProject &operator=(const TeamProject &other) {
        if (this != &other) {
            this->code = other.code;
            this->time = other.time;
            this->size = other.size;
        }
        return *this;
    }

    ~TeamProject() {
    }

    int calculateTotalTeamHours() {
        return time + size * 160;
    }

    void showInfo() {
        cout << code << " " << time << " " << size << endl;
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
    return 0;
}
