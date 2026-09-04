//  Замена со покажувачи (Swap with pointers)

#include <iostream>
using namespace std;

void swap_pointers(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void swap_references(int &a, int &b) {
    int tmp = a;
    a = b;
    b = tmp;
}


int main() {
    int ptrA = 1, ptrB = 2;

    swap_pointers(&ptrA, &ptrB);
    cout << ptrA << ":" << ptrB << endl;

    int refA = 1, refB = 2;

    swap_references(refA, refB);
    cout << refA << ":" << refB << endl;

    return 0;
}
