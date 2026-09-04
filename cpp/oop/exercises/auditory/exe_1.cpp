/*
    Објектно ориентирано програмирање

    Аудиториска вежба 1 (Структури во C++)
    Потсетување за референци
    https://www.reddit.com/r/gifs/comments/6xl13s/pass_by_reference_vs_pass_by_value/

*/
#include <iostream>

using namespace std;

void swapWithoutReferences(int a, int b) {
    const int tmp = a;
    a = b;
    b = tmp;
}


void swapWithReferences(int &a, int &b) {
    const int tmp = a;
    a = b;
    b = tmp;
}

void swapWithPointers(int *a, int *b) {
    const int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int a = 10, b = 20;

    swapWithoutReferences(a, b);
    cout << a << " " << b << endl;

    swapWithReferences(a, b);
    cout << a << " " << b << endl;

    swapWithPointers(&a, &b);
    cout << a << " " << b << endl;

    return 0;
}

