#include <iostream>
using namespace std;

class Book {
protected:
    string ISBN;

public:
    Book(const string &ISBN = "0000000000000") {
        this->ISBN = ISBN;
    }

    ~Book() {
    }

    void setISBN(const string &ISBN) {
        this->ISBN = ISBN;
    }

    void print() {
        cout << "ISBN: " << ISBN;
    }
};

class EBook : public Book {
private:
    float fileSize;

public:
    EBook(const string &ISBN = "0000000000000", const float fileSize = 0) : Book(ISBN) {
        this->fileSize = fileSize;
    }

    EBook(const EBook &e) {
        this->ISBN = e.ISBN;
        this->fileSize = e.fileSize;
    }

    EBook &operator=(const EBook &other) {
        if (this != &other) {
            this->ISBN = other.ISBN;
            this->fileSize = other.fileSize;
        }
        return *this;
    }

    ~EBook() {
    }

    void printInfo() {
        cout << "ISBN: " << ISBN << " - FILESIZE: " << fileSize << " MB." << endl;
    }

    void changeFileSize(float y) {
        if (fileSize - y < 50) {
            fileSize = fileSize + 15;
        } else {
            fileSize = fileSize - y;
        }
    }
};


int main() {
    int testCase;
    cin >> testCase;
    if (testCase == 1) {
        EBook m1 = EBook();
        m1.printInfo();
    } else if (testCase == 2) {
        EBook m2 = EBook("7896541233698", 45);
        m2.printInfo();
        m2.changeFileSize(20);
        m2.printInfo();
    } else if (testCase == 3) {
        EBook m3 = EBook("1234567891234", 15);
        m3.printInfo();
        m3.setISBN("7856945631235");
        m3.changeFileSize(20.4);
        m3.printInfo();
        m3.changeFileSize(88.65);
        m3.printInfo();
    } else if (testCase == 4) {
        string ISBN;
        float a;
        cin >> ISBN >> a;
        EBook m4 = EBook(ISBN, a);
        m4.printInfo();
        m4.changeFileSize(32);
        m4.printInfo();
    } else if (testCase == 5) {
        int n;
        float a;
        string ISBN;
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ISBN >> a;
            EBook m = EBook(ISBN, a);
            m.printInfo();
            m.changeFileSize(5.75);
            m.printInfo();
        }
    }


    return 0;
}
