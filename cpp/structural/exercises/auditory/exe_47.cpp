// Да се напише програма која за низа чии елементи се внесуваат од тастатура,
// ќе го пресмета збирот на парните елементи, збирот на непарните елементи,
// како и односот помеѓу бројот на парни и непарни елементи.
// Резултатот да се испечати на екран.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int count_odd = 0;
    int count_even = 0;

    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) {
            count_even++;
        } else {
            count_odd++;
        }
    }

    const double ratio = count_odd == 0 ? 0 : count_even / count_odd;
    cout << "Ratio: " << ratio << endl;

    return 0;
}
