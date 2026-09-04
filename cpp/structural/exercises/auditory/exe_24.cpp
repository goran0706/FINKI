// Да се пресмета сума на броевите од 1 до N,
// N се внесува од тастатура.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int sum = 0;

    for (int i = 1; i < n; i++) {
        sum += i;
    }

    cout << "Sum = " << sum << endl;

    return 0;
}
