// Да се дефинира класа Movie за која се чуваат:
//
//     title – име на филмот (низа од карактери)
//
//     duration – времетраење во минути (цел број)
//
//     rating – рејтинг (цел број, 1–10)
//
// Да се дефинираат:
//
//     default конструктор
//
//     конструктор со аргументи
//     copy конструктор
//
// Да се дефинира метод:
//
//     double popularity() кој враќа: duration * rating
//
// Да се дефинира метод:
//
//     void display() кој печати:
//     [title] [duration] [rating]
//
// Да се дефинира класа CinemaProgram за која се чуваат:
//
//     name – име на програмата
//
//     movies – низа од 5 филмови
//
//     daysRunning – колку дена трае програмата (цел број)
//
//     num_programs – статичка променлива
//
// Да се дефинираат:
//
//     default конструктор
//
//     конструктор со аргументи
//
//     деструктор
//
// Да се дефинира метод:
//
//     double totalPopularity() → збир од popularity() за сите филмови
//
// Да се дефинира метод:
//
//     void display() кој печати:
//     [name]: [daysRunning] days.
//
// Надвор од класите да се дефинира:
//
// void sortPrograms(CinemaProgram programs[], int n)
//
// која:
//
//     сортира според: totalPopularity() во опаѓачки редослед
//
//     ги печати програмите
//
//  Мора да биде friend.
//
// НЕ ЈА МЕНУВАЈТЕ MAIN() ФУНКЦИЈАТА
//
// --------------------------------------------------------------------------------
//
// Define a class Movie that stores:
//
//     title – movie title (array of characters)
//
//     duration – duration in minutes (integer)
//
//     rating – rating (integer, 1–10)
//
// Define:
//
//     default constructor
//
//     constructor with arguments
//
//     copy constructor
//
// Define a method:
//
//     double popularity() that returns: duration * rating
//
// Define a method:
//
//     void display() that prints:
//     [title] [duration] [rating]
//
// Define a class CinemaProgram that stores:
//
//     name – program name
//
//     movies – array of 5 movies
//
//     daysRunning – number of days the program runs (integer)
//
//     num_programs – static variable
//
// Define:
//
//     default constructor
//
//     constructor with arguments
//
//     destructor
//
// Define a method:
//
//     double totalPopularity() → sum of popularity() for all movies
//
// Define a method:
//
//     void display() that prints:
//     [name]: [daysRunning] days.
//
// Outside the classes, define:
//
//     void sortPrograms(CinemaProgram programs[], int n)
//
// which:
//
//     sorts by: totalPopularity() in descending order
//
//     prints the programs
//
// Must be declared as a friend function.
//
// DO NOT MODIFY THE main() FUNCTION
//
// For example:
// Input 	Result
//
// 2
// ProgramA
// 5
// Movie1 100 5
// Movie2 120 6
// Movie3 90 7
// Movie4 110 8
// Movie5 80 9
// ProgramB
// 12
// M1 100 10
// M2 100 10
// M3 100 10
// M4 100 10
// M5 100 10
// 1
//
//
//
// ProgramB: 12 days.
// ProgramA: 5 days.

#include <iostream>
#include <cstring>
using namespace std;

// YOUR CODE HERE


//  DO NOT CHANGE THE MAIN FUNCTION

int main() {
    int n;
    cin >> n;

    CinemaProgram programs[100];

    for (int i = 0; i < n; i++) {
        char name[50];
        int days;

        cin >> name;
        cin >> days;

        Movie movies[5];

        for (int j = 0; j < 5; j++) {
            char title[50];
            int duration, rating;

            cin >> title >> duration >> rating;

            movies[j] = Movie(title, duration, rating);
        }

        programs[i] = CinemaProgram(name, movies, days);
    }

    bool shortOnly;
    cin >> shortOnly;

    sortPrograms(programs, n);

    return 0;
}
