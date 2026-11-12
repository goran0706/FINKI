/*
Да се дефинира класа Player за претставување информации за фудбалски играч.

Во класата да се чуваат следните информации:

- име на играчот (string)
- број на голови (int)
- број на асистенции (int)
- број на одиграни натпревари (int)

За класата да се имплементираат:

- Потребните конструктори, set и get методи
- Метод void print() const за печатење на информациите за играчот во прегледен формат (име, голови, асистенции, натпревари).

Да се дефинира класа Team за претставување на фудбалски тим.

Во класата да се чуваат следните информации:

- име на тимот (string)
- динамички алоцирана низа од играчи (Player*) (не е дозволено користење на std::vector)
- број на играчи во тимот (int)

За класата да се имплементираат:

- Потребните конструктори, set и get методи
- Метод double teamEfficiency() const кој ja пресметува ефикасноста на тимот според формулата:
  teamEfficiency = (вкупно голови + вкупно асистенции) / вкупно одиграни натпревари
  Доколку тимот нема одиграно ниту еден натпревар, методот враќа 0.
- Метод void print() const кој го печати името на тимот, а потоа и секој играч во форматот зададен во Player::print(). Играчите се печатат во истиот редослед како што се додадени во низата. На крајот да се испечати ефикасноста на тимот.
- Оператор Team& operator+=(const Player& p) кој додава нов играч во тимот (ja проширува динамичката низа за еден елемент).

Во функцијата main() каде што е означено треба од тастатура да се прочитаат информации за N играчи, да се формира тим со тие играчи со користење на операторот +=. Потоа  на стандарден излез да се испечатат податоците за тимот, вклучувајќи ги и податоците за сите негови играчи.

-------------------------------------------------------------------------

Define a class Player for representing information about a football player.

The class should store the following information:

- player name (string)
- number of goals (int)
- number of assists (int)
- number of played matches (int)

For the class, implement:

- The required constructors, set and get methods
- Method void print() const for printing the information about the player in a clear format: name, goals, assists, matches.

Define a class Team for representing a football team.

The class should store the following information:

- team name (string)
- dynamically allocated array of players (Player*) (std::vector is not allowed)
- number of players in the team (int)

For the class, implement:

- The required constructors, set and get methods
- Method double teamEfficiency() const which calculates the efficiency of the team using the formula:

teamEfficiency = (total goals + total assists) / total played matches

If the team has not played any matches, the method returns 0.

- Method void print() const which prints the name of the team, and then each player in the format defined in Player::print()P. The players are printed in the same order in which they were added to the array. At the end, the team efficiency should be printed.
- Operator Team& operator+=(const Player& p) which adds a new player to the team by expanding the dynamic array by one element.

In the main() function where it is marked, read information for N players from standard input, create a team with those players using the += operator, and then print the data about the team to standard output, including the data about all of its players.

За печатење користете / For printing use : cout << "Team efficiency: " << fixed << setprecision(2) << teamEfficiency() << endl;

For example:

1
FK_Dolno_Lisiche
1
Bogoljub 30 10 20

Team: FK_Dolno_Lisiche
Bogoljub - goals: 30, assists: 10, matches: 20
Team efficiency: 2.00
----

1
FK_Mariovo_United
3
Petkoslav 15 7 22
Stojancho 12 9 21
Trpche 10 5 20

Team: FK_Mariovo_United
Petkoslav - goals: 15, assists: 7, matches: 22
Stojancho - goals: 12, assists: 9, matches: 21
Trpche - goals: 10, assists: 5, matches: 20
Team efficiency: 0.92
----

1
FK_Novo_Selo
2
Trajche 8 6 14
Petarche 5 10 0



Team: FK_Novo_Selo
Trajche - goals: 8, assists: 6, matches: 14
Petarche - goals: 5, assists: 10, matches: 0
Team efficiency: 2.07
----

1
FK_Pobeda_Vasilevo
5
Velimir 16 3 24
Sashe 8 6 22
Tome 4 5 18
Zlatko 2 7 25
Borko 5 4 23

Team: FK_Pobeda_Vasilevo
Velimir - goals: 16, assists: 3, matches: 24
Sashe - goals: 8, assists: 6, matches: 22
Tome - goals: 4, assists: 5, matches: 18
Zlatko - goals: 2, assists: 7, matches: 25
Borko - goals: 5, assists: 4, matches: 23
Team efficiency: 0.54
----

1
FK_Tikveshko_Pole
4
Bogoljub 20 4 25
Stojadin 10 12 24
Cvetko 0 3 20
Mitre 0 0 30

Team: FK_Tikveshko_Pole
Bogoljub - goals: 20, assists: 4, matches: 25
Stojadin - goals: 10, assists: 12, matches: 24
Cvetko - goals: 0, assists: 3, matches: 20
Mitre - goals: 0, assists: 0, matches: 30
Team efficiency: 0.49
*/
