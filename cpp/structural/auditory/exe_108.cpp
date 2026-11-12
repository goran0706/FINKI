// Да се напише програма во која од стандарден влез прво се внесува еден позитивен цел број z,
// а потоа последователно се внесуваат парови цели броеви (a, b).
//
// Внесувањето на парови цели броеви треба да заврши кога корисникот ќе го внесе парот (0, 0).
//
// Треба да се пресмета колку пати z е еднаков на збирот на секој внесен пар броеви a и b,
// како и колкав процент од вкупниот број внесени парови (a, b) даваат збир z
//
// (ЗАБЕЛЕШКА: парот (0, 0) не се зема во предвид при извршувањето на пресметките!).
// Input:
// 100
// 50 50
// -50 -50
// -99 199
// 32 98
// 0 0
//
// Output:
// Vnesovte 2 parovi od broevi chij zbir e 100
// Procentot na parovi so zbir 100 e 50%

#include <iostream>
using namespace std;

int main() {
    int a, b, z;
    cin >> z;

    int eq_count = 0;
    int entries_count = 0;

    while (cin >> a >> b && a != 0 && b != 0) {
        entries_count++;
        if (a + b == z) {
            eq_count++;
        }
    }

    double ratio = double(eq_count) / entries_count * 100;

    cout << "Vnesovte " << eq_count << " parovi od broevi chij zbir e " << z << endl;
    cout << "Procentot na parovi so zbir " << z << " e " << ratio << "%" << endl;

    return 0;
}
