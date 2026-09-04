// Да се напишат соодветни функции за пресметување на дијаметар, периметар и плоштина на круг чиј што радиус се предава како аргумент.
// Потоа да се напише и програма во која за внесен радиус (од тастатура) ќе се повикаат овие функции
// за да се пресметаат дијаметарот, периметарот и плоштината на соодветниот круг.

#include <iostream>
using namespace std;

constexpr double PI = 3.14159265358979323846;

double diameter(int r);

double perimeter(int r);

double area(int r);

int main() {
    int r;
    cin >> r;

    cout << "Diameter: " << diameter(r) << endl;
    cout << "Perimeter: " << perimeter(r) << endl;
    cout << "Area: " << area(r) << endl;

    return 0;
}

double diameter(const int r) {
    // Дијаметар (D) на круг се пресметува со формулата:
    // D = r * 2
    return r * 2;
}

double perimeter(const int r) {
    // Периметар (L) (или обиколка) на круг се пресметува со формулата:
    // L = 2 × π × r
    return 2 * PI * r;
}

double area(const int r) {
    // Плоштина (P) на круг се пресметува со формулата:
    // P = π × r² каде r е радиусот на кругот, а π ≈ 3.14.
    return PI * r * r;
}
