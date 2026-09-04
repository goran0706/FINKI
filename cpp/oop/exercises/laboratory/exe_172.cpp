// Да се дефинира класа Book во која ќе се чуваат податоци за една книга:
//
//     title - наслов на книгата (низа од знаци)
//     author - автор на книгата (низа од знаци)
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     функција print() што ги печати насловот и авторот, секој во нов ред
//
// Да не се користат get/set методи.
//
// Потоа да се дефинира класа Member во која ќе се чуваат следните податоци:
//
//     name - име на членот (низа од знаци)
//     borrowedBooks - низа од книги што ги има позајмено членот (максимум 50 книги)
//     n - број на позајмени книги (иницијално 0)
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор со еден аргумент
//     функција print() што го печати името на членот и сите негови позајмени книги
//     функција void addBook(const Book& book) што ја додава книгата во низата borrowedBooks
//
// На крај да се напише функција:
//
// void showMembersWithManyBooks(Member members[], int n)
//
// која директно пристапува до приватните членови на класите Member и Book, и:
//
//     ги печати сите членови кои имаат позајмено најмалку 3 книги
//     за секој таков член, ги печати неговото име и сите негови позајмени книги
//     за секој таков член, дополнително печати дали бројот на позајмени книги е:
//         Exactly 3 books
//         More than 3 books
//     на крај го печати името на членот што има позајмено најмногу книги
//     ако има повеќе такви членови, да се испечати првиот
//     ако нема ниту еден член што има позајмено најмалку 3 книги, да се испечати No such member
//
// Форматот на печатење е даден во тест примерите.
//
// Define a class Book that stores data for one book:
//
//     title - title of the book (char array)
//     author - author of the book (char array)
//
// For the class, define:
//
//     default constructor
//     constructor with arguments
//     copy constructor
//     function print() that prints the title and author, each on a new line
//
// Do not use get/set methods.
//
// Then define a class Member that stores the following data:
//
//     name - name of the member (char array)
//     borrowedBooks - array of books borrowed by the member (maximum 50 books)
//     n - number of borrowed books (initially 0)
//
// For the class, define:
//
//     default constructor
//     constructor with one argument
//     function print() that prints the name of the member and all borrowed books
//     function void addBook(const Book& book) that adds the book to the borrowedBooks array
//
// Finally, write a function:
//
// void showMembersWithManyBooks(Member members[], int n)
//
// which directly accesses the private members of the Member and Book classes, and:
//
//     prints all members who have borrowed at least 3 books
//     for each such member, prints their name and all borrowed books
//     for each such member, additionally prints whether the number of borrowed books is:
//         Exactly 3 books
//         More than 3 books
//     at the end, prints the name of the member who has borrowed the largest number of books
//     if there are multiple such members, print the first one
//     if there is no member who has borrowed at least 3 books, print No such member
//
// The printing format is given in the test examples.
//
// For example:
// Input 	Result
//
// TestBook
// 3
// Members
// Ana
// Bojan
// Elena
// 3
// Books
// The Hobbit
// J.R.R. Tolkien
// 1984
// George Orwell
// Dune
// Frank Herbert
// 2
// Borrowings
// 1 1
// 2 3
//
//
//
// The Hobbit
// J.R.R. Tolkien
// 1984
// George Orwell
// Dune
// Frank Herbert

#include <iostream>
#include <cstring>
using namespace std;

// Don't modify
int main() {
    char testcase[100];
    cin.getline(testcase, 100);

    int n;
    cin >> n;
    cin.ignore();

    char ignore[100];
    cin.getline(ignore, 100);

    Member members[100];
    for (int i = 0; i < n; ++i) {
        char name[100];
        cin >> name;
        members[i] = Member(name);
    }

    int m;
    cin >> m;
    cin.ignore();

    cin.getline(ignore, 100);
    Book books[100];
    for (int i = 0; i < m; ++i) {
        char title[100], author[100];
        cin.getline(title, 100);
        cin.getline(author, 100);
        books[i] = Book(title, author);
    }

    int k;
    cin >> k;
    cin.ignore();

    cin.getline(ignore, 100);
    for (int i = 0; i < k; ++i) {
        int numMember, numBook;
        cin >> numMember >> numBook;
        numMember -= 1;
        numBook -= 1;
        members[numMember].addBook(books[numBook]);
    }

    if (strcmp(testcase, "TestBook") == 0) {
        for (int i = 0; i < m; ++i) {
            books[i].print();
        }
    } else if (strcmp(testcase, "TestMember") == 0) {
        for (int i = 0; i < n; ++i) {
            members[i].print();
        }
    } else {
        showMembersWithManyBooks(members, n);
    }

    return 0;
}
