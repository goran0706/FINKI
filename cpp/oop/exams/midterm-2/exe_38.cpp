#include <iostream>
#include <cstring>
using namespace std;

class Exception : exception {
public:
	void print() {
		cout << "Ne moze da se vnese dadeniot trud" << endl;
	}
};

class Trud {
private:
	char type;
	int year;

public:
	Trud(const char type = ' ', const int year = 0) {
		this->type = type;
		this->year = year;
	}

	Trud(const Trud &trud) {
		this->type = trud.type;
		this->year = trud.year;
	}

	Trud &operator =(const Trud &trud) {
		if (this != &trud) {
			this->type = trud.type;
			this->year = trud.year;
		}
		return *this;
	}

	~Trud() {
	}

	char getType() const {
		return type;
	}

	int getYear() const {
		return year;
	}

	friend istream &operator>>(istream &is, Trud &trud) {
		cin >> trud.type;
		cin >> trud.year;
		return is;
	}
};

class Student {
private:
	char name[30];
	int index;
	int yearOfEnrolment;
	int *array;
	int n;

public:
	Student(const char *name = "", int index = 0, int yearOfEnrolment = 0, const int *array = {}, int n = 0) {
		strcpy(this->name, name);
		this->index = index;
		this->yearOfEnrolment = yearOfEnrolment;
		this->n = n;
		this->array = new int [n];
		for (int i = 0; i < n; i++) {
			if (array) {
				this->array[i] = array[i];
			} else {
				this->array[i] = 0;
			}
		}
	}

	Student(const Student &stud) {
		strcpy(this->name, stud.name);
		this->index = stud.index;
		this->yearOfEnrolment = stud.yearOfEnrolment;
		this->n = stud.n;
		this->array = new int [n];
		for (int i = 0; i < n; i++) {
			this->array[i] = stud.array[i];
		}
	}

	Student &operator =(const Student &stud) {
		if (this != &stud) {
			delete [] this->array;
			strcpy(this->name, stud.name);
			this->index = stud.index;
			this->yearOfEnrolment = stud.yearOfEnrolment;
			this->n = stud.n;
			this->array = new int [n];
			for (int i = 0; i < n; i++) {
				this->array[i] = stud.array[i];
			}
		}
		return *this;
	}

	~Student() {
		delete [] this->array;
	}

	virtual float rang() const {
		float average = 0;
		for (int i = 0; i < n; i++) {
			average += array[i];
		}
		return average / (n);
	}

	// friend ostream &operator<<(ostream &os, const Student &stud) {
	// 	os << stud.index << " " << stud.name << " " << stud.yearOfEnrolment << " " << stud.rang() << endl;
	// 	return os;
	// }
	friend ostream &operator<<(ostream &os, const Student &stud) {
		stud.print(os);
		return os;
	}

	int getYearOfEnrolment() const {
		return this->yearOfEnrolment;
	}

	const char *getName() const {
		return name;
	}

	int getIndex() const {
		return index;
	}

	virtual void print(ostream &os) const {
		os << index << " " << name << " " << yearOfEnrolment << " " << rang() << endl;
	}
};

class PhDStudent : public Student {
private:
	Trud *arrayT;
	int number;
	static int CTrud;
	static int STrud;

public:
	//trud br_trudivi
	PhDStudent(const char *name = "", int index = 0, int yearOfEnrolment = 0, const int *array = {}, int n = 0,
	           Trud *arrayT = nullptr, int number = 0) : Student(name, index, yearOfEnrolment, array, n) {
		this->number = number;
		this->arrayT = new Trud [number + 1];
		for (int i = 0; i < number; i++) {
			if (arrayT && arrayT[i].getYear() < getYearOfEnrolment()) {
				//cout<<"Ne moze da se vnese dadeniot trud"<<endl;
				try {
					*this += arrayT[i];
				} catch (Exception &e) {
					e.print();
				}
			} else {
				if (arrayT) {
					this->arrayT[i] = arrayT[i];
				} else {
					this->arrayT[i] = 0;
				}
			}
		}
	}

	PhDStudent(const PhDStudent &stud) : Student(stud) {
		this->number = stud.number;
		this->arrayT = new Trud [number];
		for (int i = 0; i < number; i++) {
			this->arrayT[i] = stud.arrayT[i];
		}
	}

	PhDStudent &operator =(const PhDStudent &stud) {
		if (this != &stud) {
			Student::operator=(stud);
			delete [] this->arrayT;
			this->number = stud.number;
			this->arrayT = new Trud [number];
			for (int i = 0; i < number; i++) {
				this->arrayT[i] = stud.arrayT[i];
			}
		}
		return *this;
	}

	~PhDStudent() {
		delete [] this->arrayT;
	}

	float rang() const override {
		float average = Student::rang();
		float smth = 0;
		for (int i = 0; i < number; i++) {
			if (arrayT[i].getType() == 'c' || arrayT[i].getType() == 'C') {
				smth += CTrud;
			} else if (arrayT[i].getType() == 'j' || arrayT[i].getType() == 'J') {
				smth += STrud;
			}
		}
		return average + smth;
	}

	static void setCTrud(int n) {
		CTrud = n;
	}

	static void setSTrud(int n) {
		STrud = n;
	}

	PhDStudent &operator +=(const Trud &trud) {
		if (trud.getYear() < getYearOfEnrolment()) {
			throw Exception();
		} else {
			Trud *temp = new Trud [number + 1];
			for (int i = 0; i < number; i++) {
				temp[i] = arrayT[i];
			}
			temp[number] = trud;
			delete [] arrayT;
			arrayT = temp;
			number++;
			return *this;
		}
	}

	// friend ostream &operator<<(ostream &os, const PhDStudent &stud) {
	// 	os<<stud.getIndex()<<" "<<stud.getName()<<" "<<stud.getYearOfEnrolment()<<" "<<stud.rang()<<endl;
	// 	return os;
	// }
	void print(ostream &os) const override {
		os << getIndex() << " " << getName() << " " << getYearOfEnrolment() << " " << rang() << endl;
	}
};

int PhDStudent::CTrud = 1;
int PhDStudent::STrud = 3;

int main() {
	int testCase;
	cin >> testCase;

	int god, indeks, n, god_tr, m, n_tr;
	int izbor; //0 za Student, 1 za PhDStudent
	char ime[30];
	int oceni[50];
	char tip;
	Trud trud[50];

	if (testCase == 1) {
		cout << "===== Testiranje na klasite ======" << endl;
		cin >> ime;
		cin >> indeks;
		cin >> god;
		cin >> n;
		for (int j = 0; j < n; j++)
			cin >> oceni[j];
		Student s(ime, indeks, god, oceni, n);
		cout << s;
		cin >> ime;
		cin >> indeks;
		cin >> god;
		cin >> n;
		for (int j = 0; j < n; j++)
			cin >> oceni[j];
		cin >> n_tr;
		for (int j = 0; j < n_tr; j++) {
			cin >> tip;
			cin >> god_tr;
			Trud t(tip, god_tr);
			trud[j] = t;
		}

		PhDStudent phd(ime, indeks, god, oceni, n, trud, n_tr);
		cout << phd;
	}
	if (testCase == 2) {
		cout << "===== Testiranje na operatorot += ======" << endl;
		Student **niza;
		cin >> m;
		niza = new Student *[m];
		for (int i = 0; i < m; i++) {
			cin >> izbor;
			cin >> ime;
			cin >> indeks;
			cin >> god;
			cin >> n;
			for (int j = 0; j < n; j++)
				cin >> oceni[j];

			if (izbor == 0) {
				niza[i] = new Student(ime, indeks, god, oceni, n);
			} else {
				cin >> n_tr;
				for (int j = 0; j < n_tr; j++) {
					cin >> tip;
					cin >> god_tr;
					Trud t(tip, god_tr);
					trud[j] = t;
				}
				niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];

		// dodavanje nov trud za PhD student spored indeks
		Trud t;
		cin >> indeks;
		cin >> t;

		// vmetnete go kodot za dodavanje nov trud so pomos na operatorot +=

		for (int i = 0; i < m; i++) {
			if (niza[i]->getIndex() == indeks) {
				PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
				if (temp) {
					try {
						*temp += t;
					} catch (Exception &e) {
						e.print();
					}
				} else {
					cout << "Ne postoi PhD student so indeks " << indeks << endl;
				}
			}
		}

		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];
	}
	if (testCase == 3) {
		cout << "===== Testiranje na operatorot += ======" << endl;
		Student **niza;
		cin >> m;
		niza = new Student *[m];
		for (int i = 0; i < m; i++) {
			cin >> izbor;
			cin >> ime;
			cin >> indeks;
			cin >> god;
			cin >> n;
			for (int j = 0; j < n; j++)
				cin >> oceni[j];

			if (izbor == 0) {
				niza[i] = new Student(ime, indeks, god, oceni, n);
			} else {
				cin >> n_tr;
				for (int j = 0; j < n_tr; j++) {
					cin >> tip;
					cin >> god_tr;
					Trud t(tip, god_tr);
					trud[j] = t;
				}
				niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];

		// dodavanje nov trud za PhD student spored indeks
		Trud t;
		cin >> indeks;
		cin >> t;

		// vmetnete go kodot za dodavanje nov trud so pomos na operatorot += od Testcase 2

		for (int i = 0; i < m; i++) {
			if (niza[i]->getIndex() == indeks) {
				PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
				if (temp) {
					try {
						*temp += t;
					} catch (Exception &e) {
						e.print();
					}
				} else {
					cout << "Ne postoi PhD student so indeks " << indeks << endl;
				}
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];
	}
	if (testCase == 4) {
		cout << "===== Testiranje na isklucoci ======" << endl;
		cin >> ime;
		cin >> indeks;
		cin >> god;
		cin >> n;
		for (int j = 0; j < n; j++)
			cin >> oceni[j];
		cin >> n_tr;
		for (int j = 0; j < n_tr; j++) {
			cin >> tip;
			cin >> god_tr;
			Trud t(tip, god_tr);
			trud[j] = t;
		}
		PhDStudent phd(ime, indeks, god, oceni, n, trud, n_tr);
		cout << phd;
	}
	if (testCase == 5) {
		cout << "===== Testiranje na isklucoci ======" << endl;
		Student **niza;
		cin >> m;
		niza = new Student *[m];
		for (int i = 0; i < m; i++) {
			cin >> izbor;
			cin >> ime;
			cin >> indeks;
			cin >> god;
			cin >> n;
			for (int j = 0; j < n; j++)
				cin >> oceni[j];

			if (izbor == 0) {
				niza[i] = new Student(ime, indeks, god, oceni, n);
			} else {
				cin >> n_tr;
				for (int j = 0; j < n_tr; j++) {
					cin >> tip;
					cin >> god_tr;
					Trud t(tip, god_tr);
					trud[j] = t;
				}
				niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];

		// dodavanje nov trud za PhD student spored indeks
		Trud t;
		cin >> indeks;
		cin >> t;

		// vmetnete go kodot za dodavanje nov trud so pomos na operatorot += i spravete se so isklucokot
		for (int i = 0; i < m; i++) {
			if (niza[i]->getIndex() == indeks) {
				PhDStudent *temp = dynamic_cast<PhDStudent *>(niza[i]);
				if (temp) {
					try {
						*temp += t;
					} catch (Exception &e) {
						e.print();
					}
				} else {
					cout << "Ne postoi PhD student so indeks " << indeks << endl;
				}
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];
	}
	if (testCase == 6) {
		cout << "===== Testiranje na static clenovi ======" << endl;
		Student **niza;
		cin >> m;
		niza = new Student *[m];
		for (int i = 0; i < m; i++) {
			cin >> izbor;
			cin >> ime;
			cin >> indeks;
			cin >> god;
			cin >> n;
			for (int j = 0; j < n; j++)
				cin >> oceni[j];

			if (izbor == 0) {
				niza[i] = new Student(ime, indeks, god, oceni, n);
			} else {
				cin >> n_tr;
				for (int j = 0; j < n_tr; j++) {
					cin >> tip;
					cin >> god_tr;
					Trud t(tip, god_tr);
					trud[j] = t;
				}
				niza[i] = new PhDStudent(ime, indeks, god, oceni, n, trud, n_tr);
			}
		}
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];

		int conf, journal;
		cin >> conf;
		cin >> journal;

		//postavete gi soodvetnite vrednosti za statickite promenlivi
		PhDStudent::setCTrud(conf);
		PhDStudent::setSTrud(journal);
		// pecatenje na site studenti
		cout << "\nLista na site studenti:\n";
		for (int i = 0; i < m; i++)
			cout << *niza[i];
	}
	return 0;
}
