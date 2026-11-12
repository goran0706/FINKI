// Креирај класа BankAccount што симулира едноставна банкарска сметка.
//
// Приватни променливи:
// string owner
// int accountNumber
// float balance
//
// Методи:
// конструктор со параметри за сите полиња
// deposit(float amount) – го зголемува balance, не дозволува негативен депозит
// withdraw(float amount) – го намалува balance ако има доволно средства, во спротивно испечати "Not enough balance" и нема промена
// transfer(BankAccount &other, float amount) – префрли средства од тековната сметка кон друга сметка (ако има доволно)
// print() – печати: Owner: <owner>, Acc: <accNum>, Balance: <balance> (со 2 децимали0)

#include "iostream"
using namespace std;

class BankAccount {
private:
    string owner;
    int accountNumber;
    float balance;

public:
    BankAccount(const string &owner, int accountNumber, float balance) {
        this->owner = owner;
        this->accountNumber = accountNumber;
        this->balance = balance;
    }

    void withdraw(float amount) {
        if (amount > balance) {
            cout << "Not enough balance";
        } else {
            balance -= amount;
        }
    }

    void transfer(BankAccount &other, float amount) {
        if (amount > balance) {
            cout << "Not enough balance" << endl;
        } else {
            balance -= amount;
            other.balance += amount;
        }
    }

    void deposit(float amount) {
        if (amount < 0) return;
        balance += amount;
    }

    void print() {
        cout << "Owner: " << owner << " Acc: " << accountNumber << " Balance: " << balance << endl;
    }
};

int main() {
    int n, cmd;
    string name1, name2;
    int acc1, acc2;
    float amt;
    BankAccount a("UserA", 1001, 100.0), b("UserB", 1002, 200.0);

    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> amt;
                a.deposit(amt);
                a.print();
                break;
            case 2:
                cin >> amt;
                a.withdraw(amt);
                a.print();
                break;
            case 3:
                cin >> amt;
                a.transfer(b, amt);
                a.print();
                b.print();
                break;
        }
    }
}
