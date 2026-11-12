// Подреден број е број кај кој секоја следна цифра е поголема или еднаква на претходната (гледајќи од најзначајната кон најмалку значајната).
// На пример, 12234.

// Да се напише програма во која прво се внесува број N кој го определува вкупниот број на броеви кои ќе бидат внесени од тастатура.
// Потоа се внесуваат N-те броеви, еден по еден.
// На излез, потребно е да се испечатат сите броеви кои го исполнуваат условот за подреден број,
// а потоа да се отпечати сумата на сите внесени Подредени броеви и нивниот број.

#include <iostream>
using namespace std;

bool is_ordered(int n) {
    while (n >= 10) {
        int current = n % 10;
        int previous = (n / 10) % 10;
        if (current < previous) {
            return false;
        }
        n /= 10;
    }
    
    return true;
}

int main() {
    int n;
    cin >> n;
    int a[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int sum = 0;
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (is_ordered(a[i])) {
            cout << a[i] << endl;
            sum += a[i];
            count++;
        }
    }

    cout << sum << endl;
    cout << count << endl;

    return 0;
}
