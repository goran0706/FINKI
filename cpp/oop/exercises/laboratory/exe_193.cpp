/*
Дизајнирајте програма за систем за регистрација на велосипедски трки. Треба да креирате базична класа наречена Race која претставува генеричка трка и ги има овие две чисти виртуелни функции:

    displayRaceInfo()

    displayFee()

Понатаму, креирајте 2 подкласи на Race наречени:

    MountainRace

    RoadRace

Класата MountainRace треба да има:

    isProfessional (bool) – индицира дали трката е за професионални возачи.

    displayRaceInfo(): Треба да печати: This is a mountain bike race on a rugged trail. Ако трката е професионална, додадете It is for professional riders. на крајот.

    displayFee(): Треба да печати: The registration fee is $[fee]. Цената е 50$ по стандард, но 80$ ако е професионална трка.

Класата RoadRace треба да има:

    includesJersey (bool) – индицира дали регистрацијата вклучува дрес.

    displayRaceInfo(): Треба да печати: This is a road bike race on a paved circuit. Доколку е вклучен дрес, додадете It includes a commemorative jersey. на крајот.

    displayFee(): Треба да печати: The registration fee is $[fee]. Цената е 40$ по стандард, но 70$ ако вклучува дрес.

------------------------------------------------------------------------------------------------

Design a program for a bike race registration system. You need to create a base class called Race that represents a generic race and has these two pure virtual functions:

    displayRaceInfo()

    displayFee()

Next, create 2 subclasses of Race called:

    MountainRace

    RoadRace

The MountainRace class should have:

    isProfessional (bool) – indicates if the race is for professional riders.

    displayRaceInfo(): Should print: This is a mountain bike race on a rugged trail. If the race is professional, add It is for professional riders. to the end.

    displayFee(): Should print: The registration fee is $[fee]. The fee is $50 by default, but $80 if it is a professional race.

The RoadRace class should have:

    includesJersey (bool) – indicates if the registration includes a team jersey.

    displayRaceInfo(): Should print: This is a road bike race on a paved circuit. If a jersey is included, add It includes a commemorative jersey. to the end.

    displayFee(): Should print: The registration fee is $[fee]. The fee is $40 by default, but $70 if it includes a jersey.

For example:
Input 	Result

3
1
1
0
0
1



TEST CASE 3: TESTING BOTH CLASSES
This is a mountain bike race on a rugged trail. It is for professional riders.
The registration fee is $80.
This is a road bike race on a paved circuit. It includes a commemorative jersey.
The registration fee is $70.
This is a mountain bike race on a rugged trail.
The registration fee is $50.
This is a road bike race on a paved circuit.
The registration fee is $40.
This is a mountain bike race on a rugged trail. It is for professional riders.
The registration fee is $80.
*/