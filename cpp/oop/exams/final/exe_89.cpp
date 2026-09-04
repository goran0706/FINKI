#include <iostream>
#include <string.h>
using namespace std;

class Parcel {
protected:
    int id;
    static int procesingPrice;

public:
    Parcel(int id = 0) {
        this->id = id;
    }

    Parcel(const Parcel &parcel) {
        this->id = parcel.id;
    }

    ~Parcel() {
    }

    static void setProcessingPrice(int procesingPrice) {
        Parcel::procesingPrice = procesingPrice;
    }

    int getId() const {
        return id;
    }
};

int Parcel::procesingPrice = 150;

class Envelope : public Parcel {
private:
    int width;
    int height;
    char reciver[50];

public:
    Envelope(int id = 0, const char *reciver = "", int width = 0, int height = 0) : Parcel(id) {
        strcpy(this->reciver, reciver);
        this->width = width;
        this->height = height;
    }

    Envelope(const Envelope &parcel) {
        this->id = parcel.id;
        width = parcel.width;
        height = parcel.height;
        strcpy(reciver, parcel.reciver);
    }

    int price() {
        return procesingPrice + (height * width * 0.3);
    }

    char *getReceiver() {
        return reciver;
    }
};

class PostOffice {
private:
    Envelope array[100];
    int n;

public:
    PostOffice(int n = 0) {
        this->n = 0;
    }

    int sendEnvelope(int id, char *receiver, int length, int width) {
        array[n] = Envelope(id, receiver, length, width);
        array[n].price();
        n++;
        return array[n - 1].price();
    }

    void printEnvelopsTo(char *receiver) {
        cout << "For " << receiver << " are envelops with ids: ";
        for (int i = 0; i < n; i++) {
            if (strcmp(array[i].getReceiver(), receiver) == 0) {
                cout << array[i].getId() << " ";
            }
        }
        cout << endl;
    }
};

int main() {
    int type;
    int n;
    int price;
    int id;
    int height, width;
    char receiver[50];

    PostOffice p;

    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> type;
        if (type == 1) {
            // send envelope
            cin >> id >> receiver >> width >> height;
            cout << "The price of sending envelope with id " << id << " is:" << p.sendEnvelope(
                id, receiver, width, height) << endl;
        } else if (type == 2) {
            // print envelops to
            cin >> receiver;
            p.printEnvelopsTo(receiver);
        } else if (type == 3) {
            // set processing price
            cin >> price;
            Parcel::setProcessingPrice(price);
        } else if (type == 4) {
            // Parcel
            cin >> id;
            Parcel p1(id);
            cout << "Parcel with id [" << p1.getId() << "] is created" << endl;
        } else {
            // Envelope
            cin >> id >> receiver >> width >> height;
            Envelope p2(id, receiver, width, height);
            cout << "Price of sending envelope with ID: " << p2.getId() << " To: " << p2.getReceiver() << " is: " << p2.
                    price() << endl;
        }
    }
    return 0;
}
