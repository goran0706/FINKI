// Develop a class Bill representing a utility expense that keeps a record for: bill number (dynamically allocated array of characters), expense (integer), month and year for which is issued as a character array in form “MM.YYYY” and status (boolean representing where the bill was payed or not). (5 points) For this class overload:
//
// operator == that can compare two bills according to the bill number (5 points)
// operator << for printing the bill in the form: (5 points)
//
// [bill number] (MM.YYYY) - [expense]
//
// Develop a class UserProfile that will hold: a username (array of no more than 30 characters), billsArray (array of no more than 30 objects of class Bill) and number of bills in the array. For this class overload: (5 points)
//
// operator += for adding a new bill in the array of bills. If the bill was already added (a bill with that number already exist in the array) generate an exception of the class ExistingBill (that should also be defined). (10 points) In the case of an exception, "The bill already exists" should be printed on the screen and the duplicate bill should not be added.
// operator << that will print out all pending bills (bills which status is: not payed). "Pending bills for [username] are:", where [username] represent the name of the user that should be printed in the first line, followed by the pending bills, one per line.
//
// Also implement function totalDue(int month, int year) that will return the total amount payed for the given month. (10 points)
//
// For example:
// Input 	Result
//
// 5
// petrovska.lidija 5
// 254648445 2450 05.2016 1
// 254118445 2000 04.2016 0
// 2218445 1000 05.2016 0
// 2218445 1200 06.2016 0
// 212218445 1560 05.2016 0
// 5 2016
//
//
//
// -----Test all -----
// The bill already exists
// Unpaid bills of user petrovska.lidija are:
// 254118445(04.2016) - 2000
// 2218445(05.2016) - 1000
// 212218445(05.2016) - 1560
// Total due for month 5 and year 2016 is:5010

#include<iostream>
#include<string.h>
using namespace std;

// Your code here

int main() {
    char number[50], month[8], name[50];
    int price, n;
    bool status;


    int type;
    cin >> type;

    if (type == 1) {
        cout << "-----Test Bill & operator <<-----" << endl ;
        cin >> number >> price >> month >> status;
        Bill b(number, price, month, status);
        cout << b;
    } else if (type == 2) {
        cout << "-----Test Bill & operator == -----" << endl ;
        cin >> number >> price >> month >> status;
        Bill b1(number, price, month, status);
        cin >> number >> price >> month >> status;
        Bill b2(number, price, month, status);
        if (b1 == b2) cout << "Equal" << endl;
        else cout << "Not equal" << endl;

    } else if (type == 3) {
        cout << "-----Test UserProfile & operator += & << -----" << endl ;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            up += s;
        }
        cout << up;
    } else if (type == 4) {
        cout << "-----Test UserProfile & operator += & totalDue -----" << endl ;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            up += s;
        }
        int m, y;
        cin >> m >> y;
        cout << "Total due for month " << m << " and year " << y << " is:";
        cout << up.totalDue(m, y) << endl;
    } else if (type == 5) {
        cout << "-----Test all -----" << endl ;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            up += s;
        }
        cout << up;
        int m, y;
        cin >> m >> y;
        cout << "Total due for month " << m << " and year " << y << " is:";
        cout << up.totalDue(m, y) << endl;
    }

    return 0;
}
