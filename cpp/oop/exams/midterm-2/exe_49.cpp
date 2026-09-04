#include <iostream>
#include <cstring>
using namespace std;

class OnlineBook;
class PrintBook;

class Book {
protected:
	char ISBN[20];
	char title[50];
	char author[30];
	float price;

public:
	Book(const char *ISBN = "", const char *title = "", const char *author = "", const float price = 0) {
		strcpy(this->ISBN, ISBN);
		strcpy(this->title, title);
		strcpy(this->author, author);
		this->price = price;
	}

	virtual ~Book() {
	}

	virtual float bookPrice() = 0;

	void setISBN(const char *ISBN) {
		strcpy(this->ISBN, ISBN);
	}

	virtual bool operator>(const Book &other) const = 0;

	friend ostream &operator<<(ostream &os, Book &b) {
		os << b.ISBN << ": " << b.title << ", " << b.author << " " << b.bookPrice() << endl;
		return os;
	}

	float getPrice() const {
		return price;
	}
};

class OnlineBook : public Book {
	char *URL;
	int size;

public:
	OnlineBook(const char *ISBN = "", const char *title = "", const char *author = "", const float price = 0,
	           const char *URL = "", const int size = 0)
		: Book(ISBN, title, author, price) {
		this->URL = new char[strlen(URL) + 1];
		strcpy(this->URL, URL);
		this->size = size;
	}

	OnlineBook(const OnlineBook &other) : Book(other) {
		this->URL = new char[strlen(other.URL) + 1];
		strcpy(this->URL, other.URL);
		this->size = other.size;
	}

	OnlineBook &operator=(const OnlineBook &other) {
		if (this != &other) {
			Book::operator=(other);
			delete[] URL;
			this->URL = new char[strlen(other.URL) + 1];
			strcpy(this->URL, other.URL);
			this->size = other.size;
		}
		return *this;
	}

	~OnlineBook() {
		delete[] URL;
	}

	float bookPrice() override {
		if (this->size > 20) {
			return this->price * 1.2;
		} else {
			return this->price;
		}
	}

	bool operator>(const Book &other) const override {
		return this->price > other.getPrice();
	}
};

class PrintBook : public Book {
	float weight;
	bool available;

public:
	PrintBook(const char *ISBN = "", const char *title = "", const char *author = "", const float price = 0,
	          const float weight = 0, const bool available = false)
		: Book(ISBN, title, author, price) {
		this->weight = weight;
		this->available = available;
	}

	PrintBook(const PrintBook &other) : Book(other) {
		this->weight = other.weight;
		this->available = other.available;
	}

	PrintBook &operator=(const PrintBook &other) {
		if (this != &other) {
			Book::operator=(other);
			this->weight = other.weight;
			this->available = other.available;
		}
		return *this;
	}

	~PrintBook() {
	}

	float bookPrice() override {
		if (this->weight > 0.7) {
			return this->price * 1.15;
		} else {
			return this->price;
		}
	}

	bool operator>(const Book &other) const override {
		return this->price > other.getPrice();
	}
};

void mostExpensiveBook(Book **books, int n) {
	int onlineCount = 0, printCount = 0;
	int maxIndex = 0;

	for (int i = 0; i < n; i++) {
		OnlineBook *online = dynamic_cast<OnlineBook *>(books[i]);
		PrintBook *print = dynamic_cast<PrintBook *>(books[i]);

		if (online != nullptr) {
			onlineCount++;
		} else if (print != nullptr) {
			printCount++;
		}

		if (*books[i] > *books[maxIndex]) {
			maxIndex = i;
		}
	}
	cout << "FINKI-Education" << endl;
	cout << "Total number of online books: " << onlineCount << endl;
	cout << "Total number of print books: " << printCount << endl;
	cout << "The most expensive book is:" << endl;
	cout << *books[maxIndex];
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
