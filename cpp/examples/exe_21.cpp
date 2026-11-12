// 8. Do Programming Exercise 7 but use new to allocate a structure instead of declaring a structure variable.
// Also have the program request the pizza diameter before it requests the pizza company name.

#include <iostream>
using namespace std;

struct Pizza {
    string name;
    int diameter{};
    double weight{};
};


int main() {
    // Pizza *pizza = new Pizza;
    auto *pizza = new Pizza; // Use auto when initializing with new to avoid duplicating the type name

    cout << "Enter pizza's diameter: ";
    cin >> pizza->diameter;

    cout << "Enter pizza's weight: ";
    (cin >> (*pizza).weight).get();

    // after cin >> pizza.weight, if we ever add another getline() call afterward,
    // we will hit the leftover newline problem.
    cout << "Enter pizza name: ";
    getline(cin, pizza->name);

    cout << "Pizza: " << pizza->name << endl;
    cout << "Pizza's diameter: " << pizza->diameter << endl;
    cout << "Pizza's weight: " << pizza->weight << endl;

    // If we omit to delete the pointer than Allocated memory is leaked
    delete pizza; // Free memory

    return 0;
}

