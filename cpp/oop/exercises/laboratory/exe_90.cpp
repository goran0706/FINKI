#include <iostream>
#include <cstring>

using namespace std;

enum tip {
    Success,
    Partial,
    Failure
};

class Satelit {
private:
    char ime[50];
    char operatorcountry[50];

public:
    Satelit(char *_ime = "ime", char *_operatorcountry = "233") {
        strcpy(ime, _ime);
        strcpy(operatorcountry, _operatorcountry);
    }

    void print() {
        cout << ime << " " << "(" << operatorcountry << ")" << endl;
    }
};

class Misija {
private:
    Satelit satelit;
    char datum[10];
    int data;
    tip t;

public:
    Misija(Satelit satelit = Satelit(), char *_datum = "30.04.2005", int _data = 20, tip ti = Success) {
        this->satelit = satelit;
        strcpy(datum, _datum);
        data = _data;
        t = ti;
    }

    void print() {
        cout << "Mission date: " << datum << endl;
        cout << "Mission details:" << endl;
        satelit.print();
        cout << "Data: " << data << "TB" << endl;
        cout << "tip ";
        if (t == Success) {
            cout << "Success" << endl;
        }
        if (t == Partial) {
            cout << "Partial" << endl;
        }
        if (t == Failure) {
            cout << "Failure" << endl;
        }
    }
};

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char ime2[50];
    char drzava[50];
    char datum[11];
    int data;
    int tip1;

    Misija misii[100];

    for (int i = 0; i < n; i++) {
        cin.getline(datum, 11);
        cin.getline(ime2, 50);
        cin.getline(drzava, 50);
        cin >> data;
        cin >> tip1;
        cin.ignore();
        Satelit sc(ime2, drzava);
        misii[i] = Misija(sc, datum, data, (tip) tip1);
    }
    for (int i = 0; i < n; i++) {
        misii[i].print();
        cout << endl;
    }
    return 0;
}
