// Да се дефинира класа Book во која се чуваат информации за:
//
//     Наслов на книгата (низа од најмногу 50 знаци) - default вредност book-title
//     Автор на книгата (низа од најмногу 50 знаци) - default вредност author
//     ISBN на книгата (низа од најмногу 20 знаци) - default вредност 978-00-00000-00-0
//
//     Број на издавачи (цел број) - default вредност 0
//
// За класата да се дефинираат потребните конструктори и:
//
//     Да се преоптовари оператор << за печатење - кој печати информации за книгата во форматот како во тест примерите.
//     Метод bool checkISBN() - кој враќа информација дали isbn форматот е правилен, односно дали книгата е валидна.
//
// Еден isbn е правилен:
//
//     Доколку започнува на 978-
//     Вкупно треба 4 пати да се појави карактерот "-"
//     Вкупно треба да има 13 цифри
//         Пример правилен формат 978-00-00000-00-0
//
// Да се дополни главната функција на означеното место со читање на број N, па информации за N книги и книгите да се додадат во низата books.
//
// ----
//
// Define a class Book that stores the following information:
//
//     Title (character array with a maximum of 50 characters) - default value book-title
//     Author (character array with a maximum of 50 characters) - default value author
//     ISBN (character array with a maximum of 20 characters) - default value 978-00-00000-00-0
//     Number of publishers (integer) - default value 0
//
// For the class define the necessary constructors and:
//
//     overload the operator << for printing, which prints books information in the format shown in the test examples
//     method bool checkISBN() – which returns whether the isbn format is valid, meaning the book is valid.
//
// An ISBN is considered strong if:
//
//     It starts with 978-
//     The character "-" appears 4 times
//     In total the isbn should have 13 digits
//         Example of a valid isbn 978-00-00000-00-0
//
// Complete the main function at the indicated location by reading an integer N, then reading the information for N books and adding the books to the array books.
//
// For example:
// Input 	Result
//
// 3
// The Hobbit
// J.R.R. Tolkien
// 978-00-12345-67-8
// 5
// Clean Code
// Robert C. Martin
// 977-01-23456-78-9
// 3
// Design Patterns
// Erich Gamma
// 978-02-34567-89-0
// 4
// 1
//
//
//
// The Hobbit - J.R.R. Tolkien : 978-00-12345-67-8
// Publishers: 5
// Clean Code - Robert C. Martin : 977-01-23456-78-9
// Publishers: 3
// Design Patterns - Erich Gamma : 978-02-34567-89-0
// Publishers: 4
//
// 3
// The Hobbit
// J.R.R. Tolkien
// 978-00-12345-67-8
// 5
// Clean Code
// Robert C. Martin
// 977-01-23456-78-9
// 3
// Design Patterns
// Erich Gamma
// 978-02-34567-89-0
// 4
// 2
//
//
//
// VALID ISBN
// INVALID ISBN
// VALID ISBN

#include <cstring>
#include <iostream>
using namespace std;

/*
 * Your code here!
 * */

int main() {
    Book books[50];

    int N;

    //TODO read n books
    /*
     *
     * Your code here.
     *
     * */

    int choice;
    cin >> choice;

    if (choice == 1) {
        for (int i = 0; i < N; ++i) {
            cout << books[i];
        }
    } else if (choice == 2) {
        for (int i = 0; i < N; ++i) {
            if (books[i].checkIsbn()) {
                cout << "VALID ISBN" << endl;
            } else {
                cout << "INVALID ISBN" << endl;
            }
        }
    } else {
        cout << "Test default constructor" << endl;
        cout << books[N + 1];
    }

    return 0;
}
