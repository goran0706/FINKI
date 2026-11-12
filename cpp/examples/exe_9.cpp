// 2. Write a short program that asks for your height in feet and inches and your weight in pounds.
// (Use three variables to store the information.) Have the program report your body mass index (BMI).
// To calculate the BMI, first convert your height in feet and inches to your height in inches (1 foot = 12 inches).
// Then convert your height in inches to your height in meters by multiplying by 0.0254.
// Then convert your weight in pounds into your mass in kilograms by dividing by 2.2.
// Finally, compute your BMI by dividing your mass in kilograms by the square of your height in meters.
// Use symbolic constants to represent the various conversion factors.
#include <iostream>

int main() {
    using namespace std;

    int feet = 0;
    int inches = 0;
    int pounds = 0;

    cout << "Enter your height in feet and inches and your weight in pounds.";
    cin >> feet >> inches >> pounds;

    const int feet_to_inches = 12;
    const double inches_to_meters = 0.0254;
    const double pounds_to_kg = 2.2;

    double height_in_inches = feet * feet_to_inches + inches;
    double height_in_meters = height_in_inches * inches_to_meters;
    double weight_in_kg = pounds / pounds_to_kg;
    double BMI = weight_in_kg / (height_in_meters * height_in_meters);

    cout << "Your BMI: " << BMI << endl;

    return 0;
}
