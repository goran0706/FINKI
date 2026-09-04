#include <iostream>
#include <cstring>
using namespace std;

class Character {
private:
    char variable;

public:
    Character(const char variable = ' ') {
        this->variable = variable;
    }

    Character &operator=(const Character &other) {
        this->variable = other.variable;
        return *this;
    }

    ~Character() {
    }

    char getVariable() {
        return this->variable;
    }

    void setVariable(char variable) {
        this->variable = variable;
    }

    friend ostream &operator<<(ostream &os, const Character &character) {
        os << character.variable;
        return os;
    }
};

class CharSequence {
private:
    Character *array;
    int length;

public:
    CharSequence(const char *word = "") {
        this->length = strlen(word);
        this->array = new Character[this->length];
        for (int i = 0; i < this->length; i++) {
            this->array[i] = Character(word[i]);
        }
    }

    CharSequence &operator=(const CharSequence &other) {
        if (this != &other) {
            delete [] this->array;
            this->length = other.length;
            this->array = new Character[this->length];
            for (int i = 0; i < this->length; i++) {
                this->array[i] = other.array[i];
            }
        }
        return *this;
    }

    CharSequence(const CharSequence &other) {
        this->length = other.length;
        this->array = new Character[this->length];
        for (int i = 0; i < this->length; i++) {
            this->array[i] = other.array[i];
        }
    }

    ~CharSequence() {
        delete[] this->array;
    }

    Character &operator[](int i) {
        return array[i];
    }

    CharSequence &operator +=(const Character &c) {
        Character *temp = new Character [length + 1];
        for (int i = 0; i < length; i++) {
            temp[i] = this->array[i];
        }
        temp[length] = c;
        delete [] this->array;
        this->array = temp;
        length++;
        return *this;
    }

    bool operator==(const CharSequence &cs) const {
        if (this->length != cs.length) {
            return false; // If lengths are different, return false immediately
        }

        for (int i = 0; i < this->length; i++) {
            if (array[i].getVariable() != cs.array[i].getVariable()) {
                return false; // If any character is different, return false
            }
        }

        return true; // If we reach here, both CharSequences are equal
    }

    int operator[](char c) {
        int count = 0;
        for (int i = 0; i < this->length; i++) {
            if (array[i].getVariable() == c) {
                count++;
            }
        }
        return count;
    }

    CharSequence toUpperCase() {
        for (int i = 0; i < this->length; i++) {
            array[i].setVariable(toupper(array[i].getVariable()));
        }
        return *this;
    }

    friend ostream &operator<<(ostream &os, const CharSequence &cs) {
        for (int i = 0; i < cs.length; i++) {
            os << cs.array[i];
        }
        return os;
    }
};

int main() {
    // Character c1 = Character('a');
    // Character c2 = Character('b');
    // Character c3 = Character('c');
    // Character c4 = Character('d');
    // Character c5 = Character('e');
    // Character c6 = Character('f');
    //
    // cout << c1 << endl;
    // cout << c2 << endl;
    // cout << c3 << endl;
    // cout << c4 << endl;
    // cout << c5 << endl;
    // cout << c6 << endl;
    //
    // cout<<c1.getVariable()<<endl;
    //
    // c1.setVariable('h');
    //
    // cout << c1.getVariable()<<endl;
    //
    // Character c7 = c1;
    //
    // cout << c7.getVariable()<<endl;
    //
    // cout<<"================================"<<endl;
    // CharSequence word = CharSequence ("ZbbbbBBBBr ");
    // CharSequence word2 = CharSequence ("Zbor ");
    // word += c1;
    // cout << word << endl;
    //
    // cout << word2 << endl;
    // // word2[2]='b';
    // // word2+=c1;
    // // word2+=c2;
    // // word2+=c3;
    // // word2+=c4;
    // // word2+=c5;
    // // word2+=c6;
    // CharSequence word3 = word2;
    // bool smth = word3 == word2;
    // cout<< smth <<endl;
    //
    // cout<<word['b']<<endl;
    //
    // cout<<word.toUpperCase()<<endl;


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
