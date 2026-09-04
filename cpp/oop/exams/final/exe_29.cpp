#include "iostream"
#include "fstream"
using namespace std;

class UserWithIndexNotFound {
private:
    int id;

public:
    UserWithIndexNotFound(int id) {
        this->id = id;
    }

    void message() {
        cout << "The user iwth this id: " << id << " doesent exist!" << endl;
    }
};

class User {
protected:
    int id;
    string email;
    string name;
    string surname;
    int connections;

public:
    User(int id = 0, string email = "", string name = "", string surname = "", int connections = 0) {
        this->id = id;
        this->email = email;
        this->name = name;
        this->surname = surname;
        this->connections = connections;
    }

    User(const User &u) {
        this->id = u.id;
        this->email = u.email;
        this->name = u.name;
        this->surname = u.surname;
        this->connections = u.connections;
    }

    User operator --() {
        if (connections > 0) {
            connections--;
        }
        return *this;
    }

    bool operator >=(const User &u) const {
        return connections >= u.connections;
    }

    friend ostream &operator <<(ostream &out, User &u) {
        out << u.id << " " << u.email << " " << u.name << " " << u.surname << " " << u.connections << endl;
        return out;
    }

    int getId() {
        return id;
    }

    int getConnections() {
        return connections;
    }
};

class UserData {
private:
    User *niza;
    int n;

public:
    UserData(User *niza = nullptr, int n = 0) {
        this->n = n;
        this->niza = new User[n];
        for (int i = 0; i < n; ++i) {
            this->niza[i] = niza[i];
        }
    }

    UserData(const UserData &u) {
        this->n = u.n;
        this->niza = new User[u.n];
        for (int i = 0; i < u.n; ++i) {
            this->niza[i] = u.niza[i];
        }
    }

    UserData &operator =(const UserData &u) {
        if (this != &u) {
            delete[]niza;
            this->n = u.n;
            this->niza = new User[u.n];
            for (int i = 0; i < u.n; ++i) {
                this->niza[i] = u.niza[i];
            }
        }
        return *this;
    }

    ~UserData() {
        delete[]niza;
    }

    User &operator[](int id) {
        for (int i = 0; i < n; ++i) {
            if (niza[i].getId() == id) {
                return niza[i];
            }
        }
        throw UserWithIndexNotFound(id);
    }

    UserData &operator +=(const User &u) {
        User *tmp = new User[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = niza[i];
        }
        tmp[n++] = u;
        delete[]niza;
        niza = tmp;
        return *this;
    }

    UserData filterByConnections(int connections) {
        UserData tmp;
        for (int i = 0; i < n; ++i) {
            if (connections == niza[i].getConnections()) {
                tmp += niza[i];
            }
        }
        return tmp;
    }

    friend ostream &operator<<(ostream &out, UserData &u) {
        if (u.n == 0) {
            out << "UserData is empty!";
        } else {
            for (int i = 0; i < u.n; ++i) {
                out << u.niza[i] << endl;
            }
        }
        return out;
    }
};

User ReadUser(ifstream &in) {
    int id;
    in.ignore();
    string email;
    string name;
    string surname;
    int connections;
    in >> id;
    getline(in, email);
    getline(in, name);
    getline(in, surname);
    in >> connections;
    in.ignore();
    User user(id, email, name, surname, connections);
    return user;
}

void wtf() {
    ofstream fout("input.txt");
    string line;
    line = "1";
    fout << line << endl;
    line = "Frist email ";
    fout << line << endl;
    line = "First name";
    fout << line << endl;
    line = "First surname";
    fout << line << endl;
    line = "20";
    fout << line << endl;
    //----------------
    line = "2";
    fout << line << endl;
    line = "Second email ";
    fout << line << endl;
    line = "Second name";
    fout << line << endl;
    line = "Second surname";
    fout << line << endl;
    line = "30";
    fout << line << endl;
    //--------------------------
    line = "3";
    fout << line << endl;
    line = "Third email ";
    fout << line << endl;
    line = "Third name";
    fout << line << endl;
    line = "Third surname";
    fout << line << endl;
    line = "40";
    fout << line << endl;
}

void rff(const string &path) {
    ifstream fin(path);
    string line;
    while (getline(fin, line)) {
        cout << line << endl;
    }
}

int main() {
    wtf();

    ifstream fin("input.txt");
    User users[3];
    for (int i = 0; i < 3; ++i) {
        users[i] = ReadUser(fin);
    }

    UserData data(users, 3);

    cout << "All users:\n" << data;

    try {
        cout << "User with id 2:\n" << data[2];
        cout << "User with id 5:\n" << data[5];
    } catch (UserWithIndexNotFound &e) {
        e.message();
    }

    cout << "Users with 30 connections:\n";
    UserData filtered = data.filterByConnections(30);
    cout << filtered;

    return 0;
}
