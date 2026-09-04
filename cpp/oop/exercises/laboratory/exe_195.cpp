/*
Дизајнирајте програма за систем за регистрација на трки за трчање.

Потребно е да се креира базична класа Race која претставува генеричка трка и ги има следните две чисти виртуелни функции:

    displayRaceInfo()
    displayFee()

Креирајте 2 подкласи од Race:
MarathonRace

Оваа класа треба да има:

    isInternational (bool) – дали трката е меѓународна

Методи:

    displayRaceInfo():
    Печати:
    This is a marathon race over a long distance.
    Ако е меѓународна, додадете:
    It is an international event.
    displayFee():
    Печати:
    The registration fee is $[fee].
        60$ ако е  стандард трка и не е меѓународна
        100$ ако е меѓународна

SprintRace

Оваа класа треба да има:

    hasMedal (bool) – дали учесниците добиваат медал

Методи:

    displayRaceInfo():
    Печати:
    This is a short sprint race.
    Ако има медал, додадете:
    Participants receive a medal.
    displayFee():
    Печати:
    The registration fee is $[fee].
        30$ ако нема медал
        50$ ако има медал

----------------------------------------------------

Design a program for a running race registration system. You need to create a base class Race that represents a generic race and has the following two pure virtual functions:

    displayRaceInfo()
    displayFee()

Create 2 subclasses of Race:

MarathonRace This class should have:

    isInternational (bool) – whether the race is international

Methods:

    displayRaceInfo(): Prints: This is a marathon race over a long distance. If it is international, add: It is an international event.
    displayFee(): Prints: The registration fee is $[fee].
        $60 if it is a standard race and not international
        $100 if it is international

SprintRace This class should have:

    hasMedal (bool) – whether participants receive a medal

Methods:

    displayRaceInfo(): Prints: This is a short sprint race. If there is a medal, add: Participants receive a medal.
    displayFee(): Prints: The registration fee is $[fee].
        $30 if there is no medal
        $50 if there is a medal

For example:
Input 	Result

3
1
0
1
0
1



TEST CASE 3: TESTING BOTH CLASSES
This is a marathon race over a long distance. It is an international event.
The registration fee is $100.
This is a short sprint race.
The registration fee is $30.
This is a marathon race over a long distance. It is an international event.
The registration fee is $100.
This is a short sprint race.
The registration fee is $30.
This is a marathon race over a long distance. It is an international event.
The registration fee is $100.
*/