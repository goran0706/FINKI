#include "iostream"
#include "cstring"
using namespace std;

class Book {
protected:
    char isbn[21];
    char title[51];
    char author[31];
    float basePrice;

public:
    Book() {
        *isbn = '\0';
        *title = '\0';
        *author = '\0';
        basePrice = 0;
    }

    Book(char *isbn, char *title, char *author, float basePrice) {
        strcpy(this->isbn, isbn);
        strcpy(this->title, title);
        strcpy(this->author, author);
        this->basePrice = basePrice;
    }

    Book(const Book &o) {
        strcpy(this->isbn, o.isbn);
        strcpy(this->title, o.title);
        strcpy(this->author, o.author);
        this->basePrice = o.basePrice;
    }

    Book &operator =(const Book &o) {
        if (this != &o) {
            strcpy(this->isbn, o.isbn);
            strcpy(this->title, o.title);
            strcpy(this->author, o.author);
            this->basePrice = o.basePrice;
        }
        return *this;
    }

    ~Book() {
    }

    virtual double bookPrice() const = 0;

    bool operator >(const Book &other) const {
        return basePrice > other.basePrice;
    }

    friend ostream &operator <<(ostream &out, const Book &b) {
        out << b.isbn << ": " << b.title << ", " << b.author << " " << b.bookPrice() << endl;
        return out;
    }

    char *setISBN(char *s) {
        strcpy(this->isbn, s);
    }
};

class OnlineBook : public Book {
private:
    char *url;
    int mb;

public:
    OnlineBook() : Book() {
        this->url = new char[1];
        this->url[0] = '\0';
        mb = 0;
    }

    OnlineBook(char *isbn, char *title, char *author, float basePrice, char *url, int mb) : Book(
        isbn, title, author, basePrice) {
        this->url = new char[strlen(url) + 1];
        strcpy(this->url, url);
        this->mb = mb;
    }

    OnlineBook(const OnlineBook &o) : Book(o) {
        this->url = new char[strlen(o.url) + 1];
        strcpy(this->url, o.url);
        this->mb = o.mb;
    }

    OnlineBook &operator=(const OnlineBook &o) {
        if (this != &o) {
            delete[]url;
            Book::operator=(o);
            this->url = new char[strlen(o.url) + 1];
            strcpy(this->url, o.url);
            this->mb = o.mb;
        }
        return *this;
    }

    ~OnlineBook() {
        delete[]url;
    }

    double bookPrice() const override {
        if (mb > 20) {
            return basePrice * 1.20;
        } else {
            return basePrice;
        }
    }
};

class PrintBook : public Book {
private:
    float weight;
    bool inStock;

public:
    PrintBook() : Book() {
        weight = 0;
        inStock = false;
    }

    PrintBook(char *isbn, char *title, char *author, float basePrice, float weight, bool inStock) : Book(
        isbn, title, author, basePrice) {
        this->weight = weight;
        this->inStock = inStock;
    }

    double bookPrice() const override {
        if (weight > 0.7) {
            return basePrice * 1.15;
        }
        return basePrice;
    }
};

void mostExpensiveBook(Book **books, int n) {
    int printedBooks = 0;
    int onlineBooks = 0;
    for (int i = 0; i < n; ++i) {
        if (dynamic_cast<OnlineBook *>(books[i])) {
            onlineBooks++;
        }
        if (dynamic_cast<PrintBook *>(books[i])) {
            printedBooks++;
        }
    }
    cout << "FINKI-Education" << endl;
    cout << "Total number of online books: " << onlineBooks << endl;
    cout << "Total number of print books: " << printedBooks << endl;
    cout << "The most expensive book is: " << endl;
    double max = books[0]->bookPrice();
    int index = 0;
    for (int i = 0; i < n; ++i) {
        if (books[i]->bookPrice() > max) {
            max = books[i]->bookPrice();
            index = i;
        }
    }
    cout << *books[index];
}

int main() {
    char isbn[20], title[50], author[30], url[100];
    int size, tip;
    float price, weight;
    bool inStock;
    Book **books;
    int n;

    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "====== Testing OnlineBook class ======" << endl;
        cin >> n;
        books = new Book *[n];

        for (int i = 0; i < n; i++) {
            cin >> isbn;
            cin.get();
            cin.getline(title, 50);
            cin.getline(author, 30);
            cin >> price;
            cin >> url;
            cin >> size;
            cout << "CONSTRUCTOR" << endl;
            books[i] = new OnlineBook(isbn, title, author, price, url, size);
            cout << "OPERATOR <<" << endl;
            cout << *books[i];
        }
        cout << "OPERATOR >" << endl;
        cout << "Rezultat od sporedbata e: " << endl;
        if (*books[0] > *books[1])
            cout << *books[0];
        else
            cout << *books[1];
    }
    if (testCase == 2) {
        cout << "====== Testing OnlineBook CONSTRUCTORS ======" << endl;
        cin >> isbn;
        cin.get();
        cin.getline(title, 50);
        cin.getline(author, 30);
        cin >> price;
        cin >> url;
        cin >> size;
        cout << "CONSTRUCTOR" << endl;
        OnlineBook ob1(isbn, title, author, price, url, size);
        cout << ob1 << endl;
        cout << "COPY CONSTRUCTOR" << endl;
        OnlineBook ob2(ob1);
        cin >> isbn;
        ob2.setISBN(isbn);
        cout << ob1 << endl;
        cout << ob2 << endl;
        cout << "OPERATOR =" << endl;
        ob1 = ob2;
        cin >> isbn;
        ob2.setISBN(isbn);
        cout << ob1 << endl;
        cout << ob2 << endl;
    }
    if (testCase == 3) {
        cout << "====== Testing PrintBook class ======" << endl;
        cin >> n;
        books = new Book *[n];

        for (int i = 0; i < n; i++) {
            cin >> isbn;
            cin.get();
            cin.getline(title, 50);
            cin.getline(author, 30);
            cin >> price;
            cin >> weight;
            cin >> inStock;
            cout << "CONSTRUCTOR" << endl;
            books[i] = new PrintBook(isbn, title, author, price, weight, inStock);
            cout << "OPERATOR <<" << endl;
            cout << *books[i];
        }
        cout << "OPERATOR >" << endl;
        cout << "Rezultat od sporedbata e: " << endl;
        if (*books[0] > *books[1])
            cout << *books[0];
        else
            cout << *books[1];
    }
    if (testCase == 4) {
        cout << "====== Testing method mostExpensiveBook() ======" << endl;
        cin >> n;
        books = new Book *[n];

        for (int i = 0; i < n; i++) {
            cin >> tip >> isbn;
            cin.get();
            cin.getline(title, 50);
            cin.getline(author, 30);
            cin >> price;
            if (tip == 1) {
                cin >> url;
                cin >> size;

                books[i] = new OnlineBook(isbn, title, author, price, url, size);
            } else {
                cin >> weight;
                cin >> inStock;

                books[i] = new PrintBook(isbn, title, author, price, weight, inStock);
            }
        }

        mostExpensiveBook(books, n);
    }

    for (int i = 0; i < n; i++) delete books[i];
    delete[] books;
    return 0;
}
