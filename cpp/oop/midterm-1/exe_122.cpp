// Define a class Goal that keeps information for:
//
// the goal scorer (dynamically allocated array of characters),
// time (the minute) of the goal scoring event (integer),
// name of the team that scored the goal (char array max 50).
//
// For this class implement:
//
// constructor with all three arguments
// operator << for printing on ostream an object of class Goal (print the minute and the name)
// operator ++ (postfix) notation for incrementing the minute for one,
// operator -- (prefix) notation for decrementing the minute for one.
//
// Also create a class Game that keeps dynamically allocated array of objects from the class Goal and the names of the teams that play that game (two char arrays of 50). For this class implement:
//
// constructor with two arguments the names of the teams that play the game
// the unary operator += for adding an object of class Goal in the array of objects. If the name of the object from the class Goal is not equal to the one of the names of the teams that play the game then throw an exception of type InvalidTeamName. Handling the exception should be in the appropriate place in the main function, by printing the message Invalid team name: [the_name]
// operator << for printing on the ostream the teams that play the game and all the scorers.
//
// For example:
// Input 	Result
//
// ARS
// MUN
// 5
// Rooney
// 17
// MUN
// Ibrahimovic
// 20
// MUN
// Ozil
// 44
// ARS
// Sanchez
// 77
// ARS
// Pogba
// 91
// MUN
//
//
//
// ARS - MUN
// 17 Rooney
// 20 Ibrahimovic
// 44 Ozil
// 77 Sanchez
// 91 Pogba

#include <iostream>
#include <cstring>
using namespace std;


// Your code here


int main() {
    char team1[50];
    char team2[50];
    cin >> team1;
    cin >> team2;
    Game n(team1, team2);
    int x;
    cin >> x;
    char player[100];
    int m;
    for (int i = 0; i < x; ++i) {
        cin >> player;
        cin >> m;
        cin >> team1;
        Goal g(player, m, team1);
        try {
            n += g;
        } catch (InvalidTeamName &e) {
            cout << "Invalid team name: " << e.what() << endl;
        }
    }
    cout << n << endl;
    return 0;
}
