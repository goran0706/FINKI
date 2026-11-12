// 5. Write a program that requests the user to enter the current world population and the current population of the U.S.
// (or of some other nation of your choice). Store the information in variables of type long long.
// Have the program display the percent that the U.S. (or other nation’s) population is of the world’s population.

// The output should look something like this:
// Enter the world's population: 6898758899
// Enter the population of the US: 310783781
// The population of the US is 4.50492% of the world population.
// You can use the Internet to get more recent figures.

#include <iostream>
using namespace std;

int main() {
    long long population_world;
    long long population_US;

    cout << "Enter the world's population: ";
    cin >> population_world;

    cout << "Enter the population of the US: ";
    cin >> population_US;

    /*
        CAUTION:
        Integer division truncates to 0 before multiplying by 100.
        population_US / population_world = 0 (integer division)
        0 * 100 = 0

        FIX:
        Casting one operand to double forces floating-point division and preserves the fractional result.
    */
    double percent = static_cast<double>(population_US) / static_cast<double>(population_world) * 100;

    cout << "The population of the US is " << percent << "% of the world population.";
}

