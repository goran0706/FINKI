// Да се напише програма што од N цели броеви внесени од тастатура
// ќе ја определи разликата од сумите на броевите на парни и непарни позиции (според редоследот на внесување).
// Ако оваа разлика е помала од 10 на екран се печати “Dvete sumi se slicni”, а во спротивно “Dvete sumi mnogu se razlikuvaat”.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];
    
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int sum_odd = 0;
    int sum_even = 0;

    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) {
            sum_even += a[i];
        } else {
            sum_odd += a[i];
        }
    }

    int diff = sum_even - sum_odd;

    if (diff < 10) {
        cout << "Dvete sumi se slicni" << endl;
    } else {
        cout << "Dvete sumi mnogu se razlikuvaat" << endl;
    }
}
