//
//
// Дефинирајте класа Product во која ќе се чуваат информации за едно продукт:
//
//     шифра на продуктот(низа од најмногу 50 знаци)
//
//     име на продуктот(низа од најмногу 100 знаци)
//
//     цена (цел број)
//     статус (логичка променлива) продуктот може да биде inStock / outOfStock
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
// Потоа, да се дефинира класа Market во која ќе се чуваат следните информации:
//
//     име на маркет (низа од најмногу 50 знаци)
//
//     број на продукти во маркетот (цел број)
//
//     низа од продукти во маркетот (низа од објекти од класата Product, со максимална големина 100)
//
// Да се креира конструктор со аргументи за класата.
// Доколку е потребно, да се креираат get и set методи.
//
// Во класата да се имплементира функција int sumOfAllProductsInStock()
//
// која ja враќа сумата на сите продукти кои се достапни (на лагер) во маркетот. Доколку не постојат такви продукти да се испечати соодветна порака на излез ,,There is not a single product in stock at the market".
//
// НЕ ЈА МЕНУВАЈТЕ main() функцијата.
//
// ------------------------------------------------
//
// Define a Product class that will store information about a single product:
//
//     product code (string of up to 50 characters)
//
//     product name (string of up to 100 characters)
//
//     price (an integer)
//
//     age (an integer)
//     status (logical variable) the product can be inStock / outOfStock
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
// Next, define a class Market to store the following data:
//
//     market name (string of up to 50 characters)
//
//     number of products in the market (integer)
//
//     array of products in the market (array of objects of the Product class, with a maximum size of 100)
//
// Create a constructor with arguments for the class.
// If necessary, create get and set methods.
//
// In the class, implement a function int sumOfAllProductsInStock()
//
// which returns the sum of all products that are available (in stock) in the market. If there are no such products, print an appropriate message on the output "There is not a single product in stock at the market".
//
// DO NOT MODIFY THE MAIN FUNCTION.
//
//
//
//
// For example:
// Input 	Result
//
// Ramstore
// 1
// L1
// Laptop
// 50000
// 1
//
//
//
// SUM of products in stock at the market is 50000

#include <iostream>
#include <cstring>
using namespace std;

//Your code here
//DO NOT CHANGE THE MAIN FUNCTION

int main() {
    char marketName[50];
    int n;

    cin.getline(marketName, 50);
    cin >> n;
    cin.ignore();

    Product arr[100];

    for (int i = 0; i < n; i++) {
        char code[50];
        char name[100];
        int price;
        int st;

        cin.getline(code, 50);
        cin.getline(name, 100);
        cin >> price >> st;
        cin.ignore();

        arr[i] = Product(code, name, price, st);
    }

    Market m(marketName, n, arr);

    int result = m.sumOfAllProductsInStock();


    if (result == 0) {
        cout << "There is not a single product in stock at the market" << endl;
    } else {
        cout << "SUM of products in stock at the market is " << result << endl;
    }

    return 0;
}
