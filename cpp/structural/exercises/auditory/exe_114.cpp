// Да се напише програма со која се внесуваат N цели броеви и која го печати следниот извештај:
// максималната вредност, минималната вредност и средна вредност за внесените броеви.
//
// Влез:
// прво се внесува N, а потоа се внесуваат N-те броеви
// Излезот е во формат како во примерот (секоја од бараните вредности во дадениот редослед да биде отпечатена во нов ред)

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int sum = 0;
    int min = a[0];
    int max = a[0];

    for (int i = 0; i < n; i++) {
        int current = a[i];
        sum += current;

        if (current < min) {
            min = current;
        }

        if (current > max) {
            max = current;
        }
    }

    double average = double(sum) / n;

    cout << max << endl;
    cout << min << endl;
    cout << average << endl;
}
