#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class ExistingBill : exception {
private:
    char message[100];

public:
    ExistingBill(const char *message = "The bill already exists") {
        strcpy(this->message, message);
    }

    void print() {
        cout << message << endl;
    }
};

class Bill {
private:
    char *billNumber;
    int expenses;
    char date[10];
    bool status;

public:
    Bill(const char *billNumber = "", int expenses = 0, const char *date = "", bool status = true) {
        this->billNumber = new char [strlen(billNumber) + 1];
        strcpy(this->billNumber, billNumber);
        this->expenses = expenses;
        strcpy(this->date, date);
        this->status = status;
    }

    Bill(const Bill &bill) {
        this->billNumber = new char [strlen(bill.billNumber) + 1];
        strcpy(this->billNumber, bill.billNumber);
        this->expenses = bill.expenses;
        strcpy(this->date, bill.date);
        this->status = bill.status;
    }

    Bill &operator=(const Bill &bill) {
        if (this != &bill) {
            this->billNumber = new char [strlen(bill.billNumber) + 1];
            strcpy(this->billNumber, bill.billNumber);
            this->expenses = bill.expenses;
            strcpy(this->date, bill.date);
            this->status = bill.status;
        }
        return *this;
    }

    ~Bill() {
        delete [] this->billNumber;
    }

    bool operator ==(const Bill &b) const {
        return strcmp(billNumber, b.billNumber) == 0;
    }

    friend ostream &operator <<(ostream &os, const Bill &b) {
        cout << b.billNumber << "(" << b.date << ") - " << b.expenses << endl;
        return os;
    }

    bool getStatus() {
        return status;
    }

    char *getBillNumber() {
        return billNumber;
    }

    // int getDate() {
    //     int dated=0;
    //     for (int i=0;i<8;i++) {
    //         dated=dated+(int)date[i];
    //     }
    //     dated=dated-46;
    //     return dated;
    // }
    char *getDate() {
        return date;
    }

    int getExpenses() {
        return expenses;
    }
};

class UserProfile {
private:
    char username[30];
    Bill array[30];
    int n;

public:
    UserProfile(const char *username = "") {
        strcpy(this->username, username);
        this->n = 0;
    }

    UserProfile(const UserProfile &user) {
        strcpy(this->username, user.username);
        for (int i = 0; i < n; i++) {
            array[i] = user.array[i];
        }
        this->n = user.n;
    }

    UserProfile &operator=(const UserProfile &user) {
        if (this != &user) {
            strcpy(this->username, user.username);
            for (int i = 0; i < n; i++) {
                array[i] = user.array[i];
            }
            this->n = user.n;
        }
        return *this;
    }

    ~UserProfile() {
    }

    friend ostream &operator <<(ostream &os, UserProfile &user) {
        cout << "Unpaid bills of user " << user.username << " are:" << endl;
        for (int i = 0; i < user.n; i++) {
            if (user.array[i].getStatus() == false) {
                cout << user.array[i];
            }
        }
    }

    UserProfile &operator +=(Bill &u) {
        bool flag = false;
        for (int i = 0; i < n; i++) {
            if (strcmp(u.getBillNumber(), array[i].getBillNumber()) == 0) {
                flag = true;
                break;
            }
        }
        if (flag == true) {
            throw ExistingBill();
        } else {
            array[n] = u;
            this->n++;
        }
        return *this;
    }

    //46
    int totalDue(int month, int year) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            char Datum[10];
            strcpy(Datum, array[i].getDate());
            int extractedMonth = (Datum[0] - '0') * 10 + (Datum[1] - '0');
            int extractedYear = (Datum[3] - '0') * 1000 + (Datum[4] - '0') * 100 + (Datum[5] - '0') * 10 + (
                                    Datum[6] - '0');
            if (extractedMonth == month && extractedYear == year) {
                sum = sum + array[i].getExpenses();
            }
        }
        return sum;
    }
};

// int main () {
//     Bill bill = Bill ("Broj1",1000,"07.2015",true);
//
//     cout << bill << endl;
//
//     Bill bill1=Bill ("Broj",1000,"07.2015",true);
//     cout << bill1 << endl;
//     bool check = bill == bill1;
//     cout<<check<<endl;
// }

int main() {
    char number[50], month[8], name[50];
    int price, n;
    bool status;


    int type;
    cin >> type;

    if (type == 1) {
        cout << "-----Test Bill & operator &lt;&lt;-----" << endl;
        cin >> number >> price >> month >> status;
        Bill b(number, price, month, status);
        cout << b;
    } else if (type == 2) {
        cout << "-----Test Bill & operator == -----" << endl;
        cin >> number >> price >> month >> status;
        Bill b1(number, price, month, status);
        cin >> number >> price >> month >> status;
        Bill b2(number, price, month, status);
        if (b1 == b2) cout << "Equal" << endl;
        else cout << "Not equal" << endl;
    } else if (type == 3) {
        cout << "-----Test UserProfile & operator += &&lt;&lt; -----" << endl;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            up += s;
        }
        cout << up;
    } else if (type == 4) {
        cout << "-----Test UserProfile & operator += & totalDue -----" << endl;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            up += s;
        }
        int m, y;
        cin >> m >> y;
        cout << "Total due for month " << m << " and year " << y << " is:";
        cout << up.totalDue(m, y) << endl;
    } else if (type == 5) {
        cout << "-----Test all -----" << endl;
        cin >> name >> n;
        UserProfile up(name);
        for (int i = 0; i < n; i++) {
            cin >> number >> price >> month >> status;
            Bill s(number, price, month, status);
            try {
                up += s;
            } catch (ExistingBill &e) {
                e.print();
            }
        }
        cout << up;
        int m, y;
        cin >> m >> y;
        cout << "Total due for month " << m << " and year " << y << " is:";
        cout << up.totalDue(m, y) << endl;
    }

    return 0;
}
