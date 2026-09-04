// Да се пресмета абсолутна како резултат од просечна вредност од сумата на n минус секој број до n.

#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int n;
    cin >> n;

    int sum = 0;

    for (int i = 1; i <= n; i++) {
        sum += n - i;
    }

    const double average = static_cast<double>(sum) / n;

    cout << average << endl;
    cout << abs(average) << endl;

    return 0;
}
