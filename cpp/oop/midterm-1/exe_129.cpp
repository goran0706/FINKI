// Create a program for managing products in a piano store. For that purpose, the class' Piano` * (5 points) * should be created. The class should include:
//
//     Serial number (array of 25 characters)
//     Price (decimal number)
//     Year of production (integer)
//
// For this class, implement a method equals that accepts an object from the Piano class as an argument, and makes a comparison between the objects on the bases of their serial number. * (5 points) *
//
// In addition, for this class, provide a print () method for printing the object in the following format * (5 points) *:
//
// [Serial number] [Year of production] [Price]
//
// Create a PShop class * (5 points) * that contains:
//
//     Store name (array of 50 characters)
//     A list of pianos in the store (dynamically allocated array of objects of the Piano class)
//     Number of objects in the array (integer)
//
// For this class, provide the following methods:
//
//     double value () - to calculate the current value of the pianos in the store. It is calculated as a sum of the price of all the pianos in the store * (5 points) *.
//
//     void add (Piano p) - to add a new piano in the store (adding a new object from the Piano class to the array of pianos) * (10 points) *
//
//     void sell (Piano p) to delete a given piano from the array (delete all items that are equal to the input argument, according to the serial number) * (10 points) *
//
//     void print () - to print the information about the store, so that the first row displays its name, and then in each row the information for each piano. * (5 points) *
//
// For all classes, define the necessary constructors, destructor and all other methods necessary to provide a correct program functionality. All data members in the classes are private. * (5 points) *
//
// For example:
// Input 	Result
//
// 5
// FINKI-Piano
// 3
// 12345
// 990
// 2000
// 12346
// 1200
// 2010
// 12347
// 1300
// 2015
// 12348
// 950
// 2012
// 12349
// 1500
// 2017
//
//
//
// ---Add method---
// FINKI-Piano
// 1. 12345 2000 990
// 2. 12346 2010 1200
// 3. 12347 2015 1300
// FINKI-Piano
// 1. 12345 2000 990
// 2. 12346 2010 1200
// 3. 12347 2015 1300
// 4. 12348 2012 950
// FINKI-Piano
// 1. 12345 2000 990
// 2. 12346 2010 1200
// 3. 12347 2015 1300
// FINKI-Piano
// 1. 12345 2000 990
// 2. 12346 2010 1200
// 3. 12347 2015 1300
// 4. 12349 2017 1500

#include <iostream>
#include <cstring>
#include <stdlib.h>
using namespace std;

class Piano {
private:
    char serialNo[25];
    float price;
    int year;

public:
    Piano(const char *s = "", float p = 0.0, int y = 0) {
        strncpy(serialNo, s, 24);
        serialNo[24] = 0;
        price = p;
        year = y;
    }

    bool equals(Piano &p) {
        return (strcmp(serialNo, p.serialNo) == 0);
    }

    void print() {
        cout << serialNo << " " << year << " " << price << endl;
    }

    float getPrice() const {
        return price;
    }

    int getYear() const {
        return year;
    }

    char *getSerial() {
        return serialNo;
    }

    void setSerial(const char *s) {
        strncpy(serialNo, s, 24);
        serialNo[24] = 0;
    }
};

class PShop {
private:
    char name[50];
    int year;
    int n;
    Piano *list;

    void copy(const PShop &ps) {
        strcpy(name, ps.name);
        n = ps.n;
        list = new Piano[n];
        for (int i = 0; i < n; i++)
            list[i] = ps.list[i];
    }

public:
    PShop(const char *nm = "") {
        strncpy(name, nm, 49);
        name[49] = 0;
        n = 0;
        list = NULL;
    }

    PShop(const PShop &ps) {
        copy(ps);
    }

    PShop &operator=(const PShop &ps) {
        if (this != &ps) {
            delete [] list;
            copy(ps);
        }
        return *this;
    }

    float value() {
        float v = 0;
        for (int i = 0; i < n; i++)
            v += list[i].getPrice();
        return v;
    }

    void add(Piano &p) {
        Piano *tmp = new Piano[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = list[i];
        }

        tmp[n++] = p;
        delete [] list;
        list = tmp;
    }

    void sell(Piano &p) {
        int newN = 0;
        for (int i = 0; i < n; i++) {
            if (!list[i].equals(p)) {
                newN++;
            }
        }

        Piano *tmp = new Piano[newN];
        newN = 0;
        for (int i = 0; i < n; ++i) {
            if (!list[i].equals(p))
                tmp[newN++] = list[i];
        }

        delete [] list;
        list = tmp;
        n = newN;
    }

    void print() {
        cout << name << endl;
        for (int i = 0; i < n; i++) {
            cout << i + 1 << ". ";
            list[i].print();
        }
    }

    Piano getP(int i) {
        if (i >= 0 && i < n)
            return list[i];
        exit(1);
    }

    ~PShop() {
        delete [] list;
    }
};

int main() {
    int n;
    cin >> n;


    if (n == 1) {
        cout << "---Class Piano---" << endl;
        char serialNo[25];
        int pYear;
        float price;
        cin >> serialNo >> price >> pYear;
        Piano p(serialNo, price, pYear);
        p.print();
    } else if (n == 2) {
        cout << "---Equals---" << endl;
        char serialNo[25];
        int pYear;
        float price;
        cin >> serialNo >> price >> pYear;
        Piano p1(serialNo, price, pYear);
        Piano p2(p1);
        if (p1.equals(p2))
            cout << "Equality" << endl;
        else
            cout << "Inequality" << endl;
        p2.setSerial("12344");
        if (p1.equals(p2))
            cout << "Equality" << endl;
        else
            cout << "Inequality" << endl;
    } else if (n == 3) {
        cout << "---Class PShop---" << endl;
        char name[50];
        cin >> name;
        PShop ps(name);
        ps.print();
    } else if (n == 4) {
        cout << "---Add method---" << endl;
        char name[50];
        cin >> name;
        int no;
        cin >> no;
        PShop ps(name);
        char serialNo[25];
        int pYear;
        float price;
        for (int i = 0; i < no; i++) {
            cin >> serialNo >> price >> pYear;
            Piano p(serialNo, price, pYear);
            ps.add(p);
        }
        ps.print();
    } else if (n == 5) {
        cout << "---Add method---" << endl;
        char name[50];
        cin >> name;
        int no;
        cin >> no;
        PShop ps(name);
        char serialNo[25];
        int pYear;
        float price;
        for (int i = 0; i < no; i++) {
            cin >> serialNo >> price >> pYear;
            Piano p(serialNo, price, pYear);
            ps.add(p);
        }
        PShop ps2(ps), ps3;

        cin >> serialNo >> price >> pYear;
        Piano p1(serialNo, price, pYear);
        ps2.add(p1);

        ps.print();
        ps2.print();

        ps3 = ps;
        cin >> serialNo >> price >> pYear;
        Piano p2(serialNo, price, pYear);
        ps3.add(p2);

        ps.print();
        ps3.print();
    } else if (n == 6) {
        cout << "---value method---" << endl;
        char name[50];
        cin >> name;
        int no;
        cin >> no;
        PShop ps(name);
        char serialNo[25];
        int pYear;
        float price;
        for (int i = 0; i < no; i++) {
            cin >> serialNo >> price >> pYear;
            Piano p(serialNo, price, pYear);
            ps.add(p);
        }
        cout << "Total price: " << ps.value() << endl;
    } else if (n == 7) {
        cout << "---sell method---" << endl;
        char name[50];
        cin >> name;
        int no;
        cin >> no;
        PShop ps(name);
        char serialNo[25];
        int pYear;
        float price;
        for (int i = 0; i < no; i++) {
            cin >> serialNo >> price >> pYear;
            Piano p(serialNo, price, pYear);
            ps.add(p);
        }
        int d;
        cin >> d;
        Piano p1(ps.getP(d).getSerial());
        ps.sell(p1);
        ps.print();
    } else if (n == 8) {
        cout << "---Full Test---" << endl;
        char name[50];
        cin >> name;
        int no;
        cin >> no;
        PShop ps(name);
        char serialNo[25];
        int pYear;
        float price;
        for (int i = 0; i < no; i++) {
            cin >> serialNo >> price >> pYear;
            Piano p(serialNo, price, pYear);
            ps.add(p);
        }
        ps.print();

        cout << endl;

        PShop ps2(ps), ps3;

        cin >> serialNo >> price >> pYear;
        Piano p1(serialNo, price, pYear);
        ps2.add(p1);

        ps.print();
        ps2.print();

        ps3 = ps;
        cin >> serialNo >> price >> pYear;
        Piano p2(serialNo, price, pYear);
        ps3.add(p2);

        ps.print();
        ps3.print();

        cout << endl;

        cout << "Total price: " << ps.value() << endl;

        cout << endl;

        int d;
        cin >> d;
        Piano p3(ps.getP(d).getSerial());
        ps.sell(p3);
        ps.print();

        cout << "Total price: " << ps.value() << endl;
    }
    return 0;
}

