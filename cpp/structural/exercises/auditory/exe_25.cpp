// Да се пресмета производ на броевите од 1 до N,
// N се внесува од тастатура

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int result = 1;

    for (int i = 1; i < n; i++) {
        result *= i;
    }

    cout << "Result: " << result << endl;

    return 0;
}
