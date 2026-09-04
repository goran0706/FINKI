// 9. Do Programming Exercise 6, but instead of declaring an array of three CandyBar structures, use new to allocate the
// array dynamically.

#include <iostream>
using namespace std;

struct CandyBar {
    string name;
    double weight;
    int calories;
};

int main() {
    CandyBar *snacks = new CandyBar[3]; // allocate array of 3 CandyBar at runtime

    snacks[0] = {
        "Mocha Munch",
        2.3,
        350
    };

    *(snacks + 1) = {
        "Snickers",
        2,
        600
    };

    snacks[2] = {
        "Ice Cream",
        1.5,
        200
    };


    cout << "Snack: " << snacks[0].name << endl;
    cout << "Weight: " << snacks[0].weight << endl;
    cout << "Calories: " << snacks[0].calories << endl;
    cout << endl;

    cout << "Snack: " << snacks[1].name << endl;
    cout << "Weight: " << snacks[1].weight << endl;
    cout << "Calories: " << snacks[1].calories << endl;
    cout << endl;

    cout << "Snack: " << snacks[2].name << endl;
    cout << "Weight: " << snacks[2].weight << endl;
    cout << "Calories: " << snacks[2].calories << endl;

    delete [] snacks;
}
