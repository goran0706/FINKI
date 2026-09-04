// Во рамките на една музичка стриминг платформа се чуваат податоци за песни (Song) и слушатели (Listener) кои ги слушаат. Вие треба да ги дефинирате класите и функциите за коректна имплементација на системот. Не го менувајте дадениот код.
//
// За таа цел, дефинирајте класа Song со приватни податочни членки:
//
//     title — наслов на песната (низа од знаци);
//     artist — изведувач на песната (низа од знаци);
//     genre — жанр на песната (низа од знаци), може да биде "Pop", "Rock" или "Jazz";
//     totalPlays — вкупен број на слушања на сите слушатели (static int).
//
// Дополнете ја класата со default конструктор, конструктор со аргументи и copy конструктор, како и следните функции:
//
//     print — функција која го печати насловот, изведувачот и жанрот на песната во нов ред;
//     incrementTotalPlays — статична функција која ја зголемува вредноста на totalPlays за 1.
//
// Потребно е да работите без get/set методи.
//
// Понатаму, дефинирајте класа Listener со приватни податочни членки:
//
//     name — име на слушателот (низа од знаци);
//     playedSongs — низа од слушани песни (максимална големина е 50);
//     n — број на слушани песни (иницијално поставен на 0).
//
// Дополнете ја класата со default конструктор и конструктор со аргумент name. Напишете ги функциите:
//
//     print — функција која го печати името на слушателот и неговите слушани песни во формат даден во тест примерите;
//     void playSong(const Song& song) — функција која во низата playedSongs ја додава песната song и ја зголемува вредноста на totalPlays.
//
// На крај, да се напише функција void showGenreStats(Listener listeners[], int n) која директно пристапува до приватните членки на класите Song и Listener, и за секој жанр ("Pop", "Rock", "Jazz") го пресметува и печати процентот на вкупните слушања кои му припаѓаат. Форматот на печатењето е даден во тест примерите.
//
// --------------
//
// Within a music streaming platform, data is stored about songs (Song) and listeners (Listener) who play them. You need to define the classes and functions for a correct implementation of the system. Do not modify the given code.
//
// For that purpose, define a class Song with private data members:
//
//     title — title of the song (character array);
//     artist — performer of the song (character array);
//     genre — genre of the song (character array), can be "Pop", "Rock" or "Jazz";
//     totalPlays — total number of plays across all listeners (static int).
//
// Complete the class with a default constructor, a constructor with arguments and a copy constructor, as well as the following functions:
//
//     print — a function that prints the title, artist and genre of the song on separate lines;
//     incrementTotalPlays — a static function that increments the value of totalPlays by 1.
//
// You are required to work without get/set methods.
//
// Furthermore, define a class Listener with private data members:
//
//     name — name of the listener (character array);
//     playedSongs — array of played songs (maximum size is 50);
//     n — number of played songs (initially set to 0).
//
// Complete the class with a default constructor and a constructor with argument name. Write the following functions:
//
//     print — a function that prints the name of the listener and their played songs in the format given in the test examples;
//     void playSong(const Song& song) — a function that adds the song song to the playedSongs array and increments the value of totalPlays.
//
// Finally, write a function void showGenreStats(Listener listeners[], int n) that directly accesses the private members of the Song and Listener classes, and for each genre ("Pop", "Rock", "Jazz") computes and prints the percentage of total plays that belong to that genre. The output format is given in the test examples.
//
// For example:
// Input 	Result
//
// Testing Song methods.
// 1
// ALL LISTENERS:
// GuestUser
// 2
// ALL SONGS:
// Bohemian Rhapsody
// Queen
// Rock
// Billie Jean
// Michael Jackson
// Pop
// 2
// LIST OF NUMBERS where listener [num1] has song [num2]:
// 1 1
// 1 2
//
//
//
// Bohemian Rhapsody-Queen-Rock
// Billie Jean-Michael Jackson-Pop
//
// Testing Listener methods.
// 2
// ALL LISTENERS:
// Ana
// Marko
// 4
// ALL SONGS:
// Bohemian Rhapsody
// Queen
// Rock
// Billie Jean
// Michael Jackson
// Pop
// So What
// Miles Davis
// Jazz
// Blinding Lights
// The Weeknd
// Pop
// 5
// LIST OF NUMBERS where listener [num1] has song [num2]:
// 1 1
// 1 3
// 1 4
// 2 2
// 2 1
//
//
//
// Listener: Ana
// Played songs:
// Bohemian Rhapsody-Queen-Rock
// So What-Miles Davis-Jazz
// Blinding Lights-The Weeknd-Pop
//
// Listener: Marko
// Played songs:
// Billie Jean-Michael Jackson-Pop
// Bohemian Rhapsody-Queen-Rock
//
// Testing showGenreStats function.
// 2
// ALL LISTENERS:
// UserA
// UserB
// 3
// ALL SONGS:
// Waterloo
// ABBA
// Pop
// Hotel California
// Eagles
// Rock
// So What
// Miles Davis
// Jazz
// 4
// LIST OF NUMBERS where listener [num1] has song [num2]:
// 1 1
// 1 2
// 2 1
// 2 3
//
//
//
// ------Percentage of plays by genre:
// Pop: 50%
// Rock: 25%
// Jazz: 25%
#include <iostream>
#include <cstring>
using namespace std;


class Song {
};


class Listener {
};

void showGenreStats(Listener listeners[], int n) {
    // TODO
}

// Don't modify
int main() {
    char testcase[100];
    cin.getline(testcase, 100);

    int n;
    cin >> n;
    cin.ignore();
    char ignore[100];
    cin.getline(ignore, 100);

    Listener listeners[100];
    for (int i = 0; i < n; ++i) {
        char name[100];
        cin >> name;
        listeners[i] = Listener(name);
    }

    int m;
    cin >> m;
    cin.ignore();
    cin.getline(ignore, 100);

    Song songs[100];
    for (int i = 0; i < m; ++i) {
        char title[100], artist[100], genre[20];
        cin.getline(title, 100);
        cin.getline(artist, 100);
        cin.getline(genre, 20);
        songs[i] = Song(title, artist, genre);
    }

    int k;
    cin >> k;
    cin.ignore();
    cin.getline(ignore, 100);

    for (int i = 0; i < k; ++i) {
        int numListener, numSong;
        cin >> numListener >> numSong;
        numListener -= 1;
        numSong -= 1;
        listeners[numListener].playSong(songs[numSong]);
    }

    if (testcase[8] == 'S') {
        // Testing Song methods.
        for (int i = 0; i < m; ++i) {
            songs[i].print();
        }
        Song::incrementTotalPlays();
    } else if (testcase[8] == 'L') {
        // Testing Listener methods.
        for (int i = 0; i < n; ++i) {
            listeners[i].print();
        }
    } else {
        // Testing showGenreStats function.
        showGenreStats(listeners, n);
    }

    return 0;
}
