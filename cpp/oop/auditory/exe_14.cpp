/*
    1.2 Библиотека (friend)

    Да се дефинира класа Book која соджи информации за:

    - името на книгата,
    - името на авторот и
    - нејзината достапност.

    За оваа класа да се дефинираат сите три конструктори и деструктор.

    Да се дефинира класа Library која е пријател на класата Book.

    Во оваа класа се чува името на библиотеката(иницијално поставено “Braka Miladinovci”), низа објекти од класата Book и бројот на книги(иницијално поставен на 0).

    За оваа класа да се дефинира метод addBook кој додава книга во низата книги и метод за печатење на сите информации за библиотеката.

    Да се дефинира и трета класа LibraryMember во која се чуваат информации за име и идентификациски број, за членот во библиотеката.

    Да се обезбедат соодветни конструктори, деструктори, set и get методи доколку се потребни.

    Да се дефинира функција checkOutBook која е пријател на сите три класи и како аргументи прима еден член, библиотека и индекс на една книга.
    Со оваа функција треба да се ажурира достапноста кога некој ќе побара книга и да се печати соодветна порака ако книгата не е достапна.

    Во главната програма да се направи еден објект од класата Library, да се внесат информации за најмногу 30 книги и истите да се додадат во библиотеката.

    Потоа да се испечатат информациите за библиотеката. Да се креира и еден член на библиотеката и дополнително да се внесе редниот број на книгата што сака да ја позајми.

    Да се провери дали таа книга е достапна.

*/
#include <cstring>
#include <iostream>
using namespace std;

enum {
    TitleLen = 50,
    AuthorLen = 50,
    LibraryLen = 50,
    BookSize = 100,
    MemberNameLen = 50
};

class LibraryMember;
class Library;

class Book {
private:
    char title[TitleLen]{};
    char author[AuthorLen]{};
    bool available;

public:
    Book() {
        this->title[0] = '\0';
        this->author[0] = '\0';
        this->available = false;
    }

    Book(const char *title, const char *author, bool available = true) {
        strncpy(this->title, title, TitleLen - 1);
        this->title[TitleLen - 1] = '\0';
        strncpy(this->author, author, AuthorLen - 1);
        this->author[AuthorLen - 1] = '\0';
        this->available = available;
    }

    Book(const Book &other) {
        strncpy(this->title, other.title, TitleLen - 1);
        this->title[TitleLen - 1] = '\0';
        strncpy(this->author, other.author, AuthorLen - 1);
        this->author[AuthorLen - 1] = '\0';
        this->available = other.available;
    }

    ~Book() = default;

    [[nodiscard]] const char *getTitle() const { return title; }
    [[nodiscard]] const char *getAuthor() const { return author; }
    [[nodiscard]] bool isAvailable() const { return available; }

    void print() const {
        cout << "Naslov: " << title;
        cout << " | Avtor: " << author;
        cout << " | Status: " << (available ? "Dostapna" : "Zafatena") << endl;
    }

    /*
        FRIEND ДЕКЛАРАЦИИ: Им даваме целосна дозвола на класата Library и на глобалната функција checkOutBook
        директно да копаат по приватните полиња (title, author, available)
    */
    friend class Library;

    friend void checkOutBook(const LibraryMember &member, Library &library, const int bookIndex);
};

class Library {
private:
    char name[LibraryLen]{};
    Book books[BookSize];
    int booksCount;

public:
    Library() {
        strncpy(this->name, "Braka Miladinovci", LibraryLen - 1);
        this->name[LibraryLen - 1] = '\0';
        this->booksCount = 0;
    }

    explicit Library(const char *name) {
        strncpy(this->name, name, LibraryLen - 1);
        this->name[LibraryLen - 1] = '\0';
        this->booksCount = 0;
    }

    ~Library() = default;

    void addBook(const Book &book) {
        if (booksCount < BookSize) {
            books[booksCount++] = book;
        }
    }

    void print() const {
        cout << "\n--- Biblioteka: " << name << " (Vkupno knigi: " << booksCount << ") ---" << endl;
        for (int i = 0; i < booksCount; i++) {
            cout << i << ". ";
            books[i].print();
        }
    }


    /*
        FRIEND ДЕКЛАРАЦИЈА: Глобалната функција има дозвола да пристапи до
        приватната низа books и приватното поле booksCount без потреба од гетери
    */
    friend void checkOutBook(const LibraryMember &member, Library &library, const int bookIndex);
};

class LibraryMember {
private:
    char name[MemberNameLen]{};
    int id;

public:
    LibraryMember() {
        this->name[0] = '\0';
        this->id = 0;
    }

    LibraryMember(const char *name, int id) {
        strncpy(this->name, name, MemberNameLen - 1);
        this->name[MemberNameLen - 1] = '\0';
        this->id = id;
    }

    ~LibraryMember() = default;

    /* FRIEND ДЕКЛАРАЦИЈА: Исто и тука, функцијата може директно да ги чита name и id на членот */
    friend void checkOutBook(const LibraryMember &member, Library &library, const int bookIndex);
};

void checkOutBook(const LibraryMember &member, Library &library, const int bookIndex) {
    if (bookIndex < 0 || bookIndex >= library.booksCount) {
        cout << "Nevaliden indeks na kniga!" << endl;
        return;
    }

    if (library.books[bookIndex].available) {
        library.books[bookIndex].available = false;
        cout << "Clenot " << member.name << " (ID: " << member.id
                << ") uspeshno ja pozajmi knigata: " << library.books[bookIndex].title << endl;
    } else {
        cout << "Greska: Knigata '" << library.books[bookIndex].title << "' NE E DOSTAPNA za pozajmuvanje!" << endl;
    }
}

int main() {
    Library lib;

    int n;
    cout << "Vnesi broj na knigi (najmnogu 30): ";
    if (!(cin >> n)) return 0;
    cin.ignore();

    if (n > 30) n = 30;

    for (int i = 0; i < n; i++) {
        char title[TitleLen];
        char author[AuthorLen];
        int availInput;

        cout << "Vnesi naslov za kniga " << i << ": ";
        cin.getline(title, TitleLen);
        cout << "Vnesi avtor za kniga " << i << ": ";
        cin.getline(author, AuthorLen);
        cout << "Dostapna? (1 za Da, 0 za Ne): ";
        cin >> availInput;
        cin.ignore();

        Book b(title, author, availInput == 1);
        lib.addBook(b);
    }

    lib.print();

    char memberName[MemberNameLen];
    int memberId;
    cout << "\n--- Kreiranje na clen ---" << endl;
    cout << "Vnesi ime na clenot: ";
    cin.getline(memberName, MemberNameLen);
    cout << "Vnesi ID na clenot: ";
    cin >> memberId;

    LibraryMember member(memberName, memberId);

    int wantedIndex;
    cout << "Vnesi go redniot broj (indeksot) na knigata: ";
    cin >> wantedIndex;

    checkOutBook(member, lib, wantedIndex);
    lib.print();

    return 0;
}
