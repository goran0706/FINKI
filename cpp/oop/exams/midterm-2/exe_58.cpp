#include <iostream>
#include <cstring>
using namespace std;

class Oglas {
private:
	char title[50];
	char category[30];
	char description[100];
	float price;

public:
	Oglas(const char *title = "", const char *category = "", const char *description = "", float price = 0) {
		strcpy(this->title, title);
		strcpy(this->category, category);
		strcpy(this->description, description);
		this->price = price;
	}

	Oglas(const Oglas &o) {
		strcpy(this->title, o.title);
		strcpy(this->category, o.category);
		strcpy(this->description, o.description);
		this->price = o.price;
	}

	Oglas &operator=(const Oglas &o) {
		if (this != &o) {
			strcpy(this->title, o.title);
			strcpy(this->category, o.category);
			strcpy(this->description, o.description);
			this->price = o.price;
		}
		return *this;
	}

	~Oglas() {
	}

	bool operator >(const Oglas &o) const {
		return price > o.price;
	}

	friend ostream &operator<<(ostream &os, const Oglas &o) {
		os << o.title << endl;
		os << o.description << endl;
		os << o.price << " evra" << endl;
		return os;
	}

	const float getPrice() const {
		return price;
	}

	const char *getCategory() const {
		return category;
	}
};

class NegativnaVrednost : exception {
private:
	char message[100];

public:
	NegativnaVrednost(const char *message = "") {
		strcpy(this->message, message);
	}

	void print() const {
		cout << message << endl;
	}
};

class Oglasnik {
private:
	char name[20];
	Oglas *array;
	int n;

public:
	Oglasnik(const char *name = "") {
		strcpy(this->name, name);
		array = nullptr;
		n = 0;
	}

	Oglasnik(const Oglasnik &o) {
		strcpy(this->name, o.name);
		this->n = o.n;
		array = new Oglas[this->n];
		for (int i = 0; i < this->n; i++) {
			array[i] = o.array[i];
		}
	}

	Oglasnik &operator=(const Oglasnik &o) {
		if (this != &o) {
			delete [] array;
			strcpy(this->name, o.name);
			this->n = o.n;
			array = new Oglas[this->n];
			for (int i = 0; i < this->n; i++) {
				array[i] = o.array[i];
			}
		}
		return *this;
	}

	~Oglasnik() {
		delete[] array;
	}

	Oglasnik &operator +=(const Oglas &o) {
		if (o.getPrice() < 0) {
			throw NegativnaVrednost("Oglasot ima nevalidna vrednost za cenata i nema da bide evidentiran!");
		}
		Oglas *temp = new Oglas[this->n + 1];
		for (int i = 0; i < this->n; i++) {
			temp[i] = array[i];
		}
		temp[n] = o;
		this->n++;
		delete[] array;
		array = temp;
		return *this;
	}

	friend ostream &operator<<(ostream &os, const Oglasnik &o) {
		os << o.name << endl;
		for (int i = 0; i < o.n; i++) {
			os << o.array[i] << endl;
		}
		return os;
	}

	void oglasiOdKategorija(const char *k) {
		for (int i = 0; i < strlen(k); i++) {
			if (strcmp(array[i].getCategory(), k) == 0) {
				cout << array[i] << endl;
			}
		}
	}

	void najniskaCena() {
		int index = 0;
		float min = 100000000;
		for (int i = 0; i < this->n; i++) {
			if (array[i].getPrice() < min) {
				min = array[i].getPrice();
				index = i;
			}
		}
		cout << array[index];
	}
};


int main() {
	char naslov[50];
	char kategorija[30];
	char opis[100];
	float cena;
	char naziv[50];
	char k[30];
	int n;

	int tip;
	cin >> tip;

	if (tip == 1) {
		cout << "-----Test Oglas & operator <<-----" << endl;
		cin.get();
		cin.getline(naslov, 49);
		cin.getline(kategorija, 29);
		cin.getline(opis, 99);
		cin >> cena;
		Oglas o(naslov, kategorija, opis, cena);
		cout << o;
	} else if (tip == 2) {
		cout << "-----Test Oglas & operator > -----" << endl;
		cin.get();
		cin.getline(naslov, 49);
		cin.getline(kategorija, 29);
		cin.getline(opis, 99);
		cin >> cena;
		Oglas o1(naslov, kategorija, opis, cena);
		cin.get();
		cin.getline(naslov, 49);
		cin.getline(kategorija, 29);
		cin.getline(opis, 99);
		cin >> cena;
		Oglas o2(naslov, kategorija, opis, cena);
		if (o1 > o2) cout << "Prviot oglas e poskap." << endl;
		else cout << "Prviot oglas ne e poskap." << endl;
	} else if (tip == 3) {
		cout << "-----Test Oglasnik, operator +=, operator << -----" << endl;
		cin.get();
		cin.getline(naziv, 49);
		cin >> n;
		Oglasnik ogl(naziv);
		for (int i = 0; i < n; i++) {
			cin.get();
			cin.getline(naslov, 49);
			cin.getline(kategorija, 29);
			cin.getline(opis, 99);
			cin >> cena;
			Oglas o(naslov, kategorija, opis, cena);
			try {
				ogl += o;
			} catch (NegativnaVrednost &e) {
				e.print();
			}
		}
		cout << ogl;
	} else if (tip == 4) {
		cout << "-----Test oglasOdKategorija -----" << endl;
		cin.get();
		cin.getline(naziv, 49);
		cin >> n;
		Oglasnik ogl(naziv);
		for (int i = 0; i < n; i++) {
			cin.get();
			cin.getline(naslov, 49);
			cin.getline(kategorija, 29);
			cin.getline(opis, 99);
			cin >> cena;
			Oglas o(naslov, kategorija, opis, cena);
			try {
				ogl += o;
			} catch (NegativnaVrednost &e) {
				e.print();
			}
		}
		cin.get();
		cin.getline(k, 29);
		cout << "Oglasi od kategorijata: " << k << endl;
		ogl.oglasiOdKategorija(k);
	} else if (tip == 5) {
		cout << "-----Test Exception -----" << endl;
		cin.get();
		cin.getline(naziv, 49);
		cin >> n;
		Oglasnik ogl(naziv);
		for (int i = 0; i < n; i++) {
			cin.get();
			cin.getline(naslov, 49);
			cin.getline(kategorija, 29);
			cin.getline(opis, 99);
			cin >> cena;
			Oglas o(naslov, kategorija, opis, cena);
			try {
				ogl += o;
			} catch (NegativnaVrednost &e) {
				e.print();
			}
		}
		cout << ogl;
	} else if (tip == 6) {
		cout << "-----Test najniskaCena -----" << endl;
		cin.get();
		cin.getline(naziv, 49);
		cin >> n;
		Oglasnik ogl(naziv);
		for (int i = 0; i < n; i++) {
			cin.get();
			cin.getline(naslov, 49);
			cin.getline(kategorija, 29);
			cin.getline(opis, 99);
			cin >> cena;
			Oglas o(naslov, kategorija, opis, cena);
			try {
				ogl += o;
			} catch (NegativnaVrednost &e) {
				e.print();
			}
		}
		cout << "Oglas so najniska cena:" << endl;
		ogl.najniskaCena();
	} else if (tip == 7) {
		cout << "-----Test All -----" << endl;
		cin.get();
		cin.getline(naziv, 49);
		cin >> n;
		Oglasnik ogl(naziv);
		for (int i = 0; i < n; i++) {
			cin.get();
			cin.getline(naslov, 49);
			cin.getline(kategorija, 29);
			cin.getline(opis, 99);
			cin >> cena;
			Oglas o(naslov, kategorija, opis, cena);
			try {
				ogl += o;
			} catch (NegativnaVrednost &e) {
				e.print();
			}
		}
		cout << ogl;

		cin.get();
		cin.get();
		cin.getline(k, 29);
		cout << "Oglasi od kategorijata: " << k << endl;
		ogl.oglasiOdKategorija(k);

		cout << "Oglas so najniska cena:" << endl;
		ogl.najniskaCena();
	}

	return 0;
}
