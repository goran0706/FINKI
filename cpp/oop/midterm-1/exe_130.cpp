// Да се дефинира класа Contact во која се чуваат информации за:
//
//     Име на контактот (низа од најмногу 50 знаци) – default вредност unknown
//     Телефонски број (низа од најмногу 20 знаци) – default вредност +38970000000
//     Број на повици кон овој контакт (цел број) – default вредност 0
//
// За класата да се дефинираат потребните конструктори и следните методи:
//
//     Да се преоптовари оператор << за печатење на информациите за контактот во форматот прикажан во тест примерите.
//     Метод bool validNumber() кој проверува дали телефонскиот број е валиден.
//
// Телефонскиот број се смета за валиден доколку е во формат +389XXXXXXXX, односно:
//
//     започнува со +389
//     после +389 има точно 8 цифри
//
// Да се дополни главната функција на означеното место со код за креирање на објекти.
//
// Помош: Може да ја користите функцијата isdigit() од библиотеката ctype.
//
// ----
//
// Define a class Contact that stores the following information:
//
//     Contact name (character array with a maximum of 50 characters) – default value unknown
//     Phone number (character array with a maximum of 20 characters) – default value +38970000000
//     Number of calls to this contact (integer) – default value 0
//
// For the class define the necessary constructors and the following methods:
//
//     Overload the operator << for printing the contact information in the format shown in the test examples.
//     Method bool validNumber() which checks whether the phone number is valid.
//
// A phone number is considered valid if it is in the format +389XXXXXXXX, meaning:
//
//     it starts with +389
//     after +389 There are exactly 8 digits
//
// Complete the main function at the indicated location with code for creating objects.
//
// Hint: You can use the function isdigit() from the ctype library.
//
// For example:
// Input 	Result
//
// 3
// Ana +38970123456 1
// Marko +38975234567 2
// Ivan +38970333333 3
// 2
//
//
//
// VALID
// VALID
// VALID
//
// 3
// Ana +38170123456 1
// Marko 38975234567 2
// Ivan +38870333333 3
// 1
//
//
//
// Ana +38170123456 1
// Marko 38975234567 2
// Ivan +38870333333 3
//
// 3
// Ana +38170123456 1
// Marko 38975134567 2
// Ivan +388703A3333 3
// 2
//
//
//
// INVALID
// INVALID
// INVALID

#include <iostream>
#include <cstring>
#include <cctype>

using namespace std;


int main() {
    int n;


    Contact contacts[100];

    /*
    TODO read N contacts
    */

    int choice;
    cin >> choice;

    if (choice == 1) {
        for (int i = 0; i < n; i++) {
            cout << contacts[i] << endl;
        }
    } else if (choice == 2) {
        for (int i = 0; i < n; i++) {
            if (contacts[i].validNumber()) {
                cout << "VALID" << endl;
            } else {
                cout << "INVALID" << endl;
            }
        }
    } else {
        cout << "Testing default constructor" << endl;
        cout << contacts[n] << endl;
    }

    return 0;
}
