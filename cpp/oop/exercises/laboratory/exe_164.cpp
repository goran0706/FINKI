// Да се дефинира класа Book за која ќе се чуваат:
//
//     динамички алоцирана низа од карактери за насловот на книгата
//     низа од максимум 40 карактери за авторот
//     број на страници (int)
//     основна цена на книгата (double)
//     рејтинг на книгата (double, од 0 до 5)
//
// За класата да се дефинираат:
//
//     default конструктор и конструктор со аргументи
//     copy constructor и оператор =
//     деструктор
//
// Методи:
//
//     double value()
//     → ја враќа вредноста пресметана како:
//     price + (rating * 10)
//     void print()
//     печати во формат:
//
//
// Title - Author
// Pages: pages
// Price: price
// Rating: rating
// Value: value
//
//
//
// Да се дефинира класа EBook која наследува од Book и дополнително чува:
//
//     големина на фајлот во MB (double)
//     број на преземања (int)
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор кој прима објект од Book + дополнителните податоци
//     конструктор со сите аргументи
//     copy constructor, оператор = и деструктор
//
// Методи:
//
//     double digitalValue()
//     → се пресметува како:
//     (rating * 15) + (downloads * 0.01) - (size * 0.2)
//
// Да се препокријат:
//
//     value()
//     → враќа просек од value() од базната класа и digitalValue()
//     print()
//     → печати ги сите информации +:
//
//
// Digital Value: digitalValue
// Total Value: value
//
// --------------------------------------------------------------------------------------------
//
// Define a class Book that stores:
//
//     dynamically allocated array of characters for the book title
//     array of max 40 characters for the author
//     number of pages (int)
//     base price of the book (double)
//     rating of the book (double, from 0 to 5)
//
// For the class define:
//
//     default constructor and constructor with arguments
//     copy constructor and assignment operator (=)
//     destructor
//
// Methods:
//
//     double value()
//     → returns value calculated as:
//     price + (rating * 10)
//     void print()
//     prints in format:
//
//
// Title - Author
// Pages: pages
// Price: price
// Rating: rating
// Value: value
//
//
// Define a class EBook that inherits from Book and adds:
//
//     file size in MB (double)
//     download count (int)
//
// For the class define:
//
//     default constructor
//     constructor that takes a Book object + extra fields
//     constructor with all arguments
//     copy constructor, assignment operator, destructor
//
// Methods:
//
//     double digitalValue()
//     → calculated as:
//     (rating * 15) + (downloads * 0.01) - (size * 0.2)
//
// Override:
//
//     value()
//     → returns average of base value() and digitalValue()
//     print()
//     → prints everything +:
//
//
// Digital Value: digitalValue
// Total Value: value
//
// For example:
// Input 	Result
//
// 1
// BookA AuthorA 100 20 4.5
// BookB AuthorB 250 15 3
// BookC AuthorC 300 30 5
// BookD AuthorD 150 10 2.5
// BookE AuthorE 200 25 4
//
//
//
// BOOKS:
// =========================
// BookA - AuthorA
// Pages: 100
// Price: 20
// Rating: 4.5
// Value: 65
// BookB - AuthorB
// Pages: 250
// Price: 15
// Rating: 3
// Value: 45
// BookC - AuthorC
// Pages: 300
// Price: 30
// Rating: 5
// Value: 80
// BookD - AuthorD
// Pages: 150
// Price: 10
// Rating: 2.5
// Value: 35
// BookE - AuthorE
// Pages: 200
// Price: 25
// Rating: 4
// Value: 65
#include<iostream>
#include<cstring>
using namespace std;


int main() {
    char title[100];
    char author[40];
    int pages;
    double price, rating;
    double size;
    int downloads;

    Book *books = new Book[5];
    EBook *ebooks = new EBook[5];

    int n;
    cin >> n;

    if (n == 1) {
        cout << "BOOKS:" << endl;
        cout << "=========================" << endl;

        for (int i = 0; i < 5; i++) {
            cin >> title >> author >> pages >> price >> rating;
            books[i] = Book(title, author, pages, price, rating);
            books[i].print();
        }
    } else if (n == 2) {
        for (int i = 0; i < 5; i++) {
            cin >> title >> author >> pages >> price >> rating;
            cin >> size >> downloads;

            books[i] = Book(title, author, pages, price, rating);
            ebooks[i] = EBook(books[i], size, downloads);
        }

        cout << "BOOKS:" << endl;
        cout << "=========================" << endl;
        for (int i = 0; i < 5; i++)
            books[i].print();

        cout << "EBOOKS:" << endl;
        cout << "=========================" << endl;
        for (int i = 0; i < 5; i++)
            ebooks[i].print();
    } else if (n == 3) {
        for (int i = 0; i < 5; i++) {
            cin >> title >> author >> pages >> price >> rating;
            cin >> size >> downloads;

            ebooks[i] = EBook(title, author, pages, price, rating, size, downloads);
        }

        cout << "EBOOKS:" << endl;
        cout << "=========================" << endl;
        for (int i = 0; i < 5; i++)
            ebooks[i].print();
    }

    delete[] books;
    delete[] ebooks;
}
