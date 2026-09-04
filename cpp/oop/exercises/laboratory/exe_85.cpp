// Да се дефинира класа MountainTrail за која се чуваат следните податоци:
//
// name - име на патеката, низа од карактери
// length - должина на патеката во километри, цел број
// slope - наклон на патеката изразен во проценти, double
//
// За класата да се дефинира default конструктор, конструктор со аргументи и copy конструктор.
// За класата да се дефинира метод double difficulty() кој ја пресметува тежината на патеката по следната формула: должина * наклон / 100.
// Да се дефинира и метод void display() кој ги печати податоците за патеката во следниот формат: [име] [должина] [наклон].
//
// Потоа да се дефинира класа Mountain за која се чува:
// name - име на планината, низа од карактери
// trails - низа од 5 патеки кои се наоѓаат на планината
// peak_elevation - надморска височина на врвот, цел број
// num_mountains - бр. на планини за кои водиме сметка во програмата (вредноста на ова поле треба да биде иста во сите објекти, треба да има и get метод)
//
// За класата да се дефинира  default конструктор, конструктор со аргументи, како и деструктор.
// Потребно е секој од овие методи да го ажурира вкупниот број на планини.
//
// Во класата да се дефинира метод display() кој ќе печати податоци за планината во следниот формат: [име]: [н.в. на врвот]m
//
// Надвор од класата да се дефинира метод void sortMountainsByPeakElevation(Mountain mountains[], int n) кој прима низа од планини и
// ги печати во опаѓачки редослед според надморската висина на нивниот врв.
// Овој метод мора да пристапува директно до приватното поле за надморска висина.
#include<iostream>
#include "cstring"
using namespace std;

class MountainTrail {
private:
    char name[100];
    int lenght;
    double slope;

public:
    MountainTrail() {
    }

    MountainTrail(char *name, int lenght, double slope) {
        strcpy(this->name, name);
        this->lenght = lenght;
        this->slope = slope;
    }

    MountainTrail(const MountainTrail &m) {
        strcpy(this->name, m.name);
        this->lenght = m.lenght;
        this->slope = m.slope;
    }

    double difficulty() {
        return lenght * slope / 100;
    }

    void display() {
        cout << name << " " << lenght << " " << slope << endl;
    }
};

class Mountain {
private:
    char name[100];
    MountainTrail trails[5];
    int peak_elevation;
    static int num_mountains;

public:
    Mountain() {
    }

    Mountain(char *name, MountainTrail *trails, int peakElevation) {
        strcpy(this->name, name);
        for (int i = 0; i < 5; ++i) {
            this->trails[i] = trails[i];
        }
        this->peak_elevation = peakElevation;
        num_mountains++;
    }

    ~Mountain() {
        num_mountains--;
    }

    void display() {
        cout << name << ": " << peak_elevation << "m" << endl;
    }

    static int getNumMountains() {
        return num_mountains;
    }

    int getPeakElevation() const {
        return peak_elevation;
    }
};

void sortMountainsByPeakElevation(Mountain mountains[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (mountains[j].getPeakElevation() < mountains[j + 1].getPeakElevation()) {
                Mountain tmp = mountains[j];
                mountains[j] = mountains[j + 1];
                mountains[j + 1] = tmp;
            }
        }
    }
    for (int i = 0; i < n; ++i) {
        mountains[i].display();
    }
}

/*
 *  DO NOT CHANGE ANY OF THE FOLLOWING CODE
 */
int Mountain::num_mountains = 0;

int main() {
    int test_case_n;

    char trail_name[100];
    int trail_length;
    double trail_slope;

    char mountain_name[100];
    int mountain_peak_elevation;

    cin >> test_case_n;
    if (test_case_n == 0) {
        cout << "Testing MountainTrail c-tors, display function:" << endl;
        cin >> trail_name >> trail_length >> trail_slope;
        MountainTrail mt = MountainTrail(trail_name, trail_length, trail_slope);
        MountainTrail mt2 = MountainTrail(mt);
        mt.display();
        mt2.display();
    } else if (test_case_n == 1) {
        cout << "Testing MountainTrail difficulty function:" << endl;
        for (int i = 0; i < 5; ++i) {
            cin >> trail_name >> trail_length >> trail_slope;
            MountainTrail mt = MountainTrail(trail_name, trail_length, trail_slope);
            cout << mt.difficulty() << endl;
        }
    } else if (test_case_n == 2) {
        cout << "Testing Mountain c-tor, display function:" << endl;
        MountainTrail trails[5];

        cin >> mountain_name >> mountain_peak_elevation;

        for (int i = 0; i < 5; ++i) {
            cin >> trail_name >> trail_length >> trail_slope;
            trails[i] = MountainTrail(trail_name, trail_length, trail_slope);
        }

        Mountain mountain = Mountain(mountain_name, trails, mountain_peak_elevation);
        mountain.display();
    } else if (test_case_n == 3) {
        cout << "Testing static field in Mountain:" << endl;
        MountainTrail trails[5];

        cin >> mountain_name >> mountain_peak_elevation;

        for (int i = 0; i < 5; ++i) {
            cin >> trail_name >> trail_length >> trail_slope;
            trails[i] = MountainTrail(trail_name, trail_length, trail_slope);
        }

        for (int i = 0; i < 10; ++i) {
            Mountain mountain = Mountain(mountain_name, trails, mountain_peak_elevation);
        }

        Mountain m1 = Mountain(mountain_name, trails, mountain_peak_elevation);
        Mountain m2 = Mountain(mountain_name, trails, mountain_peak_elevation);
        Mountain m3 = Mountain(mountain_name, trails, mountain_peak_elevation);
        Mountain m4 = Mountain(mountain_name, trails, mountain_peak_elevation);
        Mountain m5 = Mountain(mountain_name, trails, mountain_peak_elevation);

        if (Mountain::getNumMountains() == 5) {
            cout << "OK";
        } else {
            cout << "Missing mountain count increment/decrement";
        }
    } else if (test_case_n == 4) {
        int M;
        cin >> M;
        cout << "Testing order function:" << endl;

        Mountain mountains[M];

        for (int i = 0; i < M; ++i) {
            cin >> mountain_name >> mountain_peak_elevation;
            MountainTrail trails[5];

            for (int j = 0; j < 5; ++j) {
                cin >> trail_name >> trail_length >> trail_slope;
                trails[j] = MountainTrail(trail_name, trail_length, trail_slope);
            }

            mountains[i] = Mountain(mountain_name, trails, mountain_peak_elevation);
        }

        sortMountainsByPeakElevation(mountains, M);
    }
}
