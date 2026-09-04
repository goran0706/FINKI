// Како сопственик на кино, ги чувате податоците за вашите гости (Guest) и филмовите кои моментално се прикажуваат (Movie). Треба да ги дефинирате класите и функциите за коректна имплементација на системот. Не го менувајте дадениот код.
//
// Дефинирајте класа Movie со приватни податочни членки:
//
//     title — наслов на филмот (низа од знаци);
//
//     genre — жанр на филмот (низа од знаци);
//
//     totalWatchedMovies — вкупен број на изгледани филмови на сите гости (static int).
//
// Дополнете ја класата со default конструктор, конструктор со аргументи и copy конструктор, како и следните функции:
//
//     print — ги печати насловот и жанрот на филмот секој во нов ред;
//
//     incrementTotalWatchedMovies — ја зголемува вредноста на totalWatchedMovies за 1.
//
// Потребно е да работите без get/set методи.
//
// Дефинирајте класа Guest со приватни податочни членки:
//
//     name — име на гостинот (низа од знаци);
//
//     watchedMovies — низа од филмови изгледани од овој гостин (максимална големина е 50);
//
//     n — број на изгледани филмови (иницијално поставен на 0).
//
// Дополнете ја класата со default конструктор и конструктор со аргумент name. Напишете ги функциите:
//
//     print — го печати името на гостинот и сите филмови кои ги изгледал во форматот даден во тест примерите;
//
//     void watchMovie(const Movie& movie) — го додава филмот во низата watchedMovies и ја зголемува вредноста на totalWatchedMovies.
//
// На крај, напишете функција void showMoviePopularity(Guest guests[], int n, Movie movies[], int m) која директно пристапува до приватните членки на двете класи, и за секој филм ги печати неговиот наслов и жанр, како и процентот на гости кои го изгледале. На крај да се испечати просечната стапка на гледање со формулата totalWatchedMovies * 100.0 / (n * m).
//
// Форматот на печатењето е даден во тест примерите.
//
// As the owner of a cinema, you keep track of your guests (Guest) and the movies currently showing (Movie). You need to define the classes and functions for the correct implementation of the system. Do not modify the given code.
//
// Define a class Movie with private data members:
//
//     title — title of the movie (char array);
//
//     genre — genre of the movie (char array);
//
//     totalWatchedMovies — total number of movie watches across all guests (static int).
//
// Supplement the class with a default constructor, a constructor with arguments, and a copy constructor, as well as the following functions:
//
//     print — prints the title and genre of the movie each on a new line;
//
//     incrementTotalWatchedMovies — increments totalWatchedMovies by 1.
//
// You are required to work without get/set methods.
//
// Define a class Guest with private data members:
//
//     name — name of the guest (char array);
//
//     watchedMovies — array of movies watched by this guest (maximum size 50);
//
//     n — number of movies watched (initially set to 0).
//
// Supplement the class with a default constructor and a constructor with argument name. Write the functions:
//
//     print — prints the guest's name and all movies they have watched in the format shown in the test examples;
//
//     void watchMovie(const Movie& movie) — adds the movie to the watchedMovies array and increments totalWatchedMovies.
//
// Finally, write a function void showMoviePopularity(Guest guests[], int n, Movie movies[], int m) which directly accesses the private members of both classes, and for each movie prints its title and genre, as well as the percentage of guests who have watched it. At the end, print the average watch rate using the formula totalWatchedMovies * 100.0 / (n * m).
//
// The format of output is given in the test examples.
//
// For example:
// Input 	Result
//
// TestCaseG
// 4
// ---
// Martin Kocev
// Jovana Blazheva
// Angela Paunova
// Andrej Stanoev
// 4
// ---
// The Butterfly Effect
// Science Fiction, Thriller
// Requiem For A Dream
// Psychological Horror
// Mr Bean's Holiday
// Comedy
// Project Hail Mary
// Science Fiction
// 6
// ---
// 1 1
// 2 2
// 3 3
// 4 4
// 1 2
// 3 1
//
//
//
// Guest: Martin Kocev
// Watched movies:
// The Butterfly Effect
// Science Fiction, Thriller
// Requiem For A Dream
// Psychological Horror
// Guest: Jovana Blazheva
// Watched movies:
// Requiem For A Dream
// Psychological Horror
// Guest: Angela Paunova
// Watched movies:
// Mr Bean's Holiday
// Comedy
// The Butterfly Effect
// Science Fiction, Thriller
// Guest: Andrej Stanoev
// Watched movies:
// Project Hail Mary
// Science Fiction

#include <iostream>
#include <cstring>
using namespace std;

//TODO: Implement "Guest" and "Movie" classes

//TODO: Implement the showMoviePopularity function

// Don't modify
int main() {
    char testcase[100];
    cin.getline(testcase, 100);

    int n;
    cin >> n;
    cin.ignore();

    char ignore[100];
    cin.getline(ignore, 100);
    Guest guests[100];
    for (int i = 0; i < n; ++i) {
        char name[100];
        cin >> name;
        guests[i] = Guest(name);
    }

    int m;
    cin >> m;
    cin.ignore();

    cin.getline(ignore, 100);
    Movie movies[100];
    for (int i = 0; i < m; ++i) {
        char title[100], genre[100];
        cin.getline(title, 100);
        cin.getline(genre, 100);
        movies[i] = Movie(title, genre);
    }

    int k;
    cin >> k;
    cin.ignore();

    cin.getline(ignore, 100);
    for (int i = 0; i < k; ++i) {
        int numGuest, numMovie;
        cin >> numGuest >> numMovie;
        numGuest -= 1;
        numMovie -= 1;
        guests[numGuest].watchMovie(movies[numMovie]);
    }

    if (testcase[8] == 'M') {
        // Testing Movie methods
        for (int i = 0; i < m; ++i)
            movies[i].print();
        Movie::incrementTotalWatchedMovies();
    } else if (testcase[8] == 'G') {
        // Testing Guest methods
        for (int i = 0; i < n; ++i)
            guests[i].print();
    } else {
        // Testing showMoviePopularity
        showMoviePopularity(guests, n, movies, m);
    }

    return 0;
}

