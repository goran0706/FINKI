// Од стандарден влез се внесува број N, а потоа се внесуваат N цели броеви.
// За секој од внесените броеви треба да се најде неговиот остаток при делење со 5.
// Во зависност од остатокот, на екран се печати соодветна вредност според следниве правила:
//
// - Ако остатокот е 0: Се печати бројот поделен со 5 (broj / 5).
// - Ако остатокот е 1 или 2: Се печати сумата од тековниот број и претходно внесениот број (broj + prethoden).
//   За првиот број во низата, бидејќи нема претходен, се зема дека претходниот е 0.
// - Ако остатокот е 3 или 4: Се печати бројот помножен со 2 (broj * 2).
//
// Input:
// 4
// 6 25 7 4
//
// output:
// 6 5 32 8
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int previous = 0;

    for (int i = 0; i < n; i++) {
        int current;
        cin >> current;

        // Solution 1:
        int result = current % 5;

        if (result == 0) {
            cout << current / 5 << " ";
        } else if (result == 1 || result == 2) {
            cout << current + previous << " ";
        } else if (result == 3 || result == 4) {
            cout << current * 2 << " ";
        }

        // Solution 2:
        // switch (current % 5) {
        //     case 0:
        //         cout << current / 5 << " ";
        //         break;
        //     case 1:
        //     case 2:
        //         cout << current + previous << " ";
        //         break;
        //     case 3:
        //     case 4:
        //         cout << current * 2 << " ";
        //         break;
        //     default:
        //         break;
        // }

        previous = current;
    }

    return 0;
}
