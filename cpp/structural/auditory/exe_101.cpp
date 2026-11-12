// Да се напише програма која ќе ја отпечати поднизата на дадена текстуална низа (што се внесува од тастатура)
// определена со позицијата и должината, што како параметри се внесуваат од тастатура.
// Поднизата започнува од знакот што се наоѓа на соодветната позиција во текстуалната низа, броејќи од лево.

#include <iostream>
using namespace std;

void print_substr(const char *str, const int start, const int end) {
    if (start < end) {
        cout << "Invalid parameters" << endl;
    }
    for (int i = start; i < start + end; i++) {
        cout << str[i];
    }
    cout << endl;
}

int main() {
    char str[51];
    cin.getline(str, 50);
    str[50] = '\0';

    int start, end;
    cin >> start >> end;

    print_substr(str, start, end);

    return 0;
}
