#include "iostream"
using namespace std;

class User {
protected:
    string name, email, password;

public:
    User(string name = "", string email = "", string password = " ") {
        this->name = name;
        this->email = email;
        this->password = password;
    }

    virtual void print() = 0;

    virtual double calculatePasswordStrength() = 0;
};

class RegularUser : public User {
private:
    bool fa;

public:
    RegularUser(string name = "", string email = "", string password = " ", bool fa = false) : User(
        name, email, password) {
        this->fa = fa;
    }

    void print() override {
        cout << name << " " << email << " " << password << " ";
        if (fa) {
            cout << "Yes";
        } else {
            cout << "No";
        }
        cout << " " << calculatePasswordStrength() << endl;
    }

    double calculatePasswordStrength() override {
        int strength = 0;
        if (password.length() >= 8) {
            strength++;
        }
        if (isalpha(password[0])) {
            strength++;
        }
        if (fa) {
            strength++;
        }
        bool flag = false;
        for (int i = 1; i < password.length(); ++i) {
            if (isdigit(password[i])) {
                flag = true;
                break;
            }
        }
        if (flag)
            strength += 2;
        return strength;
    }
};

class AdminUser : public User {
private:
    string level;
    bool multiFactorAuth;

public:
    AdminUser(string name = "", string email = "", string password = " ", string level = "", bool mult = false) : User(
        name, email, password) {
        this->level = level;
        this->multiFactorAuth = mult;
    }

    void print() override {
        cout << name << " " << email << " " << password << " ";
        if (multiFactorAuth) {
            cout << "Yes";
        } else {
            cout << "No";
        }
        cout << " " << calculatePasswordStrength() << endl;
    }

    double calculatePasswordStrength() override {
        int strength = 0;
        if (password.length() > 10) {
            strength++;
        }
        if (isalpha(password[password.length() - 1])) {
            strength++;
        }
        if (multiFactorAuth) {
            strength++;
        }
        if (level == "superuser" || level == "admin") {
            strength += 2;
        }
        return strength;
    }
};

void printAverage(User **niza, int n) {
    int sum = 0;
    int counter = 0;
    cout << "Printing regular users: " << endl;
    for (int i = 0; i < n; ++i) {
        if (dynamic_cast<RegularUser *>(niza[i])) {
            sum += niza[i]->calculatePasswordStrength();
            counter++;
            niza[i]->print();
        }
    }
    cout << endl;
    cout << "Average strength of passwords for regular users: " << sum * 1.0 / counter * 1.0;
}

int main() {
    int tip;
    cin >> tip;

    if (tip == 1) {
        cout << "-----Test RegularUser print & strength-----" << endl;
        string name, email, password;
        bool fa;
        cin >> ws;
        getline(cin, name);
        getline(cin, email);
        getline(cin, password);
        cin >> fa;
        RegularUser ru(name, email, password, fa);
        ru.print();
    } else if (tip == 2) {
        cout << "-----Test AdminUser print & strength-----" << endl;
        string name, email, password, level;
        bool mfa;
        cin >> ws;
        getline(cin, name);
        getline(cin, email);
        getline(cin, password);
        getline(cin, level);
        cin >> mfa;
        AdminUser au(name, email, password, level, mfa);
        au.print();
    } else if (tip == 3) {
        cout << "-----Test Combined Users and Averages-----" << endl;
        int n;
        cin >> n;
        User **users = new User *[n];
        for (int i = 0; i < n; ++i) {
            int type;
            string name, email, password, level;
            bool fa_or_mfa;
            cin >> type;
            cin >> ws;
            getline(cin, name);
            getline(cin, email);
            getline(cin, password);
            if (type == 1) {
                // Regular
                cin >> fa_or_mfa;
                users[i] = new RegularUser(name, email, password, fa_or_mfa);
            } else {
                getline(cin, level);
                cin >> fa_or_mfa;
                users[i] = new AdminUser(name, email, password, level, fa_or_mfa);
            }
        }
        printAverage(users, n);
        for (int i = 0; i < n; ++i) delete users[i];
        delete[] users;
    }

    return 0;
}
