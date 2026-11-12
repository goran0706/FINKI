/*
    Од тастатура се внесуваат должини на три отсечки во произволен редослед.
    Да се напише програма што ќе провери дали од отсечките може да се конструира триаголник, при што ако може,
    да се провери дали истиот е правоаголен и да се пресмета неговата плоштина.
    Во спротивно, треба да се испечатат соодветни пораки.
*/

// Периметар (L) на триаголник:
// L = a + b + c
//
// Полупериметар:
// s = (a + b + c) / 2
//
// Плоштина (P) на триаголник:
// P = √( s * (s − a) * (s − b) * (s − c))

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    // -------------------------
    // 1. Nested version
    // -------------------------
    if (a + b > c && a + c > b && b + c > a) {
        if (!(a * a + b * b == c * c ||
              a * a + c * c == b * b ||
              b * b + c * c == a * a)) {
            cout << "Its not a right triangle\n";
        } else {
            const double s = (a + b + c) / 2.0;
            const double area = sqrt(s * (s - a) * (s - b) * (s - c));
            cout << area << endl;
        }
    } else {
        cout << "Cannot construct a triangle\n";
    }


    // -------------------------
    // 2. Clean if-else version
    // -------------------------
    if (a + b <= c || a + c <= b || b + c <= a) {
        cout << "Cannot construct a triangle\n";
    } else if (!(a * a + b * b == c * c ||
                 a * a + c * c == b * b ||
                 b * b + c * c == a * a)) {
        cout << "Its not a right triangle\n";
    } else {
        const double s = (a + b + c) / 2.0;
        const double area = sqrt(s * (s - a) * (s - b) * (s - c));
        cout << area << endl;
    }


    // -------------------------
    // 3. Best version
    // -------------------------
    if (a + b <= c || a + c <= b || b + c <= a) {
        cout << "Cannot construct a triangle\n";
        return 0;
    }

    if (!(a * a + b * b == c * c ||
          a * a + c * c == b * b ||
          b * b + c * c == a * a)) {
        cout << "Its not a right triangle\n";
        return 0;
    }

    const double s = (a + b + c) / 2.0;
    const double area = sqrt(s * (s - a) * (s - b) * (s - c));
    cout << area << endl;

    return 0;
}
