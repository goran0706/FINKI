#include <iostream>
using namespace std;

class Book {
private:
    string name;
    int number;

public:
    Book(const string &name = "TEST_BOOK", const int number = 0) {
        this->name = name;
        this->number = number;
    }

    Book(const Book &book) {
        this->name = book.name;
        this->number = book.number;
    }

    Book &operator=(const Book &book) {
        if (this != &book) {
            this->name = book.name;
            this->number = book.number;
        }
        return *this;
    }

    ~Book() {
    }

    int readPages(int pages) {
        if (number + pages <= 200) {
            number = number + pages;
            return number;
        } else {
            return number = 200;
        }
    }

    void print() {
        if (number < 100) {
            cout << name << " - ";
            cout << number << "/200 - ";
            cout << "IN PROGRESS" << endl;
        }
        if (number >= 100 && number < 200) {
            cout << name << " - ";
            cout << number << "/200 - ";
            cout << "ALMOST DONE" << endl;
        }
        if (number >= 200) {
            cout << name << " - ";
            cout << number << "/200 - ";
            cout << "FINISHED" << endl;
        }
    }
};

int main() {
    string command;
    Book s;
    string name;
    int pagesRead;

    while (cin >> command) {
        if (command == "constructor1") {
            cin >> name >> pagesRead;
            s = Book(name, pagesRead);
        } else if (command == "constructor2") {
            cin >> name;
            s = Book(name);
        } else if (command == "readPages") {
            cin >> pagesRead;
            s.readPages(pagesRead);
        } else if (command == "print") {
            s.print();
        }
    }


    return 0;
}
