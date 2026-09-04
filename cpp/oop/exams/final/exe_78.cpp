#include <iostream>
using namespace std;

struct Driver {
    char name[100];
    int time;
};

struct Race {
    char location[100];
    int number;
    Driver array[100];
};

void TransformTime(int time) {
    int seconds = time % 60;
    int minutes = time / 60;
    cout << (minutes < 10 ? " " : "") << minutes << ":" << (seconds < 10 ? "0" : "") << seconds << endl;
}

void print(Race *r, int n) {
    for (int i = 0; i < n; i++) {
        cout << r[i].location << " (" << r[i].number << " Drivers)" << endl;
        for (int j = 0; j < r[i].number; j++) {
            for (int k = j + 1; k < r[i].number; k++) {
                if (r[i].array[j].time > r[i].array[k].time) {
                    Driver temp = r[i].array[j];
                    r[i].array[j] = r[i].array[k];
                    r[i].array[k] = temp;
                }
            }
        }
        cout << "1. " << r[i].array[0].name << " ";
        TransformTime(r[i].array[0].time);
        cout << "2. " << r[i].array[1].name << " ";
        TransformTime(r[i].array[1].time);
        cout << "3. " << r[i].array[2].name << " ";
        TransformTime(r[i].array[2].time);
    }
}

int main() {
    int n;
    cin >> n;

    Race array[n];

    for (int i = 0; i < n; i++) {
        cin >> array[i].location;
        cin >> array[i].number;
        for (int j = 0; j < array[i].number; j++) {
            cin >> array[i].array[j].name;
            cin >> array[i].array[j].time;
        }
    }

    print(array, n);

    return 0;
}
