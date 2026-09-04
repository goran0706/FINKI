// Implement class Pair that has a key (dynamically allocated array of characters) and value (integer) (5 points). For this class implement:
//
// constructors and destructor (5 points)
// operator for printing on the SO << in format '[key]' -> [value] (5 points)
// operator -- in prefix and postfix that decreases the value for -1 (5 points)
// operator * for multiplying two objects of this class and returns new object where the key is the shorter (in length) of the keys of the two objects that are multiplying, and the value is a product of the values of the two objects. If both objects has keys with same length take the right object's key in the multiply operation. (10 points)
//
// Implement a class Collection where you keep dynamically allocated array of objects from the class Pair and length of the array (5 points). For this class implement:
//
// constructors and destructor (5 points)
// operator += for adding new object of the class Pair in the array (5 points)
// operator for printing on the SO << that prints the number of elements in the array, and then each object in a new line (5 points)
// operator < for comparing two objects of this class using the value of the product of all pairs in the collection (5 points)
// method int greater(int value) that returns the count of the pairs that have value greater then the passed argument value. (5 points)
//
// For example:
// Input 	Result
//
// some-key 55
// other-key 20
// 55
//
//
//
// ----- class Pair -----
// ----- constructor -----
// ----- operator << -----
// 'some-key' -> 55
// 'other-key' -> 20
// ----- operator --(int) -----
// 'some-key' -> 55
// 'some-key' -> 54
// ----- operator -- -----
// 'other-key' -> 19
// ----- operator * -----
// ----- operator = -----
// 'some-key' -> 1026
// ----- class Collection -----
// ----- constructor -----
// ----- operator += -----
// ----- operator << -----
// Size: 3
// 'some-key' -> 54
// 'other-key' -> 19
// 'some-key' -> 1026
// ----- copy constructor -----
// ----- operator < -----
// k >= k2
// k < k2
// ----- greater -----
// 1

#include <iostream>
#include <cstring>
using namespace std;


// vashiot kod ovde


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
    cout << "----- operator --(int) -----" << endl;
    cout << p1--;
    cout << p1;
    cout << "----- operator -- -----" << endl;
    cout << --p2;
    cout << "----- operator * -----" << endl;
    Pair p = p1 * p2;
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
    Kolekcija k2(k);
    cout << "----- operator < -----" << endl;
    if (k < k2) {
        cout << "k < k2" << endl;
    } else {
        cout << "k >= k2" << endl;
    }
    k2 += p1;
    if (k < k2) {
        cout << "k < k2" << endl;
    } else {
        cout << "k >= k2" << endl;
    }
    cout << "----- greater -----" << endl;
    int x;
    cin >> x;
    int pp = k.greater(x);
    cout << pp;
    return 0;
}
