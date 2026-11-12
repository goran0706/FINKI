// Дефинирајте класа Movie која складира:
//
//     динамички доделен низа од знаци за насловот на филмот
//     низа од максимум 40 знаци за жанрот
//     просечна оценка на корисниците (double)
//     просечна оценка на критичарите (double)
//     број на прегледи во милиони (double)
//
//
//
// За класата дефинирајте:
//
//     default конструктор и конструктор со аргументи
//     copy конструктор и оператор за доделување (=)
//     деструктор
//
// Имплементирајте ги следниве методи:
//
// double score() кој го пресметува резултатот на филмот како:
//
// 50% оценка на корисниците + 40% оценка на критичарите + 10% прегледи
//
// void print()  кој го печати филмот во формат:
//
// -------------------------------------------------------
//
// Title - Genre
//
// User rating: X Critic rating: Y Views: Z Score: S
//
// -------------------------------------------------------
//
// Од оваа класа изведете класа PremiumMovie
//
// Оваа класа дополнително има:
//
//     просечна оценка од фестивалски проекции (double)
//     број на освоени награди (int)
//     број на фестивалски настапи (int)
//
//
//
// За изведената класа дефинирајте:
//
//     default конструктор
//     конструктор кој прифаќа објект за Movie + дополнителни атрибути
//     конструктор кој ги прифаќа сите параметри
//     copy конструктор, оператор за доделување (=) и деструктор
//
//
//
// Имплементирајте го методот:
//
// double festivalScore() пресметано како:
//
// 60% рејтинг на фестивалот + 20% награди + 20% појавувања
//
// Препокријте ги следниве методи:
//
// double score()
//
// Треба да врати:
//
// просек од:
//
// - основен резултат на филмот
//
// - резултат на фестивалот
//
// void print()
//
// Покрај основните информации за филмот, испечатете и:
//
// Festival Score: X
// Final Score: Y
//
// Define a class Movie which stores:
//
//     dynamically allocated array of characters for the movie title
//     array of maximum 40 characters for the genre
//     average user rating (double)
//     average critic rating (double)
//     number of views in millions (double)
//
//
//
// For the class define:
//
//     default constructor and constructor with arguments
//     copy constructor and assignment operator (=)
//     destructor
//
//
//
// Implement the following methods:
//
// double score() that calculates the movie score as:
//
// 50% user rating + 40% critic rating + 10% views
//
// void print() that prints the movie in the format:
//
// -------------------------------------------------------
//
// Title - Genre
//
// User rating: X Critic rating: Y Views: Z Score: S
//
// -------------------------------------------------------
//
// From this class derive a class PremiumMovie
//
// This class additionally stores:
//
//     average rating from festival screenings (double)
//     number of awards won (int)
//     number of festival appearances (int)
//
//
//
// For the derived class define:
//
//     default constructor
//     constructor that accepts a Movie object + additional attributes
//     constructor that accepts all parameters
//     copy constructor, assignment operator (=), and destructor
//
//
//
// Implement the method:
//
// double festivalScore() calculated as:
//
// 60% festival rating + 20% awards + 20% appearances
//
// Override the following methods:
//
// double score()
//
// Should return:
//
// average of:
// - base movie score
// - festival score
//
// void print()
//
// Besides the basic movie information, also print:
//
// Festival Score: X
// Final Score: Y
//
// For example:
// Input 	Result
//
// 1
// 1
// Inception
// Sci-Fi
// 9 8.5 100
//
//
//
// Inception - Sci-Fi
// User rating: 9 Critic rating: 8.5 Views: 100 Score: 17.90
//
// 1
// 2
// Interstellar
// Sci-Fi
// 9 9 150
// 8 5 10
//
//
//
// Interstellar - Sci-Fi
// User rating: 9 Critic rating: 9 Views: 150 Score: 15.45
// Festival Score: 7.80
// Final Score: 15.45
//
// 2
// 1
// A
// Drama
// 1 1 1
// 1
// A
// Drama
// 1 1 1
//
//
//
// A - Drama
// User rating: 1 Critic rating: 1 Views: 1 Score: 1.00
// A - Drama
// User rating: 1.00 Critic rating: 1.00 Views: 1.00 Score: 1.00
//
// 1
// 2
// Zero
// None
// 0 0 0
// 0 0 0
//
//
//
// Zero - None
// User rating: 0 Critic rating: 0 Views: 0 Score: 0.00
// Festival Score: 0.00
// Final Score: 0.00

#include <iostream>
#include <cstring>
#include <iomanip>
using namespace std;


//Your code here...


int main() {
    int n;
    cin >> n;
    cin.ignore();

    for (int i = 0; i < n; i++) {
        int type;
        cin >> type;
        cin.ignore();

        if (type == 1) {
            // Movie
            char title[100], genre[40];
            double u, c, v;

            cin.getline(title, 100);
            cin.getline(genre, 40);
            cin >> u >> c >> v;
            cin.ignore();

            Movie m(title, genre, u, c, v);
            m.print();
        } else {
            // PremiumMovie
            char title[100], genre[40];
            double u, c, v, f;
            int a, ap;

            cin.getline(title, 100);
            cin.getline(genre, 40);
            cin >> u >> c >> v;
            cin >> f >> a >> ap;
            cin.ignore();

            PremiumMovie pm(title, genre, u, c, v, f, a, ap);
            pm.print();
        }
    }

    return 0;
}
