/*
Да се креира апстрактна класа Athlete за опишување на спортист. Класата треба да ги содржи следните два виртуелни методи:

    calculatePerformanceScore – за пресметување на вкупниот перформанс на спортистот
    printInfo – за печатење на информации

За секој спортист се чуваат следните информации

    Име на спортист (динамички алоцирана низа од знаци)
    Клуб (низа од максимум 50 знаци)
    Основен резултат (реален број)

Од оваа класа треба да се изведат следниве класи:

    Runner
    Swimmer

За секој Runner дополнително се чуваат следните информации:

    numberOfMedals – број на освоени медали (цел број)

Пресметување на резултат

Методот calculatePerformanceScore треба да работи според следното правило:

    ако спортистот има повеќе од 3 медали, резултатот се зголемува за 5 поени за секој медал над 3.

За секој Swimmer дополнително се чуваат следните информации:

    hasWorldRecord – дали има светски рекорд (bool вредност)

Пресметување на резултат

Методот calculatePerformanceScore треба да работи според следното правило:

    ако спортистот има светски рекорд, резултатот се зголемува за 20 поени

Печатење на информации

Методот printInfo треба да печати во следниот формат:

За Runner:

[name], [club], [number of medals] - [performance score]

За Swimmer:

[name], [club], [has world record] - [performance score]
Каде has world record се печати како:

true или false.

Глобална функција

Да се дефинира глобална функција:

float bestRunner(Athlete *athletes[], int n)

Функцијата прима низа од покажувачи кон Athlete објекти и нивниот број.

Функцијата треба:

    да ги испечати информациите за Runner спортистот со најголем перформанс
    да ја врати неговата вредност.

--------------------------------------------------------------------------

Create an abstract class Athlete for describing a sports athlete. The class should contain the following two virtual methods:

    calculatePerformanceScore – for calculating the athlete's total performance
    printInfo – for printing information

For each athlete, the following information is stored:

    Athlete name (dynamically allocated character array)
    Club (array of maximum 50 characters)
    Base score (real number)

From this class, the following classes should be derived:

    Runner
    Swimmer

For each Runner, the following additional information is stored:

    numberOfMedals – number of medals won (integer)

Score calculation The calculatePerformanceScore method should work according to the following rule:

    if the athlete has more than 3 medals, the score increases by 5 points for each medal above 3.

For each Swimmer, the following additional information is stored:

    hasWorldRecord – whether they have a world record (bool value)

Score calculation

 The calculatePerformanceScore method should work according to the following rule:

    if the athlete has a world record, the score increases by 20 points.

Printing information

 The printInfo method should print in the following format:

For Runner: [name], [club], [number of medals] - [performance score]

For Swimmer: [name], [club], [has world record] - [performance score]

Where has world record is printed as: true or false.

Global function

 Define a global function: float bestRunner(Athlete *athletes[], int n)

The function receives an array of pointers to Athlete objects and their count. The function should:

    print the information for the Runner athlete with the highest performance
    return their value.

For example:
Input 	Result

5
Runner
Runner1
ClubA
80
2
Swimmer
Swimmer1
ClubB
75
1
Runner
Runner2
ClubC
90
5
Swimmer
Swimmer2
ClubD
70
0
Runner
Runner3
ClubE
85
4



Best Runner:
Runner2, ClubC, 5 - 100
*/