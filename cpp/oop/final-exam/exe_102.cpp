/*
Да се дополни претходната (влезна) задача со следните барања:

Барања за класата Player:

    Метод int contribution() const кој го пресметува придонесот на играчот според формулата: contribution = 2 * голови + асистенции Соодветно треба да се надополни и методот print() според пресметаниот придонес за играчот.

Барања за класата Team:

    Метод Player bestPlayer() const кој го враќа играчот со најголем contribution(). Доколку постојат повеќе играчи со ист придонес, тогаш најдобриот се пресметува според критериумите дадени во следниот редослед: прво поголем број асистенции, потоа помал број одиграни натпревари, на крај прв по редослед на нивното појавување.
    Метод void readFromFile(ifstream &in) кој ги чита податоците за тимот од еден отворен влезен поток. Пред читањето, методот треба да ja избрише постоечката низа од играчи (доколку постои). Форматот на податоците е:

    Vardar
    3
    Pulisic 12 7 20
    Ronaldo 25 5 24
    Messi 20 15 22

    (прв ред — име на тим, втор ред — број на играчи, потоа по еден ред за секој играч: име, голови, асистенции, натпревари; да се претпостави дека имињата на играчите немаат празни места)

Да се имплементираат следните надворешни функции:

Team operator+(const Team& t, const Player& p) — враќа нов тим (копија на t), со додаден играч p, без да го менува оригиналниот тим.
bool operator>(const Team& t1, const Team& t2) — ги споредува двата тима по teamEfficiency(); тимот со поголема ефикасност се смета за поголем. Ако постојат тимови со иста ефикасност, за поефикасен се смета тимот со поголем број играчи.
Player* getTopScorers(Team* teams, int teamCount, int minGoals, int& resultSize) Функцијата ги поминува сите играчи од сите дадени тимови и враќа динамички алоцирана низа од Player објекти (копии) за оние чиј број на голови е најмалку minGoals (без сортирање — по редослед на нивно појавување). Во resultSize се запишува бројот на пронајдени играчи. Доколку нема играч кој го задоволува условот, функцијата враќа nullptr, а resultSize се поставува на 0.
void writeScorersToFile(const Player* players, int count, const string& filename) Функцијата креира (или презапишува) датотека со име filename и во неа ги запишува информациите за дадените играчи (низата players со должина count), во ист формат како методот Player::print().

-------------------------------------------------------------------------

Extend the previous task with the following requirements:

Requirements for the Player class:

    Method int contribution() const that calculates the player's contribution according to the formula: contribution = 2 * goals + assists. The print() method should be updated accordingly to display the calculated contribution for the player.

Requirements for the Team class:

    Method Player bestPlayer() const that returns the player with the highest contribution(). If there are multiple players with the same contribution, the best player is determined according to the following criteria in order: first by a higher number of assists, then by a lower number of matches played, and finally by the order of their appearance.
    Method void readFromFile(ifstream &in) that reads the team data from an open input stream. Before reading, the method should delete the existing player array (if any). The data format is:

    Vardar
    3
    Pulisic 12 7 20
    Ronaldo 25 5 24
    Messi 20 15 22

    (first line — team name, second line — number of players, followed by one line for each player: player name, goals, assists, matches played; assume that player names do not contain spaces)

Implement the following global functions:
Team operator+(const Team& t, const Player& p) — returns a new team (a copy of t) with the player p added, without modifying the original team.
bool operator>(const Team& t1, const Team& t2) — compares the two teams by teamEfficiency(); the team with higher efficiency is considered greater. If the teams have the same efficiency, the more efficient team is the one with a larger number of players.
Player* getTopScorers(Team* teams, int teamCount, int minGoals, int& resultSize) The function traverses all players from all given teams and returns a dynamically allocated array of Player objects (copies) for those whose number of goals is at least minGoals (without sorting — in the order of their appearance). The number of found players is stored in resultSize. If no player satisfies the condition, the function returns nullptr, and resultSize is set to 0.
void writeScorersToFile(const Player* players, int count, const string& filename) The function creates (or overwrites) a file named filename and writes the information about the given players (the players array of length count) into it, using the same format as the Player::print() method.

For example:

Player p("Messi", 20, 15, 22);
cout << p.contribution() << endl;

55
----------------------------------
Player p("Ronaldo", 25, 5, 24);
p.print();


Ronaldo - goals: 25, assists: 5, matches: 24, contribution: 55
----------------------------------
Team t("T");
t += Player("A", 10, 2, 15);
t += Player("B",  5, 8, 10);
t += Player("C",  3, 3, 20);
t.bestPlayer().print();


A - goals: 10, assists: 2, matches: 15, contribution: 22
----------------------------------
Team t("T");
t += Player("A", 10, 5, 15);
t += Player("B",  8, 9, 12);
t.bestPlayer().print();


B - goals: 8, assists: 9, matches: 12, contribution: 25
----------------------------------
Team t("T");
t += Player("A", 9, 7, 20);
t += Player("B", 9, 7, 15);
t.bestPlayer().print();


B - goals: 9, assists: 7, matches: 15, contribution: 25
----------------------------------
Team t("T");
t += Player("A", 9, 7, 15);
t += Player("B", 9, 7, 15);
t.bestPlayer().print();


A - goals: 9, assists: 7, matches: 15, contribution: 25
----------------------------------
ofstream out("team.txt");
out << "Vardar" << endl;
out << 3 << endl;
out << "Pulisic 12 7 20" << endl;
out << "Ronaldo 25 5 24" << endl;
out << "Messi 20 15 22" << endl;
out.close();

Team t;
ifstream in("team.txt");
t.readFromFile(in);
in.close();
t.print();


Team: Vardar
Pulisic - goals: 12, assists: 7, matches: 20, contribution: 31
Ronaldo - goals: 25, assists: 5, matches: 24, contribution: 55
Messi - goals: 20, assists: 15, matches: 22, contribution: 55
Team efficiency: 1.27
----------------------------------
Team t("Old");
t += Player("Ghost", 5, 5, 5);

ofstream out("team.txt");
out << "Vardar" << endl;
out << 2 << endl;
out << "Messi 20 15 22" << endl;
out << "Ronaldo 25 5 24" << endl;
out.close();

ifstream in("team.txt");
t.readFromFile(in);
in.close();
cout << t.getPlayerCount() << endl;
t.print();


2
Team: Vardar
Messi - goals: 20, assists: 15, matches: 22, contribution: 55
Ronaldo - goals: 25, assists: 5, matches: 24, contribution: 55
Team efficiency: 1.41
----------------------------------
Team t1("T1");
t1 += Player("Messi", 20, 15, 22);

Team t2 = t1 + Player("Ronaldo", 25, 5, 24);

cout << t1.getPlayerCount() << endl;
cout << t2.getPlayerCount() << endl;


1
2
----------------------------------
Team t1("T1"), t2("T2");
t1 += Player("A", 20, 10, 10);
t2 += Player("B",  5,  5, 10);
cout << (t1 > t2 ? "yes" : "no") << endl;
cout << (t2 > t1 ? "yes" : "no") << endl;


yes
no
----------------------------------
Team t1("T1"), t2("T2");
t1 += Player("A", 10, 10, 10);
t1 += Player("B", 10, 10, 10);
t2 += Player("C", 10, 10, 10);
cout << (t1 > t2 ? "yes" : "no") << endl;
cout << (t2 > t1 ? "yes" : "no") << endl;


yes
no
----------------------------------
Team teams[2];
teams[0] += Player("Messi",   20, 15, 22);
teams[0] += Player("Pulisic", 12,  7, 20);
teams[1] += Player("Ronaldo", 25,  5, 24);
teams[1] += Player("Neymar",   8, 12, 18);

int size = 0;
Player *top = getTopScorers(teams, 2, 15, size);
cout << size << endl;
for (int i = 0; i < size; i++) {
    top[i].print();
}
delete [] top;


2
Messi - goals: 20, assists: 15, matches: 22, contribution: 55
Ronaldo - goals: 25, assists: 5, matches: 24, contribution: 55
----------------------------------
Team teams[1];
teams[0] += Player("A", 3, 2, 10);

int size = -1;
Player *top = getTopScorers(teams, 1, 10, size);
cout << (top == nullptr ? "nullptr" : "not null") << endl;
cout << size << endl;


nullptr
0
----------------------------------
Player arr[2] = {
    Player("Messi",   20, 15, 22),
    Player("Ronaldo", 25,  5, 24)
};
writeScorersToFile(arr, 2, "scorers.txt");

ifstream in("scorers.txt");
string line;
while (getline(in, line)) {
    cout << line << endl;
}
in.close();


Messi - goals: 20, assists: 15, matches: 22, contribution: 55
Ronaldo - goals: 25, assists: 5, matches: 24, contribution: 55
*/
