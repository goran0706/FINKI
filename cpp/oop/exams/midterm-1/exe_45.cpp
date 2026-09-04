#include<iostream>
#include<cstring>
using namespace std;

// vasiot kod za klasite ovde
class StockRecord {
private:
    char id[13];
    char company[51];

    float price;
    float newPrice;
    int brAkcii;

public:
    StockRecord(char *id = "", char *company = "", float price = 0, int brAkcii = 0, float newPrice = 0) {
        strcpy(this->id, id);
        strcpy(this->company, company);
        this->price = price;
        this->brAkcii = brAkcii;
        this->newPrice = newPrice;
    }

    StockRecord(const StockRecord &sr) {
        strcpy(this->id, sr.id);
        strcpy(this->company, sr.company);
        this->price = sr.price;
        this->brAkcii = sr.brAkcii;
        this->newPrice = sr.newPrice;
    }

    void setNewPrice(float c) {
        newPrice = c;
    }

    double value() {
        return brAkcii * newPrice;
    }

    double profit() const {
        return brAkcii * (newPrice - price);
    }

    friend ostream &operator<<(ostream &os, const StockRecord &record) {
        os << record.company << " " << record.brAkcii << " " << record.price << " " << record.newPrice << " " << record.
                profit() << endl;
        return os;
    }
};

class Client {
private:
    char clientName[61];
    int clientID;
    StockRecord *kompanii;
    int brKompanii;

public:
    Client(char *clientName = "", int clientID = 0) {
        strcpy(this->clientName, clientName);
        this->clientID = clientID;
        this->brKompanii = 0;
        this->kompanii = nullptr;
    }

    Client(const Client &c) {
        strcpy(this->clientName, c.clientName);
        this->clientID = c.clientID;
        this->brKompanii = c.brKompanii;
        this->kompanii = new StockRecord[brKompanii];
        for (int i = 0; i < c.brKompanii; ++i) {
            this->kompanii[i] = c.kompanii[i];
        }
    }


    Client &operator =(const Client &c) {
        if (this != &c) {
            delete[]kompanii;
            strcpy(this->clientName, c.clientName);
            this->clientID = c.clientID;
            this->brKompanii = c.brKompanii;
            this->kompanii = new StockRecord[brKompanii];
            for (int i = 0; i < c.brKompanii; ++i) {
                this->kompanii[i] = c.kompanii[i];
            }
        }
        return *this;
    }

    ~Client() {
        delete[]kompanii;
    }

    double totalValue() {
        int suma = 0;
        for (int i = 0; i < brKompanii; ++i) {
            suma += kompanii[i].value();
        }
        return suma;
    }

    Client &operator+=(const StockRecord &c) {
        StockRecord *tmp = new StockRecord[brKompanii + 1];
        for (int i = 0; i < brKompanii; ++i) {
            tmp[i] = kompanii[i];
        }
        tmp[brKompanii] = c;
        delete[]kompanii;
        kompanii = tmp;
        brKompanii++;
        return *this;
    }

    friend ostream &operator<<(ostream &os, Client &client) {
        os << client.clientID << " " << client.totalValue() << endl;
        for (int i = 0; i < client.brKompanii; ++i) {
            os << client.kompanii[i];
        }
        return os;
    }
};


// ne menuvaj vo main-ot

int main() {
    int test;
    cin >> test;

    if (test == 1) {
        double price;
        cout << "=====TEST NA KLASATA StockRecord=====" << endl;
        StockRecord sr("1", "Microsoft", 60.0, 100);
        cout << "Konstruktor OK" << endl;
        cin >> price;
        sr.setNewPrice(price);
        cout << "SET metoda OK" << endl;
    } else if (test == 2) {
        cout << "=====TEST NA METODITE I OPERATOR << OD KLASATA StockRecord=====" << endl;
        char id[12], company[50];
        double price, newPrice;
        int n, shares;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            cin >> id;
            cin >> company;
            cin >> price;
            cin >> newPrice;
            cin >> shares;
            StockRecord sr(id, company, price, shares);
            sr.setNewPrice(newPrice);
            cout << sr.value() << endl;
            cout << sr;
        }
    } else if (test == 3) {
        cout << "=====TEST NA KLASATA Client=====" << endl;
        char companyID[12], companyName[50], clientName[50];
        int clientID, n, shares;
        double oldPrice, newPrice;
        bool flag = true;
        cin >> clientName;
        cin >> clientID;
        cin >> n;
        Client c(clientName, clientID);
        cout << "Konstruktor OK" << endl;
        for (int i = 0; i < n; ++i) {
            cin >> companyID;
            cin >> companyName;
            cin >> oldPrice;
            cin >> newPrice;
            cin >> shares;
            StockRecord sr(companyID, companyName, oldPrice, shares);
            sr.setNewPrice(newPrice);
            c += sr;
            if (flag) {
                cout << "Operator += OK" << endl;
                flag = false;
            }
        }
        cout << c;
        cout << "Operator << OK" << endl;
    }
    return 0;
}
