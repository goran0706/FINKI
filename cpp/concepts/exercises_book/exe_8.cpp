// 1. Write a short program that asks for your height in integer inches and then converts your height to feet and inches.
// Have the program use the underscore character to indicate where to type the response.
// Also use a const symbolic constant to represent the conversion factor.


#include <iostream>

int main() {
    using namespace std;

    const int inches_in_feet = 12;
    int height;

    cout << "Enter your height in inches: _";
    cin >> height;

    int feet = height / inches_in_feet;
    int inches = height % inches_in_feet;

    cout << "Your height: " << feet << " feet and " << inches << " inches" << endl;

    return 0;
}
