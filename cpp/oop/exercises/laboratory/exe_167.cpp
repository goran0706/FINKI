// Да се направи класа Product која ќе ги содржи следните променливи:
//
//     name, низа од карактери
//     price, цел број
//
// За класата да се направи default конструктор, целосно параметризиран конструктор и get методи за двете променливи.
//
// Да се направи класа Bakery која ќе ги содржи следните променливи:
//
//     products, низа од Product објекти
//     name, низа од карактери
//     numProducts, цел број
//     discount, децимален број за попуст изразен во процент кој е заеднички за сите објекти од оваа класа и може да се пристапи без креирање на инстанца од истата. Иницијално да е поставен на 18.0
//     premium, булеан вредност за дали пекарата е премиум
//
// За класата да се направи default конструктор, целосно параметризиран конструктор и следните функции:
//
//     get функции за променливите name, discount
//     set функција за променливата discount
//     increaseDiscount(float increase) функција за зголемување на данокот (моменталниот попуст + increase)
//     getTotalPrice() функција која ќе го врати вкупниот износ на производите во пекарницата пресметан со попуст
//     print() метод што ќе печати во формат: "Bakery: {име на пекара}" и во нов ред ќе ги испечати сите производи што припаѓаат на пекарата
//
// Дополнително да се дефинира функција
// friend void printBakeriesByPrice(Bakery bakeries[], int numBakeries)
// која ќе ги печати сите пекари  сортирани  според вкупната цена на нивните производи. Оваа функција треба да може директно да пристапува кон приватните членови на Bakery класата.
//
// Да не се менува main функцијата.
//
// ------------------------------------------------------------------------------------------------------------------------------------------
//
// Create a Product class that will contain the following variables:
//
//     name, a string of characters
//     price, integer
//
// For the class, create a default constructor, a fully parameterized constructor and get methods for both variables.
//
// Create a Bakery class that will contain the following variables:
//
//     products, an array of Product objects
//     name, a string of characters
//     numProducts, integer
//     discount, a decimal number for discount  in percentage that is the same for all objects of this class and can be accessed without creating an instance. Initially set to 18.0
//     premium, boolean value for whether the bakery is premium
//
// For the class, make a default constructor, a fully parameterized constructor and the following functions:
//
//     get functions for the variables name, discount
//     set function for the discount variable
//     increaseDiscount(float increase) function to increase the discount (current discount + increase)
//     getTotalPrice() function that will return the total price of all products in the bakery with discount
//     print() method that will print in the format: "Bakery: {name of bakery}" and in a new line the names of all products that belong to the bakery
//
// Additionally, define a function
// friend void printBakeriesByPrice(Bakery bakeries[], int numBakeries)
// that will print all bakeries sorted by the total price of their products. This function should be able to directly access the private members of the Bakery class.
//
// Do not change the main function.
//
// For example:
// Input 	Result
//
// 2
// Eclair
//
//
//
// ---Testing print method---
// Bakery: Sweet Bakery
// Baguette
// Croissant
// Donut
// Eclair
//
//  4
//  1
//  BakeryOne 2 1
//  Bread 100
//  Cake 200
//
//
//
// All bakeries sorted by price:
// Bakery: Happy Bakery
// Baguette
// Croissant
// Donut
// Bakery: Yummy Bakery
// Baguette
// Croissant
// Donut
// Muffin
// Bakery: BakeryOne
// Bread
// Cake
#include <iostream>
#include <cstring>
using namespace std;

// YOUR CODE HERE


//  DO NOT CHANGE THE MAIN FUNCTION

float Bakery::discount = 18.0;

int main() {
    int n;
    cin >> n;
    char name[30] = "Baguette";
    Product products[3];
    products[0] = Product(name, 50);
    strcpy(name, "Croissant");
    products[1] = Product(name, 70);
    strcpy(name, "Donut");
    products[2] = Product(name, 40);
    Bakery bakery(products, "Happy Bakery", 3, false);
    switch (n) {
        case 1: {
            cout << "---Testing constructors, getters, setters---" << endl;
            float d;
            cin >> d;
            Bakery::setDiscount(d);
            cout << products[2].getName() << " Discount: " << Bakery::getDiscount()
                    << " Total price: " << bakery.getTotalPrice();
            break;
        }
        case 2: {
            cout << "---Testing print method---" << endl;
            char name2[50];
            cin >> name2;
            Product products2[4];
            for (int i = 0; i < 3; ++i)
                products2[i] = products[i];
            products2[3] = Product(name2, 60);
            Bakery bakery2(products2, "Sweet Bakery", 4, false);
            bakery2.print();
            break;
        }
        case 3: {
            cout << "---Testing increaseDiscount static method---" << endl;
            float inc;
            cin >> inc;
            cout << Bakery::getDiscount() << endl;
            Bakery::increaseDiscount(inc);
            cout << Bakery::getDiscount() << endl;
            cout << bakery.getTotalPrice();
            break;
        }
        default: {
            Product products2[4];
            for (int i = 0; i < 3; ++i)
                products2[i] = products[i];
            strcpy(name, "Muffin");
            products2[3] = Product(name, 35);
            Bakery bakery2(products2, "Yummy Bakery", 4, true);
            int numBakeries;
            cin >> numBakeries;
            numBakeries += 2;
            Bakery bakeries[numBakeries];
            bakeries[0] = bakery;
            bakeries[1] = bakery2;
            bool premiumType;
            for (int i = 2; i < numBakeries; ++i) {
                char bakeryName[30];
                int numProducts;
                cin >> bakeryName >> numProducts >> premiumType;
                Product prod[numProducts];
                for (int j = 0; j < numProducts; ++j) {
                    char pname[30];
                    int price;
                    cin >> pname >> price;
                    prod[j] = Product(pname, price);
                }
                bakeries[i] = Bakery(prod, bakeryName, numProducts, premiumType);
            }
            cout << "All bakeries sorted by price: " << endl;
            printBakeriesByPrice(bakeries, numBakeries);
        }
    }
    return 0;
}
