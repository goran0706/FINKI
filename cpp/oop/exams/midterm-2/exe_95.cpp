// Create class Tickets that has info:
//
// ID (array 12 digits),
// event (char array max 100)
// base price (decimal number)
//
// The ticket store offers two types of tickets that should be defined in two separate classes: Online and Offline. For the Online type keep additional data if the member who byes the ticket is premium user or not, and for the second type Offline additionally keep if it has reservation for seat or not.
//
// For the classes implement:
//
// needed constructors and destructor (see the calls in the main function) (5 points)
//
// operator << for printing the tickets in format: (5 points)
//
// ID - event - computed price
//
// method bool falsifikat(int from, int to) for checking if the ticket is fake. You should check if the last 4 digits of the ID of the ticket are in the range [from-to] (10 points)
//
// method float presmetajCena() for computing the price of the separate types of tickets on the following way: (10 points)
//     for Оnline - price is decreased for 15% of the basic price if the memeber is premium
//     for Offline - price is increased for 10% of the basic price if there is seat reservation
//
// Implemented additional functions with signature void vkupenPrihod(Tickets ** t, int n, int from, int to) that will print the total income of the tickets that are not fake. (10 points)
//
// In the class Tickets there is integer that is shared between all tickets and it is the discount of the basic price for all objects. Initial value of this variable is 0. For manipulation of this variable implement the following static method: (5 pionts)
//
// void changeDiscount(int d) - for changing discount
//
// For example:
// Input 	Result
//
// 1
// 2 4 0 3 1 2 3 8 2 7 3 2
// WhiteSnake_ThePurpleTour
// 1200
// 1
// 2 4 0 3 1 2 3 8 2 7 3 2
// WhiteSnake_ThePurpleTour
// 1200
// 0
//
//
//
// ===== TESTING CONSTRUCTORS ======
// 240312382732-WhiteSnake_ThePurpleTour-1020
// 240312382732-WhiteSnake_ThePurpleTour-1200

#include <iostream>
#include <cstring>
using namespace std;

//Your code here

// DO NOT CHANGE THE MAIN FUNCTION, EXCEPT THE MARKED PART FOR HANDLING WITH THE EXCEPTION
int main() {
    int testCase;
    cin >> testCase;
    int ID[12];
    char nastan[100];
    float price;
    bool premium;
    bool rezervacija;
    int od, doo;

    if (testCase == 1) {
        cout << "===== TESTING CONSTRUCTORS ======" << endl;
        for (int i = 0; i < 12; i++)
            cin >> ID[i];
        cin >> nastan;
        cin >> price;
        cin >> premium;
        Online o1(ID, nastan, price, premium);
        cout << o1 << endl;
        for (int i = 0; i < 12; i++)
            cin >> ID[i];
        cin >> nastan;
        cin >> price;
        cin >> rezervacija;
        Offline o2(ID, nastan, price, rezervacija);
        cout << o2 << endl;
    } else if (testCase == 2) {
        cout << "===== TESTING METHOD vkupenPrihod()  ======" << endl;
        int n;
        cin >> n;
        Tickets **t = new Tickets *[n];
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < 12; j++)
                cin >> ID[j];
            cin >> nastan;
            cin >> price;

            if (i % 2 == 0) {
                cin >> premium;
                t[i] = new Online(ID, nastan, price, premium);
            } else {
                cin >> rezervacija;
                t[i] = new Offline(ID, nastan, price, rezervacija);
            }
        }
        cin >> od;
        cin >> doo;
        vkupenPrihod(t, n, od, doo);
        for (int i = 0; i < n; ++i) {
            delete t[i];
        }
        delete[] t;
    } else if (testCase == 3) {
        cout << "===== TESTING DISCOUNT STATIC ======" << endl;
        int n;
        cin >> n;
        //cout<<n<<endl;
        Tickets **t = new Tickets *[n];
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < 12; ++j)
                cin >> ID[j];
            cin >> nastan;
            //cout<<nastan<<endl;
            cin >> price;
            //cout<<price<<endl;
            if (i % 2 == 0) {
                cin >> premium;
                t[i] = new Online(ID, nastan, price, premium);
            } else {
                cin >> rezervacija;
                //cout<<rezervacija<<endl;
                t[i] = new Offline(ID, nastan, price, rezervacija);
            }
        }
        int d;
        cin >> d;
        Tickets::changeDiscount(d);
        for (int i = 0; i < n; ++i)
            cout << *t[i] << endl;
    }
}
