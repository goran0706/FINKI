/*
    Објектно ориентирано програмирање
    
    Аудиториска вежба 11 (Темплејти и вектори)
    1. Темплејти
    1.1 Функциски темплејти
    1.1.1 Темплејт функција за промена на вредности на две променливи
    1.1.2. Преоптоварување на функциски темплејт
*/
#include <iostream>
using namespace std;

template<typename T>
void swapValues(T &a, T &b) {
    T temp = a;
    a = b;
    b = temp;
}

template<typename T>
void print(T value) {
    cout << value << endl;
}

template<typename T>
void print(T a, T b) {
    cout << a << " " << b << endl;
}

template<typename T>
T maximum(T a, T b) {
    if (a > b) {
        return a;
    }

    return b;
}

template<typename T>
T maximum(T a, T b, T c) {
    return maximum(maximum(a, b), c);
}

void func(int x) {
    cout << "Normal function" << endl;
}

template<typename T>
void func(T x) {
    cout << "Template function" << endl;
}

int main() {
    int x = 5;
    int y = 10;

    cout << "Swap int:" << endl;
    cout << x << " " << y << endl;
    swapValues(x, y);
    cout << x << " " << y << endl;

    double a = 3.14;
    double b = 6.28;

    cout << "\nSwap double:" << endl;
    cout << a << " " << b << endl;
    swapValues(a, b);
    cout << a << " " << b << endl;

    cout << "\nPrint:" << endl;
    print(5);
    print(5, 10);
    print(3.14);
    print(3.14, 6.28);

    cout << "\nMaximum:" << endl;
    cout << maximum(5, 8) << endl;
    cout << maximum(5, 8, 2) << endl;
    cout << maximum(3.5, 7.1) << endl;
    cout << maximum(3.5, 7.1, 6.2) << endl;

    cout << "\nOverloading:" << endl;
    func(5);
    func(3.14);

    return 0;
}
