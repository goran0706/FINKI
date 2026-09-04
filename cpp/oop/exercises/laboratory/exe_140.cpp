// Дадена е класа Book во која се чува податок за ISBN број на една книга, соодветен конструктор, сет метод и метод за печатење.
// Да се дефинира класа EBook која наследува од класата Book во која се чува променлива за големината на книгата (float fileSize) иницијално поставена на 0.
//
// За класата EBook да се дефинира:
// соодветен конструктор
// метод за печатење - void printInfo()  - во формат: ISBN: [isbn] - FILESIZE: [fileSize] MB.
// метод за промена на големината на фајлот за вредност y - void changeFileSize(float y), кој доколку големината на
// книгата намалена за вредност у е помала од 50, вредноста за големината на книгата ќе ја зголеми за 15, а во спротивно ќе ја намали за у.

#include <iostream>

using namespace std;

class Book {
protected:
    string ISBN;

public:
    Book(string ISBN = "0000000000000") {
        this->ISBN = ISBN;
    }

    void print() {
        cout << "ISBN: " << ISBN;
    }

    void setISBN(string s) {
        this->ISBN = s;
    }

    ~Book() {
    }
};

//YOUR CODE HERE!!!
class EBook : public Book {
    float fileSize;

public:
    explicit EBook(string ISBN = "0000000000000", float fileSize = 0) : Book(ISBN) {
        this->fileSize = fileSize;
    }

    void printInfo() {
        cout << "ISBN: " << ISBN << " - FILESIZE: " << fileSize << " MB." << endl;
    }

    void changeFileSize(float y) {
        if ((fileSize - y) <= 50.0) {
            fileSize += 15;
        } else {
            fileSize += y;
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
