//
//
// Дефинирајте класа Animal во која ќе се чуваат информации за едно животно:
//
//     име на животното (низа од најмногу 100 знаци)
//
//     вид на животното (низа од најмногу 50 знаци)
//
//     континент од кој потекнува (низа од најмногу 50 знаци)
//
//     возраст (цел број)
//
//     тежина (цел број)
//
// За класата да се дефинираат:
//
//     default конструктор
//
//     конструктор со аргументи
//
//     copy конструктор
//
//     доколку е потребно, get и set методи
//
// Потоа, да се дефинира класа Zoo во која ќе се чуваат следните информации:
//
//     име на зоолошката градина (низа од најмногу 50 знаци)
//
//     број на животни во зоолошката градина (цел број)
//
//     низа од животни во зоолошката градина (низа од објекти од класата Animal, со максимална големина 100)
//
// Да се креира конструктор со аргументи за класата.
// Доколку е потребно, да се креираат get и set методи.
//
// Во класата да се имплементира функција Animal oldestAnimal()
//
// која го враќа најстарото животно во зоолошката градина. Доколку две или повеќе животни имаат иста возраст, да се врати она со поголема тежина. Доколку и возраста и тежината се исти, да се врати првото такво животно.
//
// НЕ ЈА МЕНУВАЈТЕ main функцијата.
//
// ------------------------------------------------
//
// Define a class Animal to store data about an animal:
//
//     animal name (a string with maximum 100 characters)
//
//     species (a string with maximum 50 characters)
//
//     continent of origin (a string with maximum 50 characters)
//
//     age (an integer)
//
//     weight (an integer)
//
// For the class, define the following:
//
//     a default constructor
//
//     a constructor with arguments
//
//     a copy constructor
//
//     if necessary, get and set methods
//
// Next, define a class Zoo to store the following data:
//
//     zoo name (a string with maximum 50 characters)
//
//     number of animals in the zoo (an integer)
//
//     array of animals in the zoo (an array of Animal objects, maximum size 100)
//
// Create a constructor with arguments for the class.
// If necessary, create get and set methods.
//
// In the class, implement a function Animal oldestAnimal()
//
// that returns the oldest animal in the zoo. If two or more animals have the same age, return the one with the greater weight. If both age and weight are the same, return the first such animal.
//
// DO NOT MODIFY THE MAIN FUNCTION.
//
//
//
//
// For example:
// Input 	Result
//
// BitolaZoo 1
// Bobo Bear Europe 10 300
//
//
//
// The selected animal is: Bobo of species Bear from Europe, age 10, weight 300.

#include <iostream>
#include <cstring>
using namespace std;

//Your code here
//DO NOT CHANGE THE MAIN FUNCTION

int main() {
    char zooName[50];
    int n;
    cin >> zooName >> n;

    Animal animals[100];

    for (int i = 0; i < n; i++) {
        char name[100], species[50], continent[50];
        int age, weight;
        cin >> name >> species >> continent >> age >> weight;

        Animal a(name, species, continent, age, weight);
        animals[i] = Animal(a);
    }

    Zoo zoo(zooName, n, animals);
    Animal oldest = zoo.oldestAnimal();

    cout << "The selected animal is: "
            << oldest.getName() << " of species "
            << oldest.getSpecies() << " from "
            << oldest.getContinent() << ", age "
            << oldest.getAge() << ", weight "
            << oldest.getWeight() << ".";

    return 0;
}
