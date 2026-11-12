#include <iostream>
#include <cstring>

using namespace std;

enum tip {
	smartphone, Laptop
};

class Device {
private:
	char model[100];
	tip type;
	static double Time;
	double time;
	int year;

public:
	Device(const char *model = "", tip type = smartphone, int year = 0) {
		strcpy(this->model, model);
		this->type = type;
		this->year = year;
		this->time = Time;
		if (this->year > 2015) {
			time = time + 2;
		}
		if (this->type == Laptop) {
			time = time + 2;
		}
	}

	Device(const Device &d) {
		strcpy(this->model, d.model);
		this->type = d.type;
		this->year = d.year;
		this->time = d.time;
	}

	Device &operator=(const Device &d) {
		if (this != &d) {
			strcpy(this->model, d.model);
			this->type = d.type;
			this->year = d.year;
			this->time = d.time;
		}
		return *this;
	}

	~Device() {
	}

	friend ostream &operator<<(ostream &os, Device &d) {
		os << d.model << endl;
		if (d.type == smartphone) {
			os << "Mobilen ";
		} else if (d.type == Laptop) {
			os << "Laptop ";
		}
		d.time = Time;
		if (d.year > 2015) {
			d.time = d.time + 2;
		}
		if (d.type == Laptop) {
			d.time = d.time + 2;
		}
		os << d.time << endl;
		return os;
	}

	int getYear() const {
		return year;
	}

	static void setPocetniCasovi(double n) {
		Time = n;
	}
};

double Device::Time = 1;

class InvalidProductionDate : exception {
private:
	char message[100];

public:
	InvalidProductionDate(const char *message = "") {
		strcpy(this->message, message);
	}

	void print() {
		cout << message << endl;
	}
};

class MobileServis {
private:
	char address[100];
	Device *array;
	int n;

public:
	MobileServis(const char *address = "") {
		strcpy(this->address, address);
		array = nullptr;
		n = 0;
	}

	MobileServis(const MobileServis &d) {
		strcpy(this->address, d.address);
		this->n = d.n;
		array = new Device[this->n];
		for (int i = 0; i < this->n; i++) {
			array[i] = d.array[i];
		}
	}

	MobileServis &operator=(const MobileServis &d) {
		if (this != &d) {
			delete [] array;
			strcpy(this->address, d.address);
			this->n = d.n;
			array = new Device[this->n];
			for (int i = 0; i < this->n; i++) {
				array[i] = d.array[i];
			}
		}
		return *this;
	}

	~MobileServis() {
		delete [] array;
	}

	MobileServis &operator+=(const Device &d) {
		if (d.getYear() > 2019 || d.getYear() < 2000) {
			throw InvalidProductionDate("Невалидна година на производство");
		}
		Device *temp = new Device [this->n + 1];
		for (int i = 0; i < this->n; i++) {
			temp[i] = array[i];
		}
		temp[n] = d;
		delete [] array;
		array = temp;
		n++;
		return *this;
	}

	void pecatiCasovi() {
		cout << "Ime: " << address << endl;
		for (int i = 0; i < this->n; i++) {
			cout << array[i];
		}
	}
};

int main() {
	int testCase;
	cin >> testCase;
	char ime[100];
	int tipDevice;
	int godina;
	int n;
	Device devices[50];
	if (testCase == 1) {
		cout << "===== Testiranje na klasite ======" << endl;
		cin >> ime;
		cin >> tipDevice;
		cin >> godina;
		Device ig(ime, (tip) tipDevice, godina);
		cin >> ime;
		MobileServis t(ime);
		cout << ig;
	}
	if (testCase == 2) {
		cout << "===== Testiranje na operatorot += ======" << endl;
		cin >> ime;
		cin >> n;
		MobileServis t(ime);
		for (int i = 0; i < n; i++) {
			cin >> ime;
			cin >> tipDevice;
			cin >> godina;
			Device tmp(ime, (tip) tipDevice, godina);
			try {
				t += tmp;
			} catch (InvalidProductionDate &e) {
				e.print();
			}
		}
		t.pecatiCasovi();
	}
	if (testCase == 3) {
		cout << "===== Testiranje na isklucoci ======" << endl;
		cin >> ime;
		cin >> n;
		MobileServis t(ime);
		for (int i = 0; i < n; i++) {
			cin >> ime;
			cin >> tipDevice;
			cin >> godina;
			Device tmp(ime, (tip) tipDevice, godina);
			try {
				t += tmp;
			} catch (InvalidProductionDate &e) {
				e.print();
			}
		}
		t.pecatiCasovi();
	}
	if (testCase == 4) {
		cout << "===== Testiranje na konstruktori ======" << endl;
		cin >> ime;
		cin >> n;
		MobileServis t(ime);
		for (int i = 0; i < n; i++) {
			cin >> ime;
			cin >> tipDevice;
			cin >> godina;
			Device tmp(ime, (tip) tipDevice, godina);
			try {
				t += tmp;
			} catch (InvalidProductionDate &e) {
				e.print();
			}
		}
		MobileServis t2 = t;
		t2.pecatiCasovi();
	}
	if (testCase == 5) {
		cout << "===== Testiranje na static clenovi ======" << endl;
		cin >> ime;
		cin >> n;
		MobileServis t(ime);
		for (int i = 0; i < n; i++) {
			cin >> ime;
			cin >> tipDevice;
			cin >> godina;
			Device tmp(ime, (tip) tipDevice, godina);

			try {
				t += tmp;
			} catch (InvalidProductionDate &e) {
				e.print();
			}
		}
		t.pecatiCasovi();
		cout << "===== Promena na static clenovi ======" << endl;
		Device::setPocetniCasovi(2);
		t.pecatiCasovi();
	}

	if (testCase == 6) {
		cout << "===== Testiranje na kompletna funkcionalnost ======" << endl;
		cin >> ime;
		cin >> n;
		MobileServis t(ime);
		for (int i = 0; i < n; i++) {
			cin >> ime;
			cin >> tipDevice;
			cin >> godina;
			Device tmp(ime, (tip) tipDevice, godina);
			try {
				t += tmp;
			} catch (InvalidProductionDate &e) {
				e.print();
			}
		}
		Device::setPocetniCasovi(3);
		MobileServis t2 = t;
		t2.pecatiCasovi();
	}

	return 0;
}
