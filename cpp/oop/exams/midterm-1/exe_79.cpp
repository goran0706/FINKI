#include <iostream>
using namespace std;

struct RabotnaNedela {
    int week;
    int hours[5];

    int total() {
        int sum = 0;
        for (int i = 0; i < 5; i++) {
            sum += hours[i];
        }
        return sum;
    }
};

struct Rabotnik {
    char name[50];
    RabotnaNedela rab[4];

    int total() {
        int sum = 0;
        for (int i = 0; i < 4; i++) {
            sum += rab[i].total();
        }
        return sum;
    }
};

int maxNedela(Rabotnik r) {
    int max = 0, index = 0;
    for (int i = 0; i < 4; i++) {
        if (r.rab[i].total() > max) {
            max = r.rab[i].total();
            index = i;
        }
    }
    return index;
}

void table(Rabotnik *r, int n) {
    cout << "TABLE" << endl;
    cout << "Rab\t" << "1\t" << "2\t" << "3\t" << "4\t" << "Vkupno" << endl;
    for (int i = 0; i < n; i++) {
        cout << r[i].name << "\t" << r[i].rab[0].total() << "\t" << r[i].rab[1].total() << "\t" << r[i].rab[2].total()
                << "\t" << r[i].rab[3].total() << "\t" << r[i].total() << endl;
    }
}

int main() {
    int n;
    cin >> n;
    Rabotnik r[n];
    for (int i = 0; i < n; i++) {
        cin >> r[i].name;
        for (int j = 0; j < 4; j++) {
            cin >> r[i].rab[j].hours[0];
            cin >> r[i].rab[j].hours[1];
            cin >> r[i].rab[j].hours[2];
            cin >> r[i].rab[j].hours[3];
            cin >> r[i].rab[j].hours[4];
        }
    }

    table(r, n);
    cout << "MAX NEDELA NA RABOTNIK: " << r[n / 2].name << endl;

    cout << maxNedela(r[n / 2]) + 1;
    return 0;
}

// 5
// Brianna
// 35 33 42 42 40
// 31 57 52 54 44
// 56 32 51 52 35
// 43 39 34 54 55
