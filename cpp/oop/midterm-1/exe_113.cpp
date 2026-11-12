// Create a class Film for representing films (movies). The class should contain: (5 points)
//
// Movie title (array of 100 characters)
// Duration (integer)
// Price (decimal number)
// Is there a student discount (1-yes, 0-no)
//
// Create a class FilmFestival, that will contain: (10 points)
//
// Name of the festival (array of 100 characters)
// Place (where the festival is held) (array of 100 characters)
// List of films that will be presented on the festival (array of no more than 100 elements of type Film)
// Number of elements in the list (integer)
//
// Write a function print that will print the information for each film in a given film festival (5 points) in the following format:
//
// [Name of the festival] [Place]
// [Title1] [Duration1] [Price1]
// [Title2] [Duration2] [Price2]
// ...
//
// Write a function BestFestival that accepts an array of FilmFestival variables and number of festivals in the array and will print the name of the festival that is cheapest for students and the place it is held. For the cheapest festival is considered the one that has most films that have student discount. If there is more that one festival with these characteristics than print the festival that has the longest duration of all the films. (20 points)
//
// Complete functionality of the whole program (5 points)
//
// For example:
// Input 	Result
//
// 2
// SkopjeFilmFestival
// Skopje
// 3
// Nokturama
// 130
// 200
// 1
// Surovo
// 98
// 150
// 0
// Vodolija
// 140
// 190
// 1
// Cinedays
// Skopje
// 3
// Trampolina
// 82
// 150
// 1
// Zora
// 85
// 150
// 1
// Zaba
// 78
// 150
// 0
//
//
//
// SkopjeFilmFestival Skopje
// Nokturama 130 200.00
// Surovo 98 150.00
// Vodolija 140 190.00
// Cinedays Skopje
// Trampolina 82 150.00
// Zora 85 150.00
// Zaba 78 150.00
// Najdobar festival: SkopjeFilmFestival Skopje

#include <iostream>
using namespace std;

int main() {
    int i, j, n;
    FilmFestival ff[50];

    cin >> n;

    for (i = 0; i < n; i++) {
        char festivalName[100];
        char festivalPlace[100];
        int numberOfFilms;

        /* name of the festival */
        cin >> festivalName;

        /* place it is held */
        cin >> festivalPlace;

        /* number of movies */
        cin >> numberOfFilms;

        strcpy(ff[i].name, festivalName);
        strcpy(ff[i].place, festivalPlace);
        ff[i].no = numberOfFilms;

        for (j = 0; j < ff[i].no; j++) {
            char filmName[100];
            int filmTime;
            float filmPrice;
            int filmDiscount;

            /* title of the movie */
            cin >> filmName;

            /* duration */
            cin >> filmTime;

            /* price */
            cin >> filmPrice;

            /* discount */
            cin >> filmDiscount;

            ff[i].films[j].setFilm(filmName, filmTime, filmPrice, filmDiscount);
        }
    }

    for (i = 0; i < n; ++i) {
        print(ff[i]);
    }

    bestFestival(ff, n);

    return 0;
}
