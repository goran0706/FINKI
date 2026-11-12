// Да се дефинира класа Book која ќе претставува една книга.
// Треба да ги содржи следните полиња:
//
// title, насловот на книгата (string)
// author, авторот на книгата (string)
//
// За класата треба да се дефинира параметризиран конструктор и метод print().

// Да се дефинира класа DigitalCopy, која ќе ги претставува дигиталните параметри на книгата.
// Таа треба да ги содржи следните полиња:
//
// fileSize, големината на датотеката во MB (double)
// formats, низа од 3 стрингови кои ги претставуваат поддржаните формати (на пример: "PDF", "EPUB", "MOBI")
//
// За класата треба да се дефинира параметризиран конструктор и метод print().
// Во конструкторот треба да се провери:
//
// fileSize да е поголем од 0 и помал од 1000 MB – во спротивно, да се фрли исклучок од тип InvalidFileSizeException.
// Секој формат да биде "PDF", "EPUB" или "MOBI" – во спротивно, да се фрли исклучок од тип InvalidFormatException.
//
// Исклучоците треба да се фатат во main() функцијата, каде ќе се читаат податоци за n дигитални книги.

#include <iostream>
#include <string>

using namespace std;

class InvalidFormatException {
public:
    void print() {
        cout << "invalid form" << endl;
    }
};

class InvalidFileSizeException {
public:
    void print() {
        cout << "invalid file size" << endl;
    }
};

class Book {
protected:
    string title;
    string author;

public:
    Book() {
    }

    Book(string &title, string &author) {
        this->title = title;
        this->author = author;
    }

    virtual void print() const {
        cout << title << " " << author;
    }
};

class DigitalCopy : public virtual Book {
private:
    double fileSize;
    string formats[3];

public:
    DigitalCopy(double fileSize, string form[3]) {
        if (this->fileSize < 0 || this->fileSize > 1000) {
            throw InvalidFileSizeException();
        }
        this->fileSize = fileSize;
        for (int i = 0; i < 3; ++i) {
            if (form[i] != "PDF" && form[i] != "EPUB" && form[i] != "MOBI") {
                throw InvalidFormatException();
            }
            formats[i] = form[i];
        }
    }

    void print() const override {
        cout << " " << fileSize << "mb ";
        for (int i = 0; i < 3; ++i) {
            cout << formats[i] << " ";
        }
        cout << endl;
    }
};

class EBook : public virtual Book, public DigitalCopy {
public:
    EBook(string title, string author, double fileSize, string formats[3])
        : Book(title, author), DigitalCopy(fileSize, formats) {
    }

    void print() const override {
        cout << "EBook:" << endl;
        Book::print();
        DigitalCopy::print();
    }
};

class AudioBook : public virtual Book, public DigitalCopy {
public:
    AudioBook(string title, string author, double fileSize, string formats[3])
        : Book(title, author), DigitalCopy(fileSize, formats) {
    }

    void print() const override {
        cout << "AudioBook:" << endl;
        Book::print();
        DigitalCopy::print();
    }
};

int main() {
    int n;
    cin >> n;
    cin.ignore();

    for (int i = 0; i < n; ++i) {
        string title, author;
        double fileSize;
        string formats[3];

        getline(cin, title);
        getline(cin, author);
        cin >> fileSize;

        for (int j = 0; j < 3; ++j) {
            cin >> formats[j];
        }
        cin.ignore();

        try {
            if (i % 2 == 0) {
                EBook eb(title, author, fileSize, formats);
                eb.print();
            } else {
                AudioBook ab(title, author, fileSize, formats);
                ab.print();
            }
        } catch (InvalidFileSizeException &e) {
            e.print();
        } catch (InvalidFormatException &e) {
            e.print();
        }
    }

    return 0;
}
