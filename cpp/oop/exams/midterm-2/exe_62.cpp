#include <iostream>
#include <cstring>
using namespace std;

class SMS {
protected:
	float price;
	char number[14];

public:
	virtual float SMS_cena() = 0;

	friend ostream &operator<<(ostream &os, SMS &sms) {
		os << "Tel: " << sms.number << " - cena: " << sms.SMS_cena() << "den." << endl;
		return os;
	}
};

class RegularSMS : public SMS {
private:
	char message[1000];
	bool roaming;
	static float percent;

public:
	RegularSMS(const char *number = "", float price = 0, const char *message = "", bool roaming = false) {
		this->price = price;
		strcpy(this->number, number);
		strcpy(this->message, message);
		this->roaming = roaming;
	}

	RegularSMS(const RegularSMS &other) {
		this->price = other.price;
		strcpy(this->number, other.number);
		strcpy(this->message, other.message);
		this->roaming = other.roaming;
	}

	RegularSMS &operator=(const RegularSMS &other) {
		if (this != &other) {
			this->price = other.price;
			strcpy(this->number, other.number);
			strcpy(this->message, other.message);
			this->roaming = other.roaming;
		}
		return *this;
	}

	~RegularSMS() {
	}

	float SMS_cena() override {
		float basic_price = price;
		int size = strlen(message);
		int num = (size / 160) + 1;
		float final_price = basic_price * num;
		if (roaming) {
			final_price += final_price * (percent / 100);
		} else {
			final_price += final_price * 0.18;
		}
		return final_price;
	}

	static void set_rProcent(float n) {
		percent = n;
	}
};

float RegularSMS::percent = 300;

class SpecialSMS : public SMS {
private:
	bool donation;
	static float percent;

public:
	SpecialSMS(const char *number = "", float price = 0, bool donation = false) {
		this->price = price;
		strcpy(this->number, number);
		this->donation = donation;
	}

	SpecialSMS(const SpecialSMS &other) {
		this->price = other.price;
		strcpy(this->number, other.number);
		this->donation = other.donation;
	}

	SpecialSMS &operator=(const SpecialSMS &other) {
		if (this != &other) {
			this->price = other.price;
			strcpy(this->number, other.number);
			this->donation = other.donation;
		}
		return *this;
	}

	~SpecialSMS() {
	}

	float SMS_cena() override {
		float basic_price = price;
		if (!donation) {
			basic_price += basic_price * (percent / 100);
			//basic_price += basic_price * 0.18;
		}
		return basic_price;
	}

	static void set_sProcent(float n) {
		percent = n;
	}
};

float SpecialSMS::percent = 150;

void vkupno_SMS(SMS **poraka, int n) {
	int numSpecial = 0, numRegular = 0;
	float priceSpecial = 0, priceRegular = 0;
	for (int i = 0; i < n; i++) {
		RegularSMS *r = dynamic_cast<RegularSMS *>(poraka[i]);
		SpecialSMS *s = dynamic_cast<SpecialSMS *>(poraka[i]);
		if (r) {
			numRegular++;
			priceRegular += r->SMS_cena();
		}
		if (s) {
			numSpecial++;
			priceSpecial += s->SMS_cena();
		}
	}
	cout << "Vkupno ima " << numRegular << " regularni SMS poraki i nivnata cena e: " << priceRegular << endl;
	cout << "Vkupno ima " << numSpecial << " specijalni SMS poraki i nivnata cena e: " << priceSpecial << endl;
}

int main() {
	char tel[20], msg[1000];
	float cena;
	float price;
	int p;
	bool roam, hum;
	SMS **sms;
	int n;
	int tip;

	int testCase;
	cin >> testCase;
	if (testCase == 1) {
		cout << "====== Testing RegularSMS class ======" << endl;
		cin >> n;
		sms = new SMS *[n];

		for (int i = 0; i < n; i++) {
			cin >> tel;
			cin >> cena;
			cin.get();
			cin.getline(msg, 1000);
			cin >> roam;
			cout << "CONSTRUCTOR" << endl;
			sms[i] = new RegularSMS(tel, cena, msg, roam);
			cout << "OPERATOR <<" << endl;
			cout << *sms[i];
		}
		for (int i = 0; i < n; i++) delete sms[i];
		delete[] sms;
	}
	if (testCase == 2) {
		cout << "====== Testing SpecialSMS class ======" << endl;
		cin >> n;
		sms = new SMS *[n];

		for (int i = 0; i < n; i++) {
			cin >> tel;
			cin >> cena;
			cin >> hum;
			cout << "CONSTRUCTOR" << endl;
			sms[i] = new SpecialSMS(tel, cena, hum);
			cout << "OPERATOR <<" << endl;
			cout << *sms[i];
		}
		for (int i = 0; i < n; i++) delete sms[i];
		delete[] sms;
	}
	if (testCase == 3) {
		cout << "====== Testing method vkupno_SMS() ======" << endl;
		cin >> n;
		sms = new SMS *[n];

		for (int i = 0; i < n; i++) {
			cin >> tip;
			cin >> tel;
			cin >> cena;
			if (tip == 1) {
				cin.get();
				cin.getline(msg, 1000);
				cin >> roam;

				sms[i] = new RegularSMS(tel, cena, msg, roam);
			} else {
				cin >> hum;

				sms[i] = new SpecialSMS(tel, cena, hum);
			}
		}

		vkupno_SMS(sms, n);
		for (int i = 0; i < n; i++) delete sms[i];
		delete[] sms;
	}
	if (testCase == 4) {
		cout << "====== Testing RegularSMS class with a changed percentage======" << endl;
		SMS *sms1, *sms2;
		cin >> tel;
		cin >> cena;
		cin.get();
		cin.getline(msg, 1000);
		cin >> roam;
		sms1 = new RegularSMS(tel, cena, msg, roam);
		cout << *sms1;

		cin >> tel;
		cin >> cena;
		cin.get();
		cin.getline(msg, 1000);
		cin >> roam;
		cin >> p;
		RegularSMS::set_rProcent(p);
		sms2 = new RegularSMS(tel, cena, msg, roam);
		cout << *sms2;

		delete sms1, sms2;
	}
	if (testCase == 5) {
		cout << "====== Testing SpecialSMS class with a changed percentage======" << endl;
		SMS *sms1, *sms2;
		cin >> tel;
		cin >> cena;
		cin >> hum;
		sms1 = new SpecialSMS(tel, cena, hum);
		cout << *sms1;

		cin >> tel;
		cin >> cena;
		cin >> hum;
		cin >> p;
		SpecialSMS::set_sProcent(p);
		sms2 = new SpecialSMS(tel, cena, hum);
		cout << *sms2;

		delete sms1, sms2;
	}

	return 0;
}
