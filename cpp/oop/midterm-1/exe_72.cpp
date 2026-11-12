#include <iostream>
using namespace std;

struct Laptop {
    char manufacturer[100];
    float size;
    bool touchScreen;
    int Price;
};

struct ITStore {
    char StoreName[100];
    char Location[100];
    Laptop array[100];
    int n;
};

void print(ITStore *s, int n) {
    for (int i = 0; i < n; i++) {
        cout << s[i].StoreName << " " << s[i].Location << endl;
        for (int j = 0; j < s[i].n; j++) {
            cout << s[i].array[j].manufacturer << " " << s[i].array[j].size << " " << s[i].array[j].Price << endl;
        }
    }
}

void najeftina_ponuda(ITStore *s, int n) {
    int min = 1000000;
    int index = 0;
    int index2 = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < s[i].n; j++) {
            if (s[i].array[j].Price < min && s[i].array[j].touchScreen == 1) {
                min = s[i].array[j].Price;
                index = j;
                index2 = i;
            }
        }
    }
    cout << "Najeftina ponuda ima prodavnicata: " << endl;
    cout << s[index2].StoreName << " " << s[index2].Location << endl;
    cout << "Najniskata cena iznesuva: " << s[index2].array[index].Price << endl;
}

int main() {
    int n;
    cin >> n;

    ITStore s[n];

    for (int i = 0; i < n; i++) {
        cin >> s[i].StoreName;
        cin >> s[i].Location;
        cin >> s[i].n;

        for (int j = 0; j < s[i].n; j++) {
            cin >> s[i].array[j].manufacturer;
            cin >> s[i].array[j].size;
            cin >> s[i].array[j].touchScreen;
            cin >> s[i].array[j].Price;
        }
    }

    print(s, n);

    najeftina_ponuda(s, n);
    return 0;
}
