package playground.exercises._07_graphs;

/*
* Дадени се објекти кои се поврзани со улици и се групирани во градови. За група на објекти се смета дека припаѓаат на еден град ако секој објект е поврзан со барем еден друг објект од тој град, а не е поврзан со ниту еден објект од некој друг град. Да се одреди во колку градови се групирани дадените објекти.


Влез: Во првиот ред е даден бројот на објекти N. Потоа во следните N редови се дадени имињата на објектите. Во следниот ред е даден бројот на улици M, а во следните M редови се дадени објектите кои ги поврзува секоја улица.

Излез:  Бројот на градови во кои се групирани дадените објекти.

Пример:

Влез:

5
School1
ApartmentBuilding1
Park1
Supermarket1
Hospital1
2
School1 ApartmentBuilding1
Park1 Supermarket1

Излез: 3 (Објаснување: School1 и ApartmentBuilding1 се во еден град, Park1 и Supermarket1 во друг и Hospital1 во трет)

/

You're given objects connected by streets and grouped into cities. A group of objects is considered to belong to the same city if each object is connected to at least one other object in that city and is not connected to any object from another city. Determine how many cities the given objects are grouped into.


Input: The first line contains the number of objects N. The next N lines contain the names of the objects. The next line contains the number of streets M, followed by M lines that specify the objects connected by each street.

Output: The number of cities the given objects are grouped into.

Example:

Input:

5
School1
ApartmentBuilding1
Park1
Supermarket1
Hospital1
2
School1 ApartmentBuilding1
Park1 Supermarket1

Output: 3 (Explanation: School1 and ApartmentBuilding1 are in one city, Park1 and Supermarket1 in another, and Hospital1 in a third.)

For example:
Input 	Result

5
School1
ApartmentBuilding1
Park1
Supermarket1
Hospital1
2
School1 ApartmentBuilding1
Park1 Supermarket1



3

5
School1
ApartmentBuilding1
ApartmentBuilding2
Park1
Hospital1
4
School1 ApartmentBuilding1
ApartmentBuilding1 ApartmentBuilding2
ApartmentBuilding2 Park1
Park1 Hospital1



1
* */
public class Exe1 {
}
