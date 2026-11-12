/*


Дизајнирате програма за систем за RPG игра. За ова ќе треба да креирате базична класа наречена Character, што претставува генерички лик во игра и ги има овие две чисти виртуелни функции:

displayCharacterInfo()
displayCharacterPower()

Понатаму, треба да креирате 2 подкласи на Character наречени:

Warrior
Mage

Класата Warrior треба да ги има овие информации:

hasShield - bool променлива

и да ги имплементира двете функции погоре со следните имплементации:

За displayCharacterInfo() треба да се печати This is a warrior with a sword. Ако ликот има и штит, треба да се додаде and a shield на крајот од пораката.

За displayCharacterPower() треба да се печати The power of the warrior is [power]., каде што моќта се пресметува врз основа на тоа дали ликот има штит или не. Ако има штит, моќта е 150, а ако нема, моќта е 120.

Класата Mage треба да ги има овие информации:

hasStaff - bool променлива

и да ги имплементира двете функции погоре со следните имплементации:

За displayCharacterInfo() треба да се печати This is a mage with magic spells. Доколку ликот дополнително има и магичен стап, треба да се додаде and a staff на крајот од пораката.

За displayCharacterPower() треба да се печати The power of the mage is [power]., каде што моќта се пресметува врз основа на тоа дали ликот има магичен стап или не. Ако има магичен стап, моќта е 180, а ако нема, моќта е 130.



_______________________________________________________________________________________________________________________________________



Design a program for an RPG game system. For this, you need to create a base class called Character, which represents a generic character in the game and has these two pure virtual functions:

displayCharacterInfo()
displayCharacterPower()

Furthermore, you need to create 2 subclasses of Character called:

Warrior
Mage

The Warrior class should have the following information:

hasShield - bool variable

and implement the two functions above with these implementations:

For displayCharacterInfo(), it should print This is a warrior with a sword. If the character also has a shield, you should add and a shield at the end of the message.

For displayCharacterPower(), it should print The power of the warrior is [power]. where the power is calculated based on whether the character has a shield or not. If it has a shield, it is 150, and if it does not, it is 120.

The Mage class should have the following information:

hasStaff - bool variable

and implement the two functions above with these implementations:

For displayCharacterInfo(), it should print This is a mage with magic spells. If the character additionally has a magic staff, add and a staff at the end of the message.

For displayCharacterPower(), it should print The power of the mage is [power]. where the power is calculated based on whether the character has a magic staff or not. If it has a magic staff, it is 180, and if it does not, it is 130.

For example:
Input 	Result

3
1
0
1
1
0



TEST CASE 3: TESTING BOTH CLASSES
This is a warrior with a sword and a shield.
The power of the warrior is 150.
This is a mage with magic spells.
The power of the mage is 130.
This is a warrior with a sword and a shield.
The power of the warrior is 150.
This is a mage with magic spells and a staff.
The power of the mage is 180.
This is a warrior with a sword.
The power of the warrior is 120.
*/