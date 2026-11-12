// Да се дефинира класа Book во која се чуваат податоци за книга:
//
//     наслов (низа од знаци долга најмногу 30 знаци)
//
//     ISBN (цел број)
//
//     година на објавување (цел број)
//
// За класата да се дефинираат default конструктор, конструктор со аргументи, copy конструктор, деструктор и доколку се потребни, get методи.
//
// Во класата да се имплементира и функција за печатење, која ќе печати во следниот формат :
// "(наслов) (ISBN) publish year: (година на објавување)".
//
// Потоа, да се дефинира класа Reader во која се чуваат следниве информации:
//
//     име (низа од знаци долга најмногу 20 знаци)
//
//     презиме (низа од знаци долга најмногу 20 знаци)
//
//     омилена книга (објект од класа Book)
//
// За класата дефинирајте default конструктор, конструктор со аргументи, деструктор и доколку се потребни, get методи. Во класата да се
//
//  имплементира и функција за печатење, која ќе печати во следниот формат :"(име) (презиме) has a favourite book: (информации за книгата)".
//
// НЕ ЈА МЕНУВАЈТЕ MAIN ФУНКЦИЈАТА!!!
//
// Define a class Book in which data for a book is stored:
//
//     title (a character array no longer than 30 characters)
//
//     isbn (integer)
//
//     publish year (integer)
//
// Define a default constructor, a constructor with arguments, a copy constructor, a destructor, and getter methods if necessary for the class. Also, define a function for printing information about the class in the following format:
// "(title) (isbn) publish year: (publish year)".
//
// Then, define a class Reader in which the following information is stored:
//
//     name (a character array no longer than 20 characters)
//
//     surname (a character array no longer than 20 characters)
//
//     favourite book (an object of class Book)
//
// Create a default constructor, a constructor with arguments, a destructor, and getter methods if necessary. Also, define a function for printing information about the class that prints in the following format:
// "(name) (surname) has a favourite book: (information about the book)".
//
// DO NOT MODIFY THE MAIN FUNCTION!!!
//
// For example:
// Input 	Result
//
// 1
// TheGreatGatsby
// 21092004
// 1925
// Martin
// Kocev
//
//
//
// Martin Kocev has a favourite book:
// TheGreatGatsby 21092004 publish year: 1925

#include <iostream>

using namespace std;

// YOUR CODE HERE


// DO NOT CHANGE THE MAIN FUNCTION
int main() {
    char title[30];
    int isbn;
    int year;
    char name[20];
    char surname[20];

    int testCase;

    cin >> testCase;

    cin >> title;
    cin >> isbn;
    cin >> year;
    cin >> name;
    cin >> surname;

    if (testCase == 1) {
        Book book(title, isbn, year);

        Reader reader(name, surname, book);
        reader.print();
    }
    if (testCase == 2) {
        Book book(Book(title, isbn, year));

        Reader reader(name, surname, book);
        reader.print();
    }
}

