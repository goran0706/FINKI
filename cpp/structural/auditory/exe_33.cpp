// Да се напише програма што ќе претставува едноставен калкулатор.
// Во програмата се вчитуваат два броја и оператор во формат:
// broj1 operator broj2

#include <iostream>
using namespace std;

int main() {
    int a, b, result;
    char op;

    cin >> a >> op >> b;

    switch (op) {
        case '+':
            cout << "a + b = " << a + b << endl;
            break;
        case '-':
            cout << "a - b = " << a - b << endl;
            break;
        case '*':
            cout << "a * b = " << a * b << endl;
            break;
        case '/':
            if (b == 0) {
                cout << "Division by Zero" << endl;
            }
            cout << "a / b = " << a / b << endl;
            break;
        default:
            cout << "Unsupported operator" << endl;
    }

    return 0;
}
