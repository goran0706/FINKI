#include <iostream>
#include <cstring>
using namespace std;

class AvtomobilTransport;
class KombeTransport;

class Transport {
protected:
	string destination;
	int price;
	int distance;

public:
	Transport(const string destination = "", int price = 0, int distance = 0) {
		this->destination = destination;
		this->price = price;
		this->distance = distance;
	}

	Transport(const Transport &other) {
		this->destination = other.destination;
		this->price = other.price;
		this->distance = other.distance;
	}

	Transport &operator=(const Transport &other) {
		if (this != &other) {
			this->destination = other.destination;
			this->price = other.price;
			this->distance = other.distance;
		}
		return *this;
	}

	~Transport() {
	}

	virtual float cenaTransport() = 0;

	bool operator<(const Transport &other) const {
		return this->distance > other.distance;
	}

	friend void pecatiPoloshiPonudi(Transport **array, int n, AvtomobilTransport poloshiPonudi);
};

class AvtomobilTransport : public Transport {
	bool paid;

public:
	AvtomobilTransport(const string destination = "", int price = 0, int distance = 0, bool paid = false) : Transport(
		destination, price, distance) {
		this->paid = paid;
	}

	AvtomobilTransport(const AvtomobilTransport &other) : Transport(other) {
		this->paid = other.paid;
	}

	AvtomobilTransport &operator=(const AvtomobilTransport &other) {
		if (this != &other) {
			Transport::operator=(other);
			this->paid = other.paid;
		}
		return *this;
	}

	~AvtomobilTransport() {
	}

	float cenaTransport() override {
		if (paid) {
			return price * 1.2;
		} else {
			return price;
		}
	}

	friend void pecatiPoloshiPonudi(Transport **array, int n, AvtomobilTransport poloshiPonudi);

	int getDistance() {
		return distance;
	}

	string getDestination() {
		return destination;
	}
};

class KombeTransport : public Transport {
	int number;

public:
	KombeTransport(const string destination = "", int price = 0, int distance = 0, int number = 0) : Transport(
		destination, price, distance) {
		this->number = number;
	}

	KombeTransport(const KombeTransport &other) : Transport(other) {
		this->number = other.number;
	}

	KombeTransport &operator=(const KombeTransport &other) {
		if (this != &other) {
			Transport::operator=(other);
			this->number = other.number;
		}
		return *this;
	}

	~KombeTransport() {
	}

	float cenaTransport() override {
		int discount = number * 200;
		return price - discount;
	}

	friend void pecatiPoloshiPonudi(Transport **array, int n, AvtomobilTransport poloshiPonudi);

	int getDistance() {
		return distance;
	}

	string getDestination() {
		return destination;
	}
};

void pecatiPoloshiPonudi(Transport **array, int n, AvtomobilTransport poloshiPonudi) {
	Transport **niza;
	niza = new Transport *[n];
	int j = 0;
	for (int i = 0; i < n; i++) {
		if (array[i]->cenaTransport() > poloshiPonudi.cenaTransport()) {
			niza[j] = array[i];
			j++;
		}
	}
	for (int i = 0; i < j - 1; i++) {
		for (int k = i + 1; k < j; k++) {
			if (*niza[i] < *niza[k]) {
				swap(niza[i], niza[k]);
			}
		}
	}
	for (int i = 0; i < j; i++) {
		cout << niza[i]->destination << " " << niza[i]->distance << " " << niza[i]->cenaTransport() << endl;
	}
}

int main() {
	char destinacija[20];
	int tip, cena, rastojanie, lugje;
	bool shofer;
	int n;
	cin >> n;
	Transport **ponudi;
	ponudi = new Transport *[n];

	for (int i = 0; i < n; i++) {
		cin >> tip >> destinacija >> cena >> rastojanie;
		if (tip == 1) {
			cin >> shofer;
			ponudi[i] = new AvtomobilTransport(destinacija, cena, rastojanie, shofer);
		} else {
			cin >> lugje;
			ponudi[i] = new KombeTransport(destinacija, cena, rastojanie, lugje);
		}
	}

	AvtomobilTransport nov("Ohrid", 2000, 600, false);
	pecatiPoloshiPonudi(ponudi, n, nov);

	for (int i = 0; i < n; i++) delete ponudi[i];
	delete [] ponudi;
	return 0;
}
