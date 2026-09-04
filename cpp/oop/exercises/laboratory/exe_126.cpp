// Да се дефинира класа WebSystem која ќе ги содржи следните полиња:
// name, име на системот
// url, адреса на системот
// За класата треба да се дефинира параметризиран конструктор и print() метод кој печати во формат:
// "Web System [name] - http://[url]/dashboard".
//
// Да се дефинира класа User, која ќе претставува корисник на системот.
// Таа треба да ги содржи следните полиња:
//
// email, корисничко име на корисникот.
// password, лозинка на корисникот.
// accessLevels, низа од 3 броеви кои означуваат нивоа на пристап за различни модули на апликацијата.
//
// За класата треба да се дефинира параметризиран конструктор, гетер за корисничкото име,
// гетер за нивоата на пристап и помошна функција bool containsChar(string str, char c)
// која враќа дали дадениот string го содржи дадениот карактер.
//
// Во параметризираниот конструктор пред да се доделат вредностите треба да се провери валидноста на корисничкото име,
// лозинката и нивоата на пристап, и доколку се наиде на невалиден податок да се фрли соодветен исклучок
// (треба да ги креирате класите WeakPasswordException, InvalidEmailException и InvalidAccessLevelException соодветно).
//
// За корисничката адреса велиме дека е невалидна доколку не содржи @ и . - (да се искористи функцијата containsChar)
// За лозинката велиме дека е невалидна доколку е пократка од 8 карактери
// За нивоата на пристап велиме дека се невалидни доколку некој од нив е помал од 0 или поголем од 7.
// Напомена: прво се проверува корисничката адреса, па лозинката па нивоата на пристап.
// Исклучоците треба да се фатат на означеното место во main функцијата

#include <iostream>
#include <string>

using namespace std;

class WeakPasswordException {
public:
    void message() {
        cout << "Password too weak." << endl;
    }
};

class InvalidEmailException {
public:
    void message() {
        cout << "Invalid email address." << endl;
    }
};

class InvalidAccessLevelException {
public:
    void message() {
        cout << "Invalid access level." << endl;
    }
};

class WebSystem {
protected:
    string name;
    string url;

public:
    WebSystem(string name = "", string url = "") {
        this->name = name;
        this->url = url;
    }

    void print() {
        cout << "Web System " << name << " - http://" << url << "/dashboard" << endl;
    }
};

class User : public WebSystem {
private:
    string email;
    string password;
    int lvl[3];

public:
    User(string email, string password, int lvl[3]) {
        if (!containsChar(email, '@') || !containsChar(email, '.')) {
            throw InvalidEmailException();
        }
        if (password.length() < 8) {
            throw WeakPasswordException();
        }
        for (int i = 0; i < 3; i++) {
            if (lvl[i] < 0 || lvl[i] > 7) {
                throw InvalidAccessLevelException();
            }
        }
        this->email = email;
        this->password = password;
        for (int i = 0; i < 3; i++) {
            this->lvl[i] = lvl[i];
        }
    }

    const string getUsername() const {
        return email;
    }

    int *getAccessLevels() {
        return lvl;
    }

    bool containsChar(string str, char c) {
        if (str.find(c)) {
            return true;
        }
        return false;
    }
};


// DO NOT CHANGE THIS FUNCTION
string getPermissions(int num) {
    switch (num) {
        case 7: return "rwx";
        case 6: return "rw-";
        case 5: return "r-x";
        case 4: return "r--";
        case 3: return "-wx";
        case 2: return "-w-";
        case 1: return "--x";
        default: return "---";
    }
}

int main() {
    int n;
    cin >> n;
    const string accessDomains[3] = {"Database", "Network", "Administration"};

    for (int i = 0; i < n; i++) {
        string systemName, systemUrl;
        cin >> systemName >> systemUrl;

        WebSystem system(systemName, systemUrl);
        system.print();

        string username, password;
        int accessLevels[3];

        cin >> username >> password;
        for (int j = 0; j < 3; j++) {
            cin >> accessLevels[j];
        }

        //TODO: Catch any potential exceptions here.
        try {
            User user(username, password, accessLevels);
            cout << "User " << user.getUsername() << " access levels:" << endl;
            for (int j = 0; j < 3; j++) {
                cout << accessDomains[j] << ": " << getPermissions(user.getAccessLevels()[j]) << endl;
            }
        } catch (InvalidEmailException &e) {
            e.message();
        } catch (WeakPasswordException &e) {
            e.message();
        } catch (InvalidAccessLevelException &e) {
            e.message();
        }
    }

    return 0;
}
