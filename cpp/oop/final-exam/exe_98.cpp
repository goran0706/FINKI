#include <iostream>
using namespace std;

struct RabotnaNedela {
    int day1, day2, day3, day4, day5;

    int Hours() {
        return day1 + day2 + day3 + day4 + day5;
    }
};

struct Rabotnik {
    char name[50];
    RabotnaNedela rabotna[4];
};

int maxNedela(Rabotnik r) {
    int max = 0, index = 0;
    for (int i = 0; i < 4; i++) {
        if (r.rabotna[i].Hours() > max) {
            max = r.rabotna[i].Hours();
            index = i;
        }
    }
    return index;
}

void table(Rabotnik *r, int n) {
    cout << "TABLE" << endl;
    cout << "Wor\t" << "1\t" << "2\t" << "3\t" << "4\t" << "Total" << endl;
    for (int i = 0; i < n; i++) {
        int ned1, ned2, ned3, ned4;
        ned1 = r[i].rabotna[0].Hours();
        ned2 = r[i].rabotna[1].Hours();
        ned3 = r[i].rabotna[2].Hours();
        ned4 = r[i].rabotna[3].Hours();
        int vkupno = ned1 + ned2 + ned3 + ned4;
        cout << r[i].name << "\t" << ned1 << "\t" << ned2 << "\t" << ned3 << "\t" << ned4 << "\t" << vkupno << endl;
    }
}

int main() {
    int n;
    cin >> n;

    Rabotnik r[n];

    for (int i = 0; i < n; i++) {
        cin >> r[i].name;
        for (int j = 0; j < 4; j++) {
            cin >> r[i].rabotna[j].day1;
            cin >> r[i].rabotna[j].day2;
            cin >> r[i].rabotna[j].day3;
            cin >> r[i].rabotna[j].day4;
            cin >> r[i].rabotna[j].day5;
        }
    }

    table(r, n);

    cout << "MAX WEEK OF WORKER: " << r[n / 2].name << endl;

    cout << maxNedela(r[n / 2]) + 1;

    // char name[20];
    // cin>>name;
    // for (int i=0; i<n; i++) {
    //     if (strcmp(r[i].name, name) == 0) {
    //         cout<<maxNedela(r[i])+1;
    //     }
    // }
    return 0;
}
