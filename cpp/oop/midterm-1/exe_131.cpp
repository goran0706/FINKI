// Да се дефинира класа User во која се чуваат информации за:
//
//     Корисничко име (низа од најмногу 50 знаци) - default вредност user
//     Лозинка (низа од најмногу 50 знаци) - default вредност password
//     Број на најави на корисникот во системот (цел број) - default вредност 0
//
// За класата да се дефинираат потребните конструктори и:
//
//     да се преоптовари оператор << за печатење - кој печати информации за корисникот во форматот како во тест примерите
//     метод bool strongPassword() - кој враќа информација дали лозинката е силна
//
// Една лозинка е силна доколку:
//
//     Има најмалку 12 знаци
//     Мнозинство знаци не се ниту букви ниту бројки
//         Пример лозинката qwerty123456 не е силна (сите знаци се букви и бројки)
//         Лозинката qwerty*_$%^&! е силна (7 од 13 знаци не се букви ниту бројки)
//
// Да се дополни главната функција на означеното место со читање на број N, па информации за N корисници и корисниците да се додадат во низата users.
//
// Помош: Може да ги користите функциите isalpha(), isdigit() или isalnum() од библиотеката ctype.
//
// ----
//
// Define a class User that stores the following information:
//
//     Username (character array with a maximum of 50 characters) - default value user
//     Password (character array with a maximum of 50 characters) - default value password
//     Number of user logins in the system (integer) - default value 0
//
// For the class define the necessary constructors and:
//
//     overload the operator << for printing, which prints user information in the format shown in the test examples
//     method bool strongPassword() – which returns whether the password is strong
//
// A password is considered strong if:
//
//     It has at least 12 characters
//     The majority of characters are neither letters nor digits
//         Example password qwerty123456 is not strong (all characters are letters or digits)
//         Password qwerty*_$%^&! is strong (7 of 13 characters are neither letters nor digits)
//
// Complete the main function at the indicated location by reading an integer N, then reading the information for N users and adding the users to the array users.
//
// Hint: You can use the functions isalpha(), isdigit() and/or isalnum() from the ctype library.
//
// For example:
// Input 	Result
//
// 3
// ana pass123 5
// marko !!!!!!@@@@@@ 10
// ivan abcd!.?*@@-+ 2
// 1
//
//
//
// ana pass123 5
// marko !!!!!!@@@@@@ 10
// ivan abcd!.?*@@-+ 2
//
// 3
// ana pass123 5
// marko !!!!!!@@@@@@ 10
// ivan abcd!.?*@@-+ 2
// 2
//
//
//
// WEEK
// STRONG
// STRONG

#include <iostream>
#include <cstring>
#include <cctype>

using namespace std;

/*
 * Your code here!
 * */
int main() {
    int n;

    User users[100];

    //TODO read n users
    /*
     *
     * Your code here.
     *
     * */

    int choice;
    cin >> choice;

    if (choice == 1) {
        for (int i = 0; i < n; i++) {
            cout << users[i] << endl;
        }
    } else if (choice == 2) {
        for (int i = 0; i < n; i++) {
            if (users[i].strongPassword()) {
                cout << "STRONG" << endl;
            } else {
                cout << "WEEK" << endl;
            }
        }
    } else {
        cout << "Test default constructor" << endl;
        cout << users[n + 1] << endl;
    }

    return 0;
}
