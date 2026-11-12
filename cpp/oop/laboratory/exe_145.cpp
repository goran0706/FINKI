// Да се дефинира класа Symbol која чува char symbol.
// За класата да се дефинираат:
//
// Конструктор со default вредност *
// Метод toggleCase() кој:
// Ако е мала буква → голема
// Ако е голема → мала
// Ако не е буква → печати "Not a letter"
// Гетер за symbol
#include <iostream>
#include "cctype"
using namespace std;

class Symbol {
private:
    char symbol;

public:
    explicit Symbol(char symbol = '*') {
        this->symbol = symbol;
    }

    void toggleCase() {
        if (isalpha(symbol)) {
            if (islower(symbol)) {
                symbol = toupper(symbol);
            } else {
                symbol = tolower(symbol);
            }
        } else {
            cout << "Not a letter" << endl;
        }
    }

    char get() const {
        return symbol;
    }
};

int main() {
    Symbol obj;
    int n;
    cin >> n;
    int cmd;
    char c;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> c;
                obj = Symbol(c);
                cout << obj.get() << endl;
                break;
            case 2:
                obj.toggleCase();
                cout << obj.get() << endl;
                break;
            default:
                cout << obj.get() << endl;
                break;
        }
    }
}
