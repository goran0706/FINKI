// Пример за поинтери

#include <iostream>
using namespace std;

void swap(int a, int b) {
    // pass-by-value
    // Will not swap a and by because they are passed by value
    int tmp = a;
    a = b;
    b = tmp;
}

void swap_with_pointers(int *a, int *b) {
    // pass-by-reference
    // Will swap a and b because they are passed as reference
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void swap_with_reference(int &a, int &b) {
    // pass-by-reference
    // Will swap a and b because they are passed as reference
    int tmp = a;
    a = b;
    b = tmp;
}

int main() {
    int a = 10;

    // ==========================
    // BAD
    // ==========================
    // Points to unknown location in memory
    // Always initialize pointers

    // int *ptrA;
    // ptrA = &a;

    // ==========================
    // INVALID
    // ==========================
    // Pointer to an integer type value (expects an address not a value)

    // int *ptrA = a;

    // ==========================
    // GOOD
    // ==========================
    int *ptrA = &a;
    cout << "Pointer address: " << ptrA << endl;
    cout << "Pointer value: " << *ptrA << endl;

    // ===========================
    // DYNAMIC MEMORY ALLOCATION
    // ===========================
    // Using new we dynamically allocate memory for an integer type array
    // Each new must be paired with delete [] otherwise we have a memory leak

    int *ptrArray = new int[10];
    ptrArray[0] = 10;
    ptrArray[1] = 20;

    cout << "Pointer to array decays to first element: " << ptrArray << endl;
    cout << "Pointer to array decays to first element: " << *ptrArray << endl;
    cout << "First element: " << ptrArray[0] << endl;
    cout << "Second element: " << ptrArray[1] << endl;

    delete [] ptrArray;

    // ======================================
    // MEMORY LEAK
    // ======================================
    // Prevent memory leaks
    // delete ptr
    // delete [] ptrArray
    int *ptr = new int;
    *ptr = 10;
    cout << "Pointer address: " << ptr << endl;
    cout << "Pointer value: " << *ptr << endl;

    delete ptr;

    // ======================================
    // Pass-by-reference vs. Pass-by-value
    // ======================================
    int a1 = 10, b1 = 20;
    swap(a1, b1);
    cout << a1 << " " << b1 << endl;

    int a2 = 10, b2 = 20;
    swap_with_pointers(&a2, &b2);
    cout << a2 << " " << b2 << endl;

    int a3 = 10, b3 = 20;
    swap_with_reference(a3, b3);
    cout << a3 << " " << b3 << endl;
}
