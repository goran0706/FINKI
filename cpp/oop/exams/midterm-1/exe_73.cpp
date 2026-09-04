#include <iostream>
using namespace std;

struct Igrac {
    char Username[15];
    int level;
    int points;
};

struct KompjuterskaIgra {
    char name[20];
    Igrac array[30];
    int n;
};

void najdobarIgrac(KompjuterskaIgra *lista, int n) {
    int max = 0, index = 0;
    for (int i = 0; i < n; i++) {
        if (lista[i].n > max) {
            max = lista[i].n;
            index = i;
        }
    }
    int maxPoints = 0, index2 = 0;
    for (int i = 0; i < lista[index].n; i++) {
        if (lista[index].array[i].points > maxPoints) {
            maxPoints = lista[index].array[i].points;
            index2 = i;
        }
        if (lista[index].array[i].points == maxPoints) {
            if (lista[index].array[i].level > lista[index].array[index2].level) {
                index2 = i;
            }
        }
    }
    cout << "Najdobar igrac e igracot so korisnicko ime " << lista[index].array[index2].Username <<
            " koj ja igra igrata " << lista[index].name << endl;;
}

int main() {
    int n;
    cin >> n;

    KompjuterskaIgra lista[n];

    for (int i = 0; i < n; i++) {
        cin >> lista[i].name;
        cin >> lista[i].n;
        for (int j = 0; j < lista[i].n; j++) {
            cin >> lista[i].array[j].Username;
            cin >> lista[i].array[j].level;
            cin >> lista[i].array[j].points;
        }
    }

    najdobarIgrac(lista, n);

    return 0;
}
