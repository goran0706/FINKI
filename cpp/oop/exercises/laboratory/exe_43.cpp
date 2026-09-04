// Да се креира класа за претставување на планинарско друштво во која ќе се чуваат информации за
//      името на друштвото (динамички алоцирана низа од знаци),
//      број на поминати тури (цел број) и
//      број на членови во планинарското друштво (цел број).
//
// За оваа класа да се напише:
//      оператор + за собирање на две друштва што како резултат враќа друштво со број на членови еднаков на збирот од членовите од двете друштва,
//      а останатите атрибути на резултантното друштво ги добиваат вредностите на соодветните атрибути од друштвото со поголем број на членови
//      оператори >, < за споредба во однос на бројот на членови во планинарските друштва
//      оператор << за печатење на информациите за планинарското друштво
//
// Да се напише функција што на влез прима низа од планинарски друштва и вкупен број на друштва во низата и
// го печати планинарското друштво што има најголем број на членови .

#include <iostream>
#include <cstring>
using namespace std;

class PlDrustvo {
private:
    char *name;
    int toursCount;
    int membersCount;

public:
    PlDrustvo(const char *name = "", const int tours = 0, const int membersCount = 0) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        this->toursCount = tours;
        this->membersCount = membersCount;
    }

    PlDrustvo &operator+(const PlDrustvo &other) const {
        const int totalMembers = membersCount + other.membersCount;
        const auto tmp = new PlDrustvo(name, toursCount, totalMembers);
        if (membersCount < other.membersCount) {
            tmp->name = other.name;
            tmp->toursCount = other.toursCount;
        }

        return *tmp;
    }

    [[nodiscard]] char *getName() const {
        return name;
    }

    [[nodiscard]] int getToursCount() const {
        return toursCount;
    }

    [[nodiscard]] int getMembersCount() const {
        return membersCount;
    }

    bool operator<(const PlDrustvo &other) const {
        return membersCount < other.membersCount;
    }

    bool operator>(const PlDrustvo &other) const {
        return membersCount > other.membersCount;
    }

    friend ostream &operator<<(ostream &out, const PlDrustvo &pd) {
        out << "Ime: " << pd.name << " Turi: " << pd.toursCount << " Clenovi: " << pd.membersCount;
        return out;
    }
};


PlDrustvo findMostMembers(const PlDrustvo *arr, const int n) {
    PlDrustvo largest = arr[0];
    for (int i = 0; i < n; i++) {
        if (largest.getMembersCount() < arr[i].getMembersCount()) {
            largest = arr[i];
        }
    }
    return largest;
}

void print(const PlDrustvo &pd) {
    cout << "Najmnogu clenovi ima planinarskoto drustvo: " << pd;
}

void najmnoguClenovi(const PlDrustvo *arr, const int n) {
    print(findMostMembers(arr, n));
}

int main() {
    PlDrustvo drustva[3];
    PlDrustvo pl;

    for (int i = 0; i < 3; i++) {
        char ime[100];
        int brTuri;
        int brClenovi;
        cin >> ime;
        cin >> brTuri;
        cin >> brClenovi;
        PlDrustvo p(ime, brTuri, brClenovi);
        drustva[i] = p;
    }

    pl = drustva[0] + drustva[1];
    cout << pl;

    // najmnoguClenovi(drustva, 3);
}
