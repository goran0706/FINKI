// 6. The CandyBar structure contains three members, as described in Programming Exercise 5. Write a program that creates
// an array of three CandyBar structures, initializes them to values of your choice, and then displays the contents of
// each structure.

#include <iostream>
using namespace std;

struct CandyBar {
    string name;
    double weight;
    int calories;
};

int main() {
    const int snacksSize = 3;

    CandyBar snacks[snacksSize] = {
        {
            "Mocha Munch",
            2.3,
            350
        },
        {
            "Snickers",
            2,
            600
        },
        {
            "Ice Cream",
            1.5,
            200
        }
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
}
