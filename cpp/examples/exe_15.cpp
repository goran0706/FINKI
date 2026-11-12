// 1. Write a C++ program that requests and displays information as shown in the following example of output:

// What is your first name? Betty Sue
// What is your last name? Yewe
// What letter grade do you deserve? B
// What is your age? 22

// Name: Yewe, Betty Sue
// Grade: C
// Age: 22

// Note that the program should be able to accept first names that comprise more than one word. Also note that the
// program adjusts the grade downward—that is, up one letter. Assume that the user requests an A, a B, or a C so that
// you don’t have to worry about the gap between a D and an F.

#include <iostream>
#include <string>

int main() {
    using namespace std;

    // C style
    int arraySize = 20;
    char first_name[arraySize];
    char last_name[arraySize];

    // C++ style
    // string first_name;
    // string last_name;

    char grade;
    int age;

    cout << "What is your first name? ";
    // C style
    cin.getline(first_name, arraySize);

    // C++ style
    // getline(cin, first_name);

    cout << "What is your last name? ";
    // C style
    cin.getline(last_name, arraySize);

    // C++ style
    // getline(cin, last_name);

    cout << "What letter grade do you deserve? ";
    cin >> grade;

    cout << "What is your age? ";
    cin >> age;

    // string concatenation
    // cout << "Name: " + last_name + ", " + first_name << endl;
    cout << "Name: " << last_name << ", " << first_name << endl;
    cout << "Grade: " << static_cast<char>(grade + 1) << endl;
    cout << "Age: " << age << endl;

    return 0;
}
