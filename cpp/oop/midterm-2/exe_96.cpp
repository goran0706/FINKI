// Implement class AlcoholicDrink that has info for:
//
//     name (max of 100 chars),
//     country of origin (max of 100 chars),
//     percent of alcohol (float),
//     base price (float).
//
// One company have two kinds of alcoholic drinks that should be defined in two separate classes: Beer and Wine. For beer additionally keep info for the main ingredient (two possibilities: barley/wheat), and for wines keep the year of manufacturing (integer) and grapes type (max of 20 chars).
//
// Implement in the classes:
//
//     needed constructors and destructors (see the usage in the main function) (5 points)
//
//     operator <<for printing the alcoholic drinks in format: (5 points)
//
//     name country_of_origin computed_price
//
//     operator < for comparing two alcoholic drinks from any kind by their computed price (5 points)
//
//     method float computePrice() for computing the price of different kind of alcoholic drinks on the following way: (10 points)
//         for Beer - the price is increased for 5% of the base price if the beer is originated from "Germany" and for 10% of the base price if it is made from wheat
//         for Wine - the price is increased for 5% of the base price if the wine is originated from "Italy" and for 15% of the base price if the it is manufactured before 2005
//
// Implement global function void lowestPrice(AlcoholicDrink ** а, int n) that will print the alcoholic drink with lowest price. (10 points)
//
// In the class AlcoholicDrink is kept an integer which is same for all alcoholic drinks and represents the discount for these products. The initial value of this variable is 5. To work with this variable implement the following static methods: (5 points)
//
//     void changeDiscount(int d) to change the discount
//     void total(AlcoholicDrink** ad, int n) that prints the total price of all alcoholic drinks and the total price with discount.
//
// For example:
// Input 	Result
//
// 1
// 5.1 Skopsko Macedonia 80 1
// 11.2 Smederevka Kavadarci 110 2001 smederevka
//
//
//
// ===== TESTING CONSTRUCTORS ======
// Skopsko Macedonia 80
// Smederevka Kavadarci 126.5

#include <iostream>
#include <cstring>
using namespace std;


// YOUR CODE HERE

// DO NOT CHANGE THE MAIN FUNCTION


int main() {
    int testCase;
    cin >> testCase;
    float p;
    char name[100];
    char country[100];
    float price;
    bool mainI;
    int year;
    char grape[20];
    if (testCase == 1) {
        cout << "===== TESTING CONSTRUCTORS ======" << endl;
        cin >> p;
        cin >> name;
        cin >> country;
        cin >> price;
        cin >> mainI;
        Beer b(p, name, country, price, mainI);
        cout << b << endl;
        cin >> p;
        cin >> name;
        cin >> country;
        cin >> price;
        cin >> year;
        cin >> grape;
        Wine w(p, name, country, price, year, grape);
        cout << w << endl;
    } else if (testCase == 2) {
        cout << "===== TESTING LOWEST PRICE ======" << endl;
        int n;
        cin >> n;
        AlcoholicDrink **ad = new AlcoholicDrink *[n];
        for (int i = 0; i < n; ++i) {
            cin >> p;
            cin >> name;
            cin >> country;
            cin >> price;

            if (i % 2 == 1) {
                cin >> mainI;
                ad[i] = new Beer(p, name, country, price, mainI);
            } else {
                cin >> year;
                cin >> grape;
                ad[i] = new Wine(p, name, country, price, year, grape);
            }
        }

        lowestPrice(ad, n);
        for (int i = 0; i < n; ++i) {
            delete ad[i];
        }
        delete [] ad;
    } else if (testCase == 3) {
        cout << "===== TESTING DISCOUNT STATIC ======" << endl;
        int n;
        cin >> n;
        AlcoholicDrink **ad = new AlcoholicDrink *[n];
        for (int i = 0; i < n; ++i) {
            cin >> p;
            cin >> name;
            cin >> country;
            cin >> price;
            if (i % 2 == 1) {
                cin >> mainI;
                ad[i] = new Beer(p, name, country, price, mainI);
            } else {
                cin >> year;
                cin >> grape;
                ad[i] = new Wine(p, name, country, price, year, grape);
            }
        }
        AlcoholicDrink::total(ad, n);
        int d;
        cin >> d;
        AlcoholicDrink::changeDiscount(d);
        AlcoholicDrink::total(ad, n);
        for (int i = 0; i < n; ++i) {
            delete ad[i];
        }
        delete [] ad;
    }
}

