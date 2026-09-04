#include <iostream>
#include <cstring>
using namespace std;

class Tickets {
protected:
    int ID[12];
    char event[100];
    float basePrice;
    static int discount;

public:
    Tickets(const int *ID = nullptr, const char *event = " ", float basePrice = 0) {
        if (ID) {
            for (int i = 0; i < 12; i++) {
                this->ID[i] = ID[i];
            }
        } else {
            // Initialize to zeros
            for (int i = 0; i < 12; i++) {
                this->ID[i] = 0;
            }
        }
        strcpy(this->event, event);
        this->basePrice = basePrice;
    }

    Tickets(const Tickets &t) {
        for (int i = 0; i < 12; i++) {
            this->ID[i] = t.ID[i];
        }
        strcpy(this->event, t.event);
        this->basePrice = t.basePrice;
    }

    Tickets &operator=(const Tickets &t) {
        if (this != &t) {
            for (int i = 0; i < 12; i++) {
                this->ID[i] = t.ID[i];
            }
            strcpy(this->event, t.event);
            this->basePrice = t.basePrice;
        }
        return *this;
    }

    ~Tickets() {
    }

    virtual float presmetajCena() {
        return basePrice;
    }

    friend ostream &operator<<(ostream &os, Tickets &t) {
        for (int i = 0; i < 12; i++) {
            os << t.ID[i];
        }
        os << "-" << t.event << "-" << t.presmetajCena();
        return os;
    }

    bool falsifikat(int from, int to) {
        int broj1 = 0;
        broj1 = (broj1 + ID[8]);
        broj1 = (broj1 * 10 + ID[9]);
        broj1 = (broj1 * 10 + ID[10]);
        broj1 = (broj1 * 10 + ID[11]);
        if (broj1 >= from && broj1 <= to) {
            return true;
        } else {
            return false;
        }
    }

    static void changeDiscount(int d) {
        discount = d;
    }

    float soPopust() {
        if (discount != 0) {
            float pp = basePrice - ((basePrice / 100) * discount);
            return pp;
        } else {
            return 0;
        }
    }
};

int Tickets::discount = 0;

class Online : public Tickets {
private:
    bool premium;

public:
    Online(const int *ID = nullptr, const char *event = "", float basePrice = 0, bool premium = false) : Tickets(
        ID, event, basePrice) {
        this->premium = premium;
    }

    Online(const Online &t) {
        this->premium = t.premium;
        for (int i = 0; i < 12; i++) {
            this->ID[i] = t.ID[i];
        }
        strcpy(this->event, t.event);
        this->basePrice = t.basePrice;
    }

    Online &operator=(const Online &t) {
        if (this != &t) {
            premium = t.premium;
            for (int i = 0; i < 12; i++) {
                this->ID[i] = t.ID[i];
            }
            strcpy(this->event, t.event);
            this->basePrice = t.basePrice;
        }
        return *this;
    }

    ~Online() {
    }

    // float presmetajCena () override {
    //     float popust1=0;
    //     if (this->premium) {
    //         popust1 = basePrice- ((basePrice/100)*15);
    //     }
    //     float popust2 =soPopust();
    //     basePrice= basePrice- (popust1+popust2);
    //     return basePrice;
    // }
    float presmetajCena() override {
        float finalPrice = basePrice;

        if (this->premium) {
            finalPrice -= (basePrice * 15 / 100); // 15% discount for premium
        }
        finalPrice -= (basePrice * discount / 100); // Apply static discount
        return finalPrice;
    }
};

class Offline : public Tickets {
private:
    bool reservation;

public:
    Offline(const int *ID = nullptr, const char *event = "", float basePrice = 0, bool reservation = false) : Tickets(
        ID, event, basePrice) {
        this->reservation = reservation;
    }

    Offline(const Offline &t) {
        this->reservation = t.reservation;
        for (int i = 0; i < 12; i++) {
            this->ID[i] = t.ID[i];
        }
        strcpy(this->event, t.event);
        this->basePrice = t.basePrice;
    }

    Offline &operator=(const Offline &t) {
        if (this != &t) {
            reservation = t.reservation;
            for (int i = 0; i < 12; i++) {
                this->ID[i] = t.ID[i];
            }
            strcpy(this->event, t.event);
            this->basePrice = t.basePrice;
        }
        return *this;
    }

    ~Offline() {
    }

    // float presmetajCena () override {
    //     float popust1=0;
    //     if (this->reservation) {
    //         popust1 = basePrice- ((basePrice/100)*15);
    //     }
    //     float popust2 = soPopust();
    //     basePrice= basePrice- (popust1+popust2);
    //     return basePrice;
    // }
    float presmetajCena() override {
        float finalPrice = basePrice;

        if (this->reservation) {
            finalPrice += (basePrice * 10 / 100); // 15% discount for reservation
        }
        finalPrice -= (basePrice * discount / 100); // Apply static discount
        return finalPrice;
    }
};

void vkupenPrihod(Tickets **t, int n, int from, int to) {
    float total = 0;
    for (int i = 0; i < n; i++) {
        if (t[i]->falsifikat(from, to)) {
            total = total + (t[i]->presmetajCena());
        }
    }
    cout << total << endl;
}

int main() {
    // // Tickets tickets;
    // // int id[12];
    // // char event[100];
    // // float basePrice;
    // // cin>>basePrice;
    // // cin.ignore();
    // // cin>>event;
    // // cin.get();
    // // for (int i=0; i<12; i++) {
    // //     cin>>id[i];
    // // }
    // // tickets=Tickets(id,event,basePrice);
    // // cout<<tickets<<endl;
    // int id [12];
    // for (int i=0; i<12;i++) {
    //     cin>>id[i];
    // }
    // Tickets **t1 = new Tickets *[3]; ;
    // t1[0]=new Tickets (id,"WhiteSnake_ThePurpleTour",1200);
    // t1[1]=new Tickets (id,"WhiteSnake_ThePurpleTour",1200);
    // t1[2]=new Tickets (id,"WhiteSnake_ThePurpleTour",1200);
    // Online o1 = Online (id,"WhiteSnake_ThePurpleTour",1200,true);
    // Offline o2 = Offline (id,"WhiteSnake_ThePurpleTour",1200, false);
    // //cout<<t1;
    // cout<<o1;
    // cout<<o2;
    //
    // //cout<<t1[0].falsifikat(0,10);
    // vkupenPrihod(t1,3,0,10);
    // return 0;

    int testCase;
    cin >> testCase;
    int ID[12];
    char nastan[100];
    float price;
    bool premium;
    bool rezervacija;
    int od, doo;

    if (testCase == 1) {
        cout << "===== TESTING CONSTRUCTORS ======" << endl;
        for (int i = 0; i < 12; i++)
            cin >> ID[i];
        cin >> nastan;
        cin >> price;
        cin >> premium;
        Online o1(ID, nastan, price, premium);
        cout << o1 << endl;
        for (int i = 0; i < 12; i++)
            cin >> ID[i];
        cin >> nastan;
        cin >> price;
        cin >> rezervacija;
        Offline o2(ID, nastan, price, rezervacija);
        cout << o2 << endl;
    } else if (testCase == 2) {
        cout << "===== TESTING METHOD vkupenPrihod()  ======" << endl;
        int n;
        cin >> n;
        Tickets **t = new Tickets *[n];
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < 12; j++)
                cin >> ID[j];
            cin >> nastan;
            cin >> price;

            if (i % 2 == 0) {
                cin >> premium;
                t[i] = new Online(ID, nastan, price, premium);
            } else {
                cin >> rezervacija;
                t[i] = new Offline(ID, nastan, price, rezervacija);
            }
        }
        cin >> od;
        cin >> doo;
        vkupenPrihod(t, n, od, doo);
        for (int i = 0; i < n; ++i) {
            delete t[i];
        }
        delete[] t;
    } else if (testCase == 3) {
        cout << "===== TESTING DISCOUNT STATIC ======" << endl;
        int n;
        cin >> n;
        //cout<<n<<endl;
        Tickets **t = new Tickets *[n];
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < 12; ++j)
                cin >> ID[j];
            cin >> nastan;
            //cout<<nastan<<endl;
            cin >> price;
            //cout<<price<<endl;
            if (i % 2 == 0) {
                cin >> premium;
                t[i] = new Online(ID, nastan, price, premium);
            } else {
                cin >> rezervacija;
                //cout<<rezervacija<<endl;
                t[i] = new Offline(ID, nastan, price, rezervacija);
            }
        }
        int d;
        cin >> d;
        Tickets::changeDiscount(d);
        for (int i = 0; i < n; ++i)
            cout << *t[i] << endl;
    }

    return 0;
}
