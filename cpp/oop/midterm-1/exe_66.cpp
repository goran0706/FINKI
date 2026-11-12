#include<iostream>
#include<cstring>
using namespace std;

// vasiot kod za klasite ovde

class StockRecord {
private:
    char ID[12];
    char nameComp[50];
    double boughtPrice;
    double currentPrice;
    int numberBought;

public:
    //, const int currentPrice = 0
    StockRecord(const char *ID = "", const char *nameComp = "", const double boughtPrice = 0,
                const int numberBought = 0) {
        strcpy(this->ID, ID);
        strcpy(this->nameComp, nameComp);
        this->boughtPrice = boughtPrice;
        this->currentPrice = 0;
        this->numberBought = numberBought;
    }

    StockRecord(const StockRecord &other) {
        strcpy(ID, other.ID);
        strcpy(nameComp, other.nameComp);
        boughtPrice = other.boughtPrice;
        currentPrice = other.currentPrice;
        numberBought = other.numberBought;
    }

    ~StockRecord() {
    }

    void setNewPrice(double const c) {
        this->currentPrice = c;
    }

    double value() {
        return numberBought * currentPrice;
    }

    double profit() {
        return numberBought * (currentPrice - boughtPrice);
    }

    char *getID() {
        return ID;
    }

    int getNumberBought() {
        return numberBought;
    }

    int getBoughtPrice() {
        return boughtPrice;
    }

    int getCurrentPrice() {
        return currentPrice;
    }

    char *getCompName() {
        return nameComp;
    }

    friend ostream &operator<<(ostream &os, StockRecord &r);
};

ostream &operator<<(ostream &os, StockRecord &r) {
    os << r.getCompName() << " " << r.getNumberBought() << " " << r.getBoughtPrice() << " " << r.getCurrentPrice() <<
            " " << r.profit() << endl;

    return os;
}

class Client {
private:
    char nameSurname[60];
    int IDcard;
    StockRecord *stock;
    int number;

public:
    Client(const char *nameSurname = "", const int IDcard = 0, const int number = 0) {
        strcpy(this->nameSurname, nameSurname);
        this->IDcard = IDcard;
        this->number = number;
        stock = new StockRecord[number];
    }

    Client(const Client &other) {
        strcpy(nameSurname, other.nameSurname);
        IDcard = other.IDcard;
        number = other.number;
        stock = new StockRecord[number];
        for (int i = 0; i < number; i++) {
            stock[i] = other.stock[i];
        }
    }

    Client &operator=(const Client &other) {
        if (this != &other) {
            delete [] stock;
            strcpy(nameSurname, other.nameSurname);
            IDcard = other.IDcard;
            number = other.number;
            stock = new StockRecord[number];
            for (int i = 0; i < number; i++) {
                stock[i] = other.stock[i];
            }
        }
        return *this;
    }

    ~Client() {
        delete [] stock;
    }

    double totalValue() {
        double total = 0;
        for (int i = 0; i < number; i++) {
            total += stock[i].value();
        }
        return total;
    }

    Client &operator+=(const StockRecord &newStock) {
        StockRecord *temp = new StockRecord[number + 1];
        for (int i = 0; i < number; i++) {
            temp[i] = stock[i];
        }
        temp[number] = newStock;
        delete [] this->stock;
        stock = temp;
        number++;
        return *this;
    }

    int getIdcard() {
        return IDcard;
    }

    int getNumber() {
        return number;
    }

    StockRecord *getStock() {
        return stock;
    }
};

ostream &operator<<(ostream &os, Client &r) {
    os << r.getIdcard() << " " << r.totalValue() << endl;
    for (int i = 0; r.getNumber() > i; i++) {
        cout << r.getStock()[i];
    }
    return os;
}

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
