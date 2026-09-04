/*
    1.2. Задача

    Да се дефинира класа DebitAccount за работа со дебитна банкарска сметка.

    За секоја банкарска сметка треба да се чува:

    - име и презиме на корисникот (низа од макс. 100 знаци),
    - број на сметка (long број) и
    - моментално салдо (double).

    Да се овозможат методи за преглед на сметката, депонирање и подигнување на пари од сметката.

    Потоа да се дефинира класа CreditAccount што ќе овозможува корисникот на сметката да зема заем од банката.

    Треба да се овозможи механизам за пресметување на камата доколку корисникот должи пари на банката.
*/
#include <iostream>
using namespace std;

class DebitAccount {
protected:
    string name;
    long number;
    double balance;

public:
    explicit DebitAccount(const string &name = "----", const long number = 0, const double balance = 0.0) {
        this->name = name;
        this->number = number;
        this->balance = balance;
    }

    ~DebitAccount() = default;

    [[nodiscard]] double getBalance() const {
        return this->balance;
    }

    void showInfo() const {
        const string str =
                name + '\n' +
                "\t Bank No: " + to_string(number) + '\n' +
                "\t Balance: " + to_string(balance) + '\n';
        cout << str;
    }

    void deposit(double amount) {
        if (amount >= 0) {
            balance += amount;
        } else {
            cout << "You can not add negative amount to your balance!" << endl;
        }
    }

    void withdraw(double amount) {
        if (amount < 0) {
            cout << "You can note withdraw negative amount from your account!" << endl;
            return;
        }

        if (amount <= balance) {
            balance -= amount;
        } else {
            cout << "You can not withdraw more money than you have on your account.\n"
                    << "Please upgrade your debut account to credit account!" << endl;
        }
    };
};

class CreditAccount : public DebitAccount {
private:
    double limit;
    double interest; // % percent
    double minus;

public:
    explicit CreditAccount(
        const string &name = "----",
        const long number = 0,
        const double balance = 0,
        const double limit = 1000,
        const double interest = 0.05,
        const double minus = 0
    ) : DebitAccount(name, number, balance) {
        this->limit = limit;
        this->interest = interest;
        this->minus = minus;
    }

    [[nodiscard]] double getInterest() const {
        return this->interest;;
    }

    void showInfo() const {
        DebitAccount::showInfo();
        cout << "\t Limit: " << this->limit << "\n"
                << "\t In minus: " << this->minus << "\n"
                << "\t Interest: " << this->interest << "%\n";
    }

    void withdraw(double amount) {
        double balance = getBalance();

        if (amount <= balance) {
            DebitAccount::withdraw(amount);
        } else if (amount <= balance + limit - minus) {
            double advance = amount - balance;
            this->minus += advance * (1.0 + interest);
            cout << "Minus: " << advance << "\n" << "Minus with interest: " << advance * interest << endl;
            deposit(advance);
            DebitAccount::withdraw(amount);
        } else {
            cout << "The bank is not giving you that much money..." << endl;
            this->showInfo();
        }
    }
};

int main() {
    DebitAccount d("Pero Perovski", 6, 100000);
    CreditAccount ca("Mitko Mitkovski", 10, 5000, 1000);
    d.showInfo();
    d.deposit(50000);
    d.withdraw(600000);
    d.showInfo();
    ca.showInfo();
    ca.deposit(500);
    ca.showInfo();
    ca.withdraw(6200);
    ca.showInfo();
    return 0;
}
