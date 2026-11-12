// Да се дефинира класа Laptop во која ќе се чуваат податоци за еден лаптоп:
//
//     бренд (низа од карактери не подолга од 20 карактери)
//     модел (низа од карактери не подолга од 20 карактери)
//     година на производство (цел број)
//
// За класата да се дефинира default конструктор, конструктор со аргументи, copy конструктор, деструктор и доколку има потреба get методи. Исто така да се дефинира и функција за печатење на информации за класата која ќе печати во следниот формат „(бренд) (модел) manufactured in: (година на производство)“.
//
// Потоа да се дефинира класа Employee во која се чуваат следните информации:
//
//     име (низа од карактери не подолга од 20 карактери)
//     позиција (низа од карактери не подолга од 20 карактери)
//     лаптоп (објект од класа Laptop)
//
// Да се креира default конструктор, конструктор со аргументи, деструктор и доколку има потреба get методи. Исто така да се дефинира и функција за печатење на информации за класата која ќе печати во следниот формат:
//
// „(име) works as (позиција) and uses laptop:
//
// (информации за лаптоп)“
//
// ДА НЕ СЕ МЕНУВА MAIN ФУНКЦИЈАТА!!!
//
// Define a class Laptop in which data for a laptop is stored:
//
//     brand (a character array no longer than 20 characters)
//     model (a character array no longer than 20 characters)
//     manufacturing year (integer)
//
// Define a default constructor, a constructor with arguments, a copy constructor, a destructor, and getter methods if necessary for the class. Also, define a function for printing information about the class in the following format: "(brand) (model) manufactured in: (manufacturing year)".
//
// Then, define a class Employee in which the following information is stored:
//
//     name (a character array no longer than 20 characters)
//     position (a character array no longer than 20 characters)
//     laptop (an object of class Laptop)
//
// Create a default constructor, a constructor with arguments, a destructor, and getter methods if necessary. Also, define a function for printing information about the class that prints in the following format:
//
// "(name) works as (position) and uses laptop:
//
// (information about the laptop)"
//
// DO NOT MODIFY THE MAIN FUNCTION!!!
//
// For example:
// Input 	Result
//
// 1
// Dell
// XPS13
// 2023
// Marko
// Developer
//
//
//
// Marko works as Developer and uses laptop:
// Dell XPS13 manufactured in: 2023

#include <iostream>

using namespace std;

//YOUR CODE HERE


//DO NOT CHANGE THE MAIN FUNCTION
int main() {
    char brand[20];
    char model[20];
    int year;
    char name[20];
    char position[20];

    int testCase;

    cin >> testCase;

    cin >> brand;
    cin >> model;
    cin >> year;
    cin >> name;
    cin >> position;

    if (testCase == 1) {
        Laptop laptop(brand, model, year);

        Employee employee(name, position, laptop);
        employee.print();
    }
    if (testCase == 2) {
        Laptop laptop(Laptop(brand, model, year));

        Employee employee(name, position, laptop);
        employee.print();
    }
}
