// 1.
// vnesuvash od standard input N da se ispecatat 1234…N…4321 i da se namaluvaa
// (60% poeni ako se reshi so funkcija,40% ako e bez funcija, 100% so rekurzija)
// pr. input 5
// output
// 123454321
// 1234321
// 12321
// 121
// 1
#include <iostream>
using namespace std;

void print_pyramid(int n, int i = 1) {
    if (n < 1) {
        return;
    }

    cout << i;
    if (i < n) {
        print_pyramid(n, i + 1);
        cout << i;
    }

    if (i == 1) {
        cout << endl;
        print_pyramid(n - 1, 1);
    }
}

int main() {
    int n;
    cin >> n;

    print_pyramid(n);

    return 0;
}
