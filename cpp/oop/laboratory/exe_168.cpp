// Да се дефинира класа Performer за која се чуваат следните податоци:
//
//     name – име на изведувачот (низа од карактери)
//     songs – број на песни кои ќе ги изведе (цел број)
//     rating – оценка на настапот од 0 до 10 (double)
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//
// Во класата да се имплементираат следните методи:
//
//     double showScore() - кој го пресметува резултатот на настапот според формулата: songs*rating
//     void display() - кој ги печати податоците за изведувачот во формат: [име] [број на песни] [рејтинг]
//
//
// Да се дефинира класа Festival за која се чуваат:
//
//     name – име на фестивалот (низа од карактери)
//     performers – низа од 4 изведувачи
//     days – број на денови колку што трае фестивалот (цел број)
//     num_festivals – static поле кое го чува бројот на фестивали во програмата
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор со аргументи
//     деструктор
//
// Секој од овие методи треба да го ажурира бројот на фестивали.
//
// Во класата да се дефинираат методите
//
//     double totalScore() - кој ја враќа вкупната вредност на сите настапи (сума од showScore())
//     void display() - кој печати [име] [број на денови].
//
// Да се дефинира надворешна функција void sortFestivalByDays(Festival festivals[], int n), која прима низа од фестивали и ги печати во опаѓачки редослед според бројот на денови.
//
// Main функцијата да не се менува!
//
// ---------------------------------------------------------------------------------------------------------------------------------
//
// Define a class Performer which stores the following data:
//
//     name – name of the performer (array of characters)
//
//     songs – number of songs they will perform (integer)
//
//     rating – rating of the performance from 0 to 10 (double)
//
// For the class, define the following:
//
//     Default constructor
//
//     Constructor with arguments
//
//     Copy constructor
//
// Implement the following methods in the class:
//
//     double showScore() – calculates the performance score using the formula: songs*rating
//
//     void display() – prints the performer's data in the format: [name] [number of songs] [rating]
//
// Define a class Festival which stores:
//
//     name – name of the festival (array of characters)
//
//     performers – an array of 4 performers
//
//     days – number of days the festival lasts (integer)
//
//     num_festivals – a static field that stores the total number of festivals in the program
//
// For the class, define the following:
//
//     Default constructor
//
//     Constructor with arguments
//
//     Destructor
//
//     Each of these methods should update the num_festivals count.
//
// Define the following methods in the class:
//
//     double totalScore() – returns the total value of all performances (sum of showScore()).
//
//     void display() – prints the festival data in the format: [name] [number of days].
//
// Define an external function void sortFestivalByDays(Festival festivals[], int n), which receives an array of festivals and prints them in descending order based on the number of days.
//
// The Main function must not be changed!
//
// For example:
// Input 	Result
//
// 0
// Coldplay 10 9.5
//
//
//
// Testing Performer constructors:
// Coldplay 10 9.5
// Coldplay 10 9.5
//
// 2
// RockFest 3
// Alice 4 7.5
// Bob 3 9.0
// Charlie 5 8.0
// Diana 2 6.5
//
//
//
// Testing Festival constructor:
// RockFest: 3
// 110

#include <iostream>
#include <cstring>
using namespace std;

// your code here


// do NOT change the following code

int main() {
    int test_case;
    cin >> test_case;

    char performer_name[100];
    int songs;
    double rating;

    char festival_name[100];
    int days;

    if (test_case == 0) {
        cout << "Testing Performer constructors:" << endl;
        cin >> performer_name >> songs >> rating;

        Performer p1(performer_name, songs, rating);
        Performer p2(p1);

        p1.display();
        p2.display();
    } else if (test_case == 1) {
        cout << "Testing showScore:" << endl;
        for (int i = 0; i < 4; i++) {
            cin >> performer_name >> songs >> rating;
            Performer p(performer_name, songs, rating);
            cout << p.showScore() << endl;
        }
    } else if (test_case == 2) {
        cout << "Testing Festival constructor:" << endl;
        Performer performers[4];

        cin >> festival_name >> days;
        for (int i = 0; i < 4; i++) {
            cin >> performer_name >> songs >> rating;
            performers[i] = Performer(performer_name, songs, rating);
        }

        Festival f(festival_name, performers, days);
        f.display();
        cout << f.totalScore() << endl;
    } else if (test_case == 3) {
        cout << "Testing static field:" << endl;
        Performer performers[4];

        cin >> festival_name >> days;
        for (int i = 0; i < 4; i++) {
            cin >> performer_name >> songs >> rating;
            performers[i] = Performer(performer_name, songs, rating);
        }

        // Create 8 festivals, but only 3 should remain in scope
        for (int i = 0; i < 8; i++) {
            Festival f(festival_name, performers, days);
        }

        Festival f1(festival_name, performers, days);
        Festival f2(festival_name, performers, days);
        Festival f3(festival_name, performers, days);

        if (Festival::getNumFestivals() == 3)
            cout << "OK" << endl;
        else
            cout << "Static field error" << endl;
    } else if (test_case == 4) {
        cout << "Testing sort:" << endl;

        int m;
        cin >> m;
        Festival festivals[m];

        for (int i = 0; i < m; i++) {
            Performer performers[4];

            cin >> festival_name >> days;
            for (int j = 0; j < 4; j++) {
                cin >> performer_name >> songs >> rating;
                performers[j] = Performer(performer_name, songs, rating);
            }

            festivals[i] = Festival(festival_name, performers, days);
        }

        sortFestivalsByDays(festivals, m);
    }

    return 0;
}
