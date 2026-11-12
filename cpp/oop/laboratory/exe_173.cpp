// Да се дефинира класа Airplane во која ќе се чуваат податоци за еден авион:
//
//     модел (низа од карактери не подолга од 20 карактери)
//     капацитет (цел број)
//     максимална брзина во km/h (децимален број)
//     година на производство (цел број)
//
// За класата да се дефинира default конструктор, конструктор со аргументи, copy конструктор, деструктор и доколку има потреба get методи. Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат: (модел) capacity: (капацитет) max speed: (брзина)km/h produced in: (година) [Modern Aircraft / Older Aircraft]
//
// Авионот се смета за модерен доколку годината на производство е поголема или еднаква на 2010 и максималната брзина е поголема или еднаква на 800.0 km/h.
//
// Потоа да се дефинира класа Pilot во која се чуваат следните информации:
//
//     име (низа од карактери не подолга од 20 карактери)
//     презиме (низа од карактери не подолга од 20 карактери)
//     број на часови на летање (цел број)
//     авион (објект од класа Airplane)
//
// Да се креира default конструктор, конструктор со аргументи, деструктор и доколку има потреба get методи. Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат: (име) (презиме) ((часови) flight hours - Experienced Pilot / Junior Pilot) flies: (информации за авионот)
//
// Пилотот се смета за искусен доколку бројот на часови на летање е поголем или еднаков на 1000.
//
// ДА НЕ СЕ МЕНУВА MAIN ФУНКЦИЈАТА!!!
//
// ----------------
//
// Define a class Airplane that will store data about an airplane:
//
//     model (a string of characters no longer than 20 characters)
//     capacity (integer)
//     maximum speed in km/h (decimal number)
//     year of production (integer)
//
// For the class, define a default constructor, a constructor with arguments, a copy constructor, a destructor, and get methods if needed. Also define a print function that prints information about the class in the following format: (model) capacity: (capacity) max speed: (speed)km/h produced in: (year) [Modern Aircraft / Older Aircraft]
//
// An airplane is considered modern if the year of production is greater than or equal to 2010 and the maximum speed is greater than or equal to 800.0 km/h.
//
// Then define a class Pilot that will store the following information:
//
//     first name (a string of characters no longer than 20 characters)
//     last name (a string of characters no longer than 20 characters)
//     number of flight hours (integer)
//     airplane (an object of class Airplane)
//
// Define a default constructor, a constructor with arguments, a destructor, and get methods if needed. Also define a print function that prints information about the class in the following format: (first name) (last name) ((hours) flight hours - Experienced Pilot / Junior Pilot) flies: (airplane information)
//
// A pilot is considered experienced if the number of flight hours is greater than or equal to 1000.
//
// DO NOT MODIFY THE MAIN FUNCTION!!!
//
//
//
// For example:
// Input 	Result
//
// 1
// Boeing737
// 189
// 842.0
// 2015
// 4500
// Viktor
// Blazevski
//
//
//
// Viktor Blazevski (4500 flight hours - Experienced Pilot) flies:
// Boeing737 capacity: 189 max speed: 842km/h produced in: 2015 [Modern Aircraft]

#include <iostream>

using namespace std;

//YOUR CODE HERE


//DO NOT CHANGE THE MAIN FUNCTION
int main() {
    char model[20];
    int capacity;
    double maxSpeedKmh;
    int yearProduced;
    int flightHours;
    char firstName[20];
    char lastName[20];
    int testCase;

    cin >> testCase;
    cin >> model;
    cin >> capacity;
    cin >> maxSpeedKmh;
    cin >> yearProduced;
    cin >> flightHours;
    cin >> firstName;
    cin >> lastName;

    if (testCase == 1) {
        Airplane airplane(model, capacity, maxSpeedKmh, yearProduced);
        Pilot pilot(firstName, lastName, flightHours, airplane);
        pilot.print();
    }
    if (testCase == 2) {
        Airplane airplane(Airplane(model, capacity, maxSpeedKmh, yearProduced));
        Pilot pilot(firstName, lastName, flightHours, airplane);
        pilot.print();
    }

    return 0;
}
