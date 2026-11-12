// Implement class Pair that has a key (dynamically allocated array of characters) and value (real number) (5 points). For this class implement:
//
//     constructors and destructor (5 points)
//     operator for printing on the SO << in format ('[key]', [value]) (5 points)
//     operator ++ in prefix and postfix that increases the value for +1 (5 points)
//     operator + for addition of two objects of this class that returns a new object in which the key is the longer (in length) of the keys of the objects that are adding and the values are added. If both objects has keys with equal length take the key from the left on in the operation addition. (10 points)
//
// Implement a class Collection where you keep dynamically allocated array of objects from the class Pair and length of the array (5 points). For this class implement:
//
//     constructors and destructor (5 points)
//     operator += for adding new object of the class Pair in the array (5 points)
//     operator for printing on the SO << that prints the number of elements in the array, and then each object in a new line (5 points)
//     operator == for comparing two objects of this class. Two collections are equal if they have equal number of elements and all objects on corresponding positions are equal. (5 points)
//     method Pair* find(const char* key) that returns a pointer to the first objects with the provided key, if such object does not exist returns NULL pointer. (5 points)
//
// For example:
// Input 	Result
//
// some-key 55
// other-key 20
//
//
//
// ----- class Pair -----
// ----- constructor -----
// ----- operator << -----
// ('some-key', 55)
// ('other-key', 20)
// ----- operator ++(int) -----
// ('some-key', 55)
// ('some-key', 56)
// ----- operator ++ -----
// ('other-key', 21)
// ----- operator + -----
// ----- operator = -----
// ('other-key', 77)
// ----- class Collection -----
// ----- constructor -----
// ----- operator += -----
// ----- operator << -----
// Size: 3
// ('some-key', 56)
// ('other-key', 21)
// ('other-key', 77)
// ----- copy constructor -----
// ----- operator == -----
// k == k2
// ----- find -----
// ('other-key', 21)
// other-keyother not found

#include <iostream>
#include <cstring>
using namespace std;


// Your code here


void read(char *k, float *v) {
    cin >> k;
    cin >> *v;
}

int main() {
    char key[50];
    float value;
    cout << "----- class Pair -----" << endl;
    read(key, &value);
    cout << "----- constructor -----" << endl;
    Pair p1(key, value);
    read(key, &value);
    Pair p2(key, value);
    Pair p3(p1);
    cout << "----- operator << -----" << endl;
    cout << p1;
    cout << p2;
    cout << "----- operator ++(int) -----" << endl;
    cout << p1++;
    cout << p1;
    cout << "----- operator ++ -----" << endl;
    cout << ++p2;
    cout << "----- operator + -----" << endl;
    Pair p = p1 + p2;
    cout << "----- operator = -----" << endl;
    p3 = p;
    cout << p3;

    cout << "----- class Collection -----" << endl;
    cout << "----- constructor -----" << endl;
    Collection k;
    cout << "----- operator += -----" << endl;
    k += p1;
    k += p2;
    k += p3;
    cout << "----- operator << -----" << endl;
    cout << k;
    cout << "----- copy constructor -----" << endl;
    Collection k2(k);
    cout << "----- operator == -----" << endl;
    if (k == k2) {
        cout << "k == k2" << endl;
    }
    k2 += p1;
    if (k == k2) {
        // not equal
        cout << "k == k2" << endl;
    }
    cout << "----- find -----" << endl;
    Pair *f = k.find(key);
    cout << *f;
    strcat(key, "other");
    f = k.find(key);
    if (f == NULL) {
        cout << key << " not found" << endl;
    }
    return 0;
}

