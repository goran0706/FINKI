// Да се дефинира класа NutrientDiet во која се чува информација за:
//
//     calories - калории (целобројна вредност)
//     protein - протеини (целобројна вредност)
//     fat - масти (целобројна вредност)
//     carbohydrates - карбохидрати (целобројна вредност)
//
// Да се дефинира:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     calculateScore() - функција за пресметување на score од диета според следната формула: [протеини] * 2 + [карбохидрати] - [масти] * 1.5 - [калории] / 100.0
//     print() - функција која печати извештај за диетата, пример output:
//
// Nutrient diet:
// 1000 calories
// 150 protein
// 30 fat
// 120 carbohydrates
//
// Да се дефинира класа ProteinDiet која наследува од NutrientDiet и има дополнителна информација:
//
//     extraProtein - екстра протеини (целобројна вредност)
//
// Да се дефинира:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     да се препокрие методот calculateScore() така што ќе се додаде дополнителното количество протеин на основниот score
//     да се препокрие print() - функција која печати извештај за диетата, пример output:
//
// Protein diet:
// 800 calories
// 120 protein
// 20 fat
// 100 carbohydrates
//
//     Доколку количеството на дополнителни протеини е нула, се печати извештајот на родителската класа NutrientDiet.
//     Доколку количеството на дополнителни протеини е негативна вредност треба да се испечати "Lack of protein"
//
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------
//
// Define a class NutrientDiet that stores the following information:
//
//     calories – calories (integer value)
//     protein – protein (integer value)
//     fat – fat (integer value)
//     carbohydrates – carbohydrates (integer value)
//
// The class should include:
//
//     A default constructor
//     A constructor with arguments
//     A copy constructor
//     A method calculateScore() that calculates the diet score using the formula: protein * 2 + carbohydrates - fat * 1.5 - calories / 100.0
//     A method print() that prints a report for the diet, for example:
//
// Nutrient diet:
// 1000 calories
// 150 protein
// 30 fat
// 120 carbohydrates
//
// Define a class ProteinDiet that inherits from NutrientDiet and stores additional information:
//
//     extraProtein – extra protein (integer value)
//
// The class should include:
//
//     A default constructor
//     A constructor with arguments
//     A copy constructor
//     Override calculateScore() so that the additional protein is added to the base score
//     Override print() to print a report for the protein diet, for example:
//
// Protein diet:
// 800 calories
// 120 protein
// 20 fat
// 100 carbohydrates
//
//     If the amount of extraProtein is 0, then the report should be printed using the base class NutrientDiet
//     If the amount of extraProtein is negative, print "Lack of protein"
//
//
//
// For example:
// Input 	Result
//
// 3
// 2000 100 70 250
// 1800 90 60 200
// 1500 80 50 180
// 2000 100 70 250 20
// 1800 90 60 200 0
// 1500 80 50 180 -10
// 2
//
//
//
// ===Testiranje na klasata ProteinDiet===
// Protein diet:
// 2000 calories
// 100 protein
// 70 fat
// 250 carbohydrates
// Score: 345
// Nutrient diet:
// 1800 calories
// 90 protein
// 60 fat
// 200 carbohydrates
// Score: 272
// Lack of protein
// Score: 240

#include <iostream>
using namespace std;

//Your code here
//Do not change the main class

int main() {
    int n;
    int calories, protein, fat, carbs, extraProtein;

    NutrientDiet *diets;
    ProteinDiet *proteinDiets;

    cin >> n;

    diets = new NutrientDiet[n];
    proteinDiets = new ProteinDiet[n];

    for (int i = 0; i < n; i++) {
        cin >> calories >> protein >> fat >> carbs;
        diets[i] = NutrientDiet(calories, protein, fat, carbs);
    }

    for (int i = 0; i < n; i++) {
        cin >> calories >> protein >> fat >> carbs >> extraProtein;
        proteinDiets[i] = ProteinDiet(calories, protein, fat, carbs, extraProtein);
    }

    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "===Testiranje na klasata NutrientDiet===" << endl;
        for (int i = 0; i < n; i++) {
            diets[i].print();
            cout << "Score: " << diets[i].calculateScore() << endl;
        }
    } else {
        cout << "===Testiranje na klasata ProteinDiet===" << endl;
        for (int i = 0; i < n; i++) {
            proteinDiets[i].print();
            cout << "Score: " << proteinDiets[i].calculateScore() << endl;
        }
    }

    delete[] diets;
    delete[] proteinDiets;

    return 0;
}
