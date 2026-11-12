//
//
// Да се дефинира класа Course во која ќе се чуваат информации за еден курс:
//
//     име на курс (низа од најмногу 100 карактери)
//
//     име на предавач (низа од најмногу 100 карактери)
//
//     област (низа од најмногу 50 карактери)
//
//     број на часови (цел број)
//
//     цена на курсот (цел број)
//
// За класата да се дефинираат:
//
//     default конструктор
//
//     конструктор со аргументи
//
//     copy конструктор
//
//     доколку е потребно да се креираат get методи
//
// Потоа да се дефинира класа TrainingCenter во која ќе се чуваат следните информации:
//
//     име на тренинг центар (низа од најмногу 50 карактери)
//
//     број на курсеви во центарот (цел број)
//
//     низа од курсеви во центарот (низа од објекти од класата Course, со максимална големина 100)
//
// Да се креира конструктор со аргументи за класата.
// Доколку е потребно да се креираат get методи.
//
// Во класата да се имплементира функција:
//
// Course cheapestCourse()
//
// која го враќа најефтиниoт курс во тренинг центарот.
//
// Доколку два или повеќе курсеви имаат иста цена, да се врати курсот со поголем број на часови.
// Доколку и цената и бројот на часови се исти, да се врати првиот таков курс.
//
// НЕ ЈА МЕНУВАЈТЕ MAIN ФУНКЦИЈАТА.
//
// ------------------------------------------------
//
// Define a class Course that will store information about a single course:
//
//     course name (array of maximum 100 characters)
//
//     lecturer name (array of maximum 100 characters)
//
//     field/area (array of maximum 50 characters)
//
//     number of hours (integer)
//
//     course price (integer)
//
// For this class define:
//
//     default constructor
//
//     constructor with arguments
//
//     copy constructor
//
//     create get methods if necessary
//
// Then define a class TrainingCenter that will store the following information:
//
//     training center name (array of maximum 50 characters)
//
//     number of courses in the center (integer)
//
//     array of courses in the center (array of objects from the Course class, with maximum size 100)
//
// For this class:
//
//     create a constructor with arguments
//
//     create get methods if necessary
//
// Inside the class implement the function:
//
// Course cheapestCourse()
//
// which returns the cheapest course in the training center.
//
//     If two or more courses have the same price, return the course with the greater number of hours.
//
//     If both the price and the number of hours are the same, return the first such course.
//
// DO NOT MODIFY THE MAIN FUNCTION.
//
// For example:
// Input 	Result
//
// CodeAcademy 3
// Cplusplus Ivan Programming 40 300
// Java Ana Programming 50 250
// Python Mark DataScience 60 200
//
//
//
// The selected course is: Python taught by Mark in field DataScience, duration 60 hours, price 200.

#include <iostream>
#include <cstring>
using namespace std;

//Your code here
//DO NOT CHANGE THE MAIN FUNCTION

int main() {
    char centerName[50];
    int n;
    cin >> centerName >> n;

    Course courses[100];

    for (int i = 0; i < n; i++) {
        char courseName[100], lecturer[100], field[50];
        int hours, price;
        cin >> courseName >> lecturer >> field >> hours >> price;

        Course c(courseName, lecturer, field, hours, price);
        courses[i] = Course(c);
    }

    TrainingCenter center(centerName, n, courses);
    Course cheapest = center.cheapestCourse();

    cout << "The selected course is: "
            << cheapest.getCourseName() << " taught by "
            << cheapest.getLecturer() << " in field "
            << cheapest.getField() << ", duration "
            << cheapest.getHours() << " hours, price "
            << cheapest.getPrice() << ".";

    return 0;
}
