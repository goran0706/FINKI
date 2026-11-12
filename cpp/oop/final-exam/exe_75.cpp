#include <iostream>
using namespace std;

struct Player {
    char name[15];
    int level;
    int points;
};

struct ComputerGame {
    char name[20];
    Player array[30];
    int n;
};

void bestPlayer(ComputerGame *array, int n) {
    int mostPopularGame = 0;
    int maxPlayers = 0;
    for (int i = 0; i < n; i++) {
        if (array[i].n > maxPlayers) {
            maxPlayers = array[i].n;
            mostPopularGame = i;
        }
    }
    int maxPoints = 0;
    int index = 0;
    for (int i = 0; i < array[mostPopularGame].n; i++) {
        if (array[mostPopularGame].array[i].points > maxPoints) {
            maxPoints = array[mostPopularGame].array[i].points;
            index = i;
        }
        if (array[mostPopularGame].array[i].points == maxPoints) {
            if (array[mostPopularGame].array[i].level > array[mostPopularGame].array[index].level) {
                index = i;
            }
        }
    }
    //cout<<"The best player "<<array[mostPopularGame].array[index].name<<" plays the game "<<array[mostPopularGame].name<<endl;
    cout << "Najdobar igrac e igracot so korisnicko ime " << array[mostPopularGame].array[index].name <<
            " koj ja igra igrata " << array[mostPopularGame].name << endl;
}

int main() {
    int n;
    cin >> n;

    ComputerGame array[n];

    for (int i = 0; i < n; i++) {
        cin >> array[i].name;
        cin >> array[i].n;
        for (int j = 0; j < array[i].n; j++) {
            cin >> array[i].array[j].name;
            cin >> array[i].array[j].level;
            cin >> array[i].array[j].points;
        }
    }

    bestPlayer(array, n);

    return 0;
}
