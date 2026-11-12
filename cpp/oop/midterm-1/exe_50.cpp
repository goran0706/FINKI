#include "iostream"
using namespace std;

struct Laptop {
    char firma[100];
    float monitor;
    bool touch;
    int cena;

    void print() {
        cout << firma << " " << monitor << " " << cena << endl;
    }
};

struct ITStore {
    char ime[100];
    char lokacija[100];
    Laptop laptopi[100];
    int brLaptopi;

    void print() {
        cout << ime << " " << lokacija << endl;
        for (int i = 0; i < brLaptopi; ++i) {
            laptopi[i].print();
        }
    }
};

int najniska(ITStore s) {
    int min = INT_MAX;
    for (int i = 0; i < s.brLaptopi; ++i) {
        if (s.laptopi[i].touch == true && min > s.laptopi[i].cena) {
            min = s.laptopi[i].cena;
        }
    }
    return min;
}

void najeftina_ponuda(ITStore niza[], int n) {
    int min = najniska(niza[0]);
    int index = 0;
    for (int i = 0; i < n; ++i) {
        if (najniska(niza[i]) < min) {
            min = najniska(niza[i]);
            index = i;
        }
    }
    cout << "Najeftina ponuda ima prodavnicata: " << endl << niza[index].ime << " " << niza[index].lokacija << endl;
    cout << "Najniskata cena iznesuva: " << najniska(niza[index]) << endl;


    //    for (int i = 0; i < n; ++i) {
    //        for (int j = 0; j < niza[i].brLaptopi; ++j) {
    //            if (niza[i].laptopi[j].touch == 1){
    //                if (min > niza[i].laptopi[j].cena || min == -1){
    //                    min = niza[i].laptopi[j].cena;
    //                    index = i;
    //                }
    //            }
    //
    //        }
    //    }
}

int main() {
    int n;
    cin >> n;
    ITStore s[100];
    for (int i = 0; i < n; ++i) {
        cin >> s[i].ime;
        cin >> s[i].lokacija;
        cin >> s[i].brLaptopi;
        for (int j = 0; j < s[i].brLaptopi; ++j) {
            cin >> s[i].laptopi[j].firma;
            cin >> s[i].laptopi[j].monitor;
            cin >> s[i].laptopi[j].touch;
            cin >> s[i].laptopi[j].cena;
        }
    }
    for (int i = 0; i < n; ++i) {
        s[i].print();
    }
    najeftina_ponuda(s, n);

    return 0;
}
