/*
    2.3. E-mail

    Да се напише класа која опишува една e-mail порака.

    Во класата треба да се имплементира метод за прикажување на целокупната порака на екран.

    Потоа да се напише главна програма во која се внесуваат параметрите на пораката, се инстанцира објект од оваа класа и се печати на екран неговата содржина.

    За проверување на валидноста на e-mail пораката (постоење на знакот @ во адресата) да се напише соодветна функција.
*/
#include <iostream>
#include <cstring>
using namespace std;

enum {
    AddrLen = 100,
    SubLen = 200,
    BodyLen = 1000
};

class Email {
private:
    char to[AddrLen]{};
    char from[AddrLen]{};
    char subject[SubLen]{};
    char body[BodyLen]{};

public:
    // CONSTRUCTORS

    // Email() = default;
    // DEFAULT CONSTRUCTOR
    Email() : to{}, from{}, subject{}, body{} {
    }

    // PARAMETERIZED CONSTRUCTOR
    Email(const char *to, const char *from, const char *subject, const char *body) {
        strncpy(this->to, to, AddrLen - 1);
        strncpy(this->from, from, AddrLen - 1);
        strncpy(this->subject, subject, SubLen - 1);
        strncpy(this->body, body, BodyLen - 1);
    }

    // COPY CONSTRUCTOR - lvalue
    Email(const Email &other) {
        strcpy(this->to, other.to);
        strcpy(this->from, other.from);
        strcpy(this->subject, other.subject);
        strcpy(this->body, other.body);
    }

    // MOVE CONSTRUCTOR - rvalue
    Email(const Email &&other) noexcept {
        strcpy(this->to, other.to);
        strcpy(this->from, other.from);
        strcpy(this->subject, other.subject);
        strcpy(this->body, other.body);
    }

    // DESTRUCTOR
    ~Email() = default;

    void print() const {
        cout << "To: " << to << endl;
        cout << "From: " << from << endl;
        cout << "Subject: " << subject << endl;
        cout << "Body: " << body << endl;
    }
};

bool isValidEmail(const char *address) {
    int count = 0;

    while (*address != 0) {
        if (*address++ == '@') count++;
    }

    return count == 1;
}

int main() {
    char to[AddrLen], from[AddrLen], subject[SubLen], body[BodyLen];

    cout << "To: " << endl;
    cin >> to;

    if (isValidEmail(to)) {
        cout << "From: " << endl;
        cin >> from;
        cin.ignore();

        cout << "Subject: " << endl;
        cin.getline(subject, SubLen);

        cout << "Body: " << endl;
        cin.getline(body, BodyLen);

        const Email email(to, from, subject, body);
        cout << "Sent:" << endl;

        email.print();
    } else {
        cout << "Invalid email address" << endl;
    }
}
