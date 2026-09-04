// За потребите на една библиотека, потребно е да изработите програма која што ќе ја менаџира работата во истата.
// Библиотеката нуди два вида предмети:

// Книгa (Book)
// Друштвенa игрa (BoardGame)
// За таа цел потребно е да изработите класа LibraryItem која што ќе ги има следните информации:

// име - низа од максимум 100 знаци
// автор - низа од максимум 100 знаци
// година на издавање - цел број
// цена за изнајмување по час - децимален број
// За оваа класа потребно е да креирате:

// Default конструктор
// Конструктор со параметри
// Copy конструктор
// Оператор =
// Функција која што ја враќа цената за изнајмување на предметот по час (getRentPricePerHour)
// Функција print што ги печати информациите за предметот во формат:
// [име] - [автор]
// Понатаму, класата за книга (Book) треба да наследува од класата LibraryItem и дополнително да ги има следниве информации:

// број на страници - цел број
// жанр - низа од максимум 50 знаци
// За оваа класа потребно е да креирате:

// Default конструктор
// Конструктор со параметри
// Функција која што ја враќа цената за изнајмување на книгата по час (getRentPricePerHour) која што се пресметува
// така што на цената што ја добивате од класата LibraryItem дополнително додавате 10% за секои 100 страници од книгата.
// Пример, доколку цената по час што ја добивате од класата LibraryItem е 10 долари и книгата има 400 страници,
// овде функцијата треба да врати 14 долари затоа што 10 + (400/100) * (10*0.1) = 14.
// Функција print што ги печати информациите за книгата во формат:
// [име] - [автор] - [број на страници] - [жанр] - [цена по час]$
// Понатаму, класата за друштвена игра (BoardGame) треба да наследува од класата LibraryItem и дополнително да ги има следниве информации:

// број на играчи - цел број
// препорачана возраст - низа од максимум 50 знаци
// За оваа класа потребно е да креирате:

// Default конструктор
// Конструктор со параметри
// Функција која што ја враќа цената за изнајмување на играта по час (getRentPricePerHour) која што се пресметува
// така што на цената што ја добивате од класата LibraryItem дополнително додавате 30%.
// Пример, доколку цената по час што ја добивате од класата LibraryItem е 10 долари, овде функцијата треба да врати 13 долари затоа што 10 + 10 *0.3 = 13.
// Функција print што ги печати информациите за играта во формат:
// [име] - [автор] - [број на играчи] - [препорачана возраст] - [цена по час]$
#include <iostream>
#include <cstring>

using namespace std;

// YOUR CODE STARTS HERE
class LibraryItem {
protected:
    char name[101];
    char author [101];
    int year;
    double hour;
public:
    LibraryItem() {
        *name = '\0';
        *author = '\0';
        year=0;
        hour=0;
    }
    LibraryItem(char *name, char *author, int year, double hour) {
        strcpy(this->name,name);
        strcpy(this->author,author);
        this->year=year;
        this->hour=hour;
    }
    LibraryItem(const LibraryItem &l) {
        strcpy(this->name,l.name);
        strcpy(this->author,l.author);
        this->year=l.year;
        this->hour=l.hour;
    }
    ~LibraryItem() {

    }
    virtual double getRentPricePerHour() {
        return hour;
    };
    virtual void print() {
        cout<<name<<" - "<<author;
    }
};
class Book:public LibraryItem {
private:
    int pages;
    char genre[51];
public:
    Book():LibraryItem() {
        pages=0;
        *genre = '\0';
    }
    Book(const LibraryItem &l, int pages, char *genre):LibraryItem(l) {
        this->pages=pages;
        strcpy(this->genre,genre);
    }
    double getRentPricePerHour() {
        return hour + ( pages / 100) * hour *0.1;
    }
    void print() {
        LibraryItem::print();
        cout<<" - "<<pages<<" - "<<genre<<" - "<<getRentPricePerHour()<<"$"<<endl;
    }

};
class BoardGame:public LibraryItem {
private:
    int igrachi;
    char vozrast[51];
public:
    BoardGame():LibraryItem() {
        igrachi=0;
        *vozrast = '\0';
    }
    BoardGame(const LibraryItem &l, int igrachi, char *vozrast):LibraryItem(l) {
        this->igrachi=igrachi;
        strcpy(this->vozrast,vozrast);
    }
    double getRentPricePerHour() {
        return hour + hour * 0.3;
    }
    void print() {
        LibraryItem::print();
        cout<<" - "<<igrachi<<" - "<<vozrast<<" - "<<getRentPricePerHour()<<"$"<<endl;
    }
};

// DO NOT CHANGE THE MAIN FUNCTION
int main() {
    int n;
    cin >> n;
    char name[100];
    char author[100];
    int publicationYear;
    double rentalPricePerHour;

    for (int i = 0; i < n; i++) {
        cin >> name;
        cin >> author;
        cin >> publicationYear;
        cin >> rentalPricePerHour;

        LibraryItem item = LibraryItem(name, author, publicationYear, rentalPricePerHour);

        if (i % 2) {
            int numPages;
            char genre[50];
            cin >> numPages;
            cin >> genre;
            Book book = Book(item, numPages, genre);
            book.print();
        } else {
            int numPlayers;
            char recommendedAge[50];
            cin >> numPlayers;
            cin >> recommendedAge;
            BoardGame game = BoardGame(item, numPlayers, recommendedAge);
            game.print();
        }
    }

    return 0;
}