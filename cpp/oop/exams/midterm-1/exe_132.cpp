// Да се дефинира класа Film во која се чуваат информации за:
//
// Наслов на филмот (низа од најмногу 50 знаци) - default вредност film
// Оценки за филмот (низа од најмногу 50 цели броеви [1-10]) - default вредност []
//
// Број на оценки (цел број) - default вредност 0
//
// За класата да се дефинираат потребните конструктори и:
//
// Да се преоптовари оператор << за печатење - кој печати информации за филмот во форматот како во тест примерите.
// Метод bool isFilmGood() - кој враќа информација дали филмот е добар или не.
//
// Еден филм е добар:
//
// Доколку има барем 6 оценки
// Нема помала оценка од 4
// Има барем една 10ка
//
// Да се дополни главната функција на означеното место со читање на број N, па информации за N филмови и филмовите да се додадат во низата films.
//
// ----
//
// Define a class Film that stores the following information:
//
// Title (character array with a maximum of 50 characters) - default value movie
// Grades (integer array with a maximum of 50 integers [1-10]) - default value []
// Number of grades (integer) - default value 0
//
// For the class define the necessary constructors and:
//
// overload the operator << for printing, which prints films information in the format shown in the test examples
// method bool isMovieGood() – which returns whether the film is good or not.
//
// A book is considered good if:
//
// It has at least 6 grades
// It has at least one grade of 10
// It does not have a grade smaller than 4
//
// Complete the main function at the indicated location by reading an integer N, then reading the information for N films and adding the films to the array films.
//
// For example:
// Input 	Result
//
// 3
// Inception
// 5
// 10 9 10 8 9
// The Godfather
// 4
// 10 10 9 10
// Interstellar
// 6
// 9 8 10 9 9 10
// 1
//
//
//
// Film: Inception
// Grades: 10 9 10 8 9
// Film: The Godfather
// Grades: 10 10 9 10
// Film: Interstellar
// Grades: 9 8 10 9 9 10
//
// 3
// Inception
// 5
// 10 9 10 8 9
// The Godfather
// 4
// 10 10 9 10
// Interstellar
// 6
// 9 8 10 9 9 10
// 2
//
//
//
// BAD FILM
// BAD FILM
// GOOD FILM

#include <cstring>
#include <iostream>
using namespace std;

/*
 * Your code here!
 * */

int main() {
    int N;
    Film films[100];

    //TODO read n books
    /*
     *
     * Your code here.
     *
     * */

    int choice;
    cin >> choice;

    if (choice == 1) {
        for (int i = 0; i < N; ++i) {
            cout << films[i] << endl;
        }
    } else if (choice == 2) {
        for (int i = 0; i < N; ++i) {
            if (films[i].isFilmGood()) {
                cout << "GOOD FILM" << endl;
            } else {
                cout << "BAD FILM" << endl;
            }
        }
    } else {
        cout << "Test default constructor" << endl;
        cout << films[N + 1] << endl;
    }
}

