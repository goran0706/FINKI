// Да се напише програма со која се внесуваат N цели броеви и која го печати следниот извештај:
// максималната вредност, минималната вредност и средна вредност за внесените броеви.
//
// Влез: прво се внесува N, а потоа се внесуваат N-те броеви
// Излезот е во формат како во примерот (секоја од бараните вредности во дадениот редослед да биде отпечатена во нов ред)

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int num;
    cin >> num;

    int sum = num;
    int min = num;
    int max = num;

    for (int i = 1; i < n; i++) {
        cin >> num;
        sum += num;

        if (num < min) {
            min = num;
        }

        if (num > max) {
            max = num;
        }
    }

    const double avg = static_cast<double>(sum) / n;
    cout << min << endl;
    cout << max << endl;
    cout << sum << endl;
    cout << avg << endl;
}
