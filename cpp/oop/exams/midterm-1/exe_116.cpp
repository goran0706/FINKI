// Implement a class for Character that holds single char variable with the needed constructors. (5 points)
//
// Then implement a class CharSequence that holds dynamically allocated array of objects of class Character and the length of the array. (5 points) This class should implement needed constructors and destructor (10 points) and the following methods and operators:
//
//     CharSequenc& operator[](int i) for accessing the i-th element of the sequence. (5 points)
//     CharSequence& operator +=(const Character &c) for adding new Character object. To add the new object, expand the dynamically allocated array for +1. (10 points)
//     bool operator==(const CharSequence &cs) that will compare two CharSequence objects. Two objects are equal if they have equal arrays of Character objects, and two Character objects are equal if they hold equal character. (5 points)
//     int operator[](char c) that will return how many times the character c apears in the CharSequence object. (5 points)
//     CharSequence toUpperCase() that will return a new CharSequence object, where all characters will be in lowercase. (10 points)
//
// For both classes implement the operator << for printing the contents to the standard output. (5 points)
//
// For example:
// Input 	Result
//
// 2
// char_sequence_object
//
//
//
// Testing CharSequence constructors
// char_sequence_object

#include <iostream>
#include <cstring>
using namespace std;


// your code here


int main() {
    int n;
    cin >> n;

    if (n == 1) {
        cout << "Testing Character class" << endl;
        cout << "Character constructor" << endl;
        char c;
        cin >> c;
        Character cc(c);
        cout << "OK" << endl;
        cout << "Character operator <<" << endl;
        cout << cc << endl;
    } else if (n == 2) {
        cout << "Testing CharSequence constructors" << endl;
        char word[100];
        cin >> word;
        CharSequence cs1(word);
        cout << cs1 << endl;
    } else if (n == 3) {
        cout << "Testing CharSequence copy constructor and operator[int]" << endl;
        CharSequence cs("Some sequence");
        CharSequence copy(cs);
        cs[0] = 'X';
        cout << "Original: " << cs << endl;
        cout << "Copy: " << copy << endl;
    } else if (n == 4) {
        cout << "Testing CharSequence =operator and operator[int]" << endl;
        CharSequence cs("Some sequence");
        CharSequence copy;
        copy = cs;
        cs[0] = 'X';
        cout << "Original: " << cs << endl;
        cout << "Copy: " << copy << endl;
    } else if (n == 5) {
        cout << "Testing CharSequence operator+=" << endl;
        CharSequence cs;
        char word[100];
        cin >> word;
        int len = strlen(word);
        for (int i = 0; i < len; ++i) {
            cs += Character(word[i]);
        }
        cout << cs << endl;
    } else if (n == 6) {
        cout << "Testing CharSequence operator[char]" << endl;
        CharSequence cs(
            "If you don't read the newspaper, you're uninformed. If you read the newspaper, you're mis-informed.");
        cout << cs['e'] << endl;
    } else if (n == 7) {
        cout << "Testing CharSequence toUpperCase" << endl;
        CharSequence cs("If you tell the truth, you don't have to remember anything");
        cout << cs.toUpperCase() << endl;
    } else if (n == 8) {
        cout << "Testing CharSequence operator ==" << endl;
        CharSequence cs1("abc");
        CharSequence cs2("abc");
        CharSequence cs3("abcd");
        CharSequence cs4("xyz");
        cout << (cs1 == cs2) << endl;
        cout << (cs1 == cs3) << endl;
        cout << (cs2 == cs4) << endl;
    }

    return 0;
}

