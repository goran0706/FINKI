// Да се дефинира класа Camera во која ќе се чуваат податоци за една камера:
//
//     модел (низа од карактери не подолга од 20 карактери)
//     мегапиксели (цел број)
//     година на производство (цел број)
//
// За класата да се дефинира:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     деструктор
//     get и set методи (доколку има потреба од истите)
//
// Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат:
//
// (модел) (мегапиксели)MP produced in: (година)
//
// Потоа да се дефинира класа Photographer во која се чуваат следните информации:
//
//     име (низа од карактери не подолга од 20 карактери)
//     презиме (низа од карактери не подолга од 20 карактери)
//     камера (објект од класа Camera)
//
// Да се креира:
//
//     default конструктор
//     конструктор со аргументи
//     деструктор
//     get и set методи (доколку има потреба од истите)
//
// Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат:
//
// (име) (презиме) shoots with the camera: (информации за камерата)
//
// ДА НЕ СЕ МЕНУВА MAIN ФУНКЦИЈАТА!!!
//
// ---
//
// Define a class Camera that will store data for a camera:
//
//     model (a character array not longer than 20 characters)
//     megapixels (integer)
//     production year (integer)
//
// For this class define:
//
//     a default constructor
//     a constructor with arguments
//     a copy constructor
//     a destructor
//     get and set methods (only if needed)
//
// Also define a function that prints the information about the class in the following format:
//
// (model) (megapixels)MP produced in: (year)
//
// Then define a class Photographer that stores the following information:
//
//     first name (a character array not longer than 20 characters)
//     last name (a character array not longer than 20 characters)
//     camera (an object of class Camera)
//
// Create:
//
//     a default constructor
//     a constructor with arguments
//     a destructor
//     get and set methods (only if needed)
//
// Also define a function that prints the information about the class in the following format:
//
// (first name) (last name) shoots with the camera: (camera information)
//
// DO NOT MODIFY THE MAIN FUNCTION!!!
//
// For example:
// Input 	Result
//
// 1
// PanasonicGH5
// 20
// 2018
// Igor
// Igorovski
//
//
//
// Igor Igorovski shoots with the camera: PanasonicGH5 20MP, produced in: 2018

#include <iostream>

using namespace std;

//YOUR CODE HERE


//DO NOT CHANGE THE MAIN FUNCTION
int main() {
    char model[20];
    int megapixels;
    int year;
    char name[20];
    char surname[20];

    int testCase;

    cin >> testCase;

    cin >> model;
    cin >> megapixels;
    cin >> year;
    cin >> name;
    cin >> surname;

    if (testCase == 1) {
        Camera camera(model, megapixels, year);

        Photographer photographer(name, surname, camera);
        photographer.print();
    }

    if (testCase == 2) {
        Camera camera(Camera(model, megapixels, year));

        Photographer photographer(name, surname, camera);
        photographer.print();
    }
}
