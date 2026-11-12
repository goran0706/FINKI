#include <iostream>
#include <cstring>
using namespace std;

struct SkiLift {
    char name[15];
    int n;
    bool InFunction;
};

struct SkiCenter {
    char name[20];
    char country[20];
    SkiLift array[20];
    int n;

    int Capacity() {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            if (array[i].InFunction) {
                sum = sum + array[i].n;
            }
        }
        return sum;
    }
};

void biggestCapacity(SkiCenter *sc, int n) {
    int max = 0;
    int index = 0;
    for (int i = 0; i < n; i++) {
        if (sc[i].Capacity() > max) {
            max = sc[i].Capacity();
            index = i;
        }
        if (sc[i].Capacity() == max) {
            if (sc[index].n < sc[i].n) {
                index = i;
            }
        }
    }
    cout << sc[index].name << endl;
    cout << sc[index].country << endl;
    cout << sc[index].Capacity() << endl;
}

int main() {
    int n;
    cin >> n;

    SkiCenter sc[n];

    for (int i = 0; i < n; i++) {
        cin >> sc[i].name >> sc[i].country >> sc[i].n;
        for (int j = 0; j < sc[i].n; j++) {
            cin >> sc[i].array[j].name;
            cin >> sc[i].array[j].n;
            cin >> sc[i].array[j].InFunction;
        }
    }

    biggestCapacity(sc, n);

    return 0;
}
