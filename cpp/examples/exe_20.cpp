// 7. William Wingate runs a pizza-analysis service. For each pizza, he needs to record the following information:
// The name of the pizza company, which can consist of more than one word
// The diameter of the pizza
// The weight of the pizza
// Devise a structure that can hold this information and write a program that uses a structure variable of that type.
// The program should ask the user to enter each of the preceding items of information, and then the program should
// display that information. Use cin (or its methods) and cout.

#include <iostream>
using namespace std;

struct Pizza {
    string name;
    int diameter{};
    double weight{};
};


int main() {
    Pizza pizza;

    cout << "Enter pizza name: ";
    getline(cin, pizza.name);

    cout << "Enter pizza's diameter: ";
    cin >> pizza.diameter;

    cout << "Enter pizza's weight: ";
    (cin >> pizza.weight).get();

    // after cin >> pizza.weight, if we ever add another getline() call afterward,
    // we will hit the leftover newline problem.
    // cout << "Enter pizza name: ";
    // getline(cin, pizza.name);

    cout << "Pizza: " << pizza.name << endl;
    cout << "Pizza's diameter: " << pizza.diameter << endl;
    cout << "Pizza's weight: " << pizza.weight << endl;

    // Pizza types[] = {
    //     {"Margherita", 12, 400.0},
    //     {"Pepperoni", 14, 550.0},
    //     {"BBQ Chicken", 16, 650.0}
    // };
}


