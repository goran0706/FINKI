// Класа Person чува име и возраст.
// Возраст смее да биде само позитивна.
//
// Променливи:
// string name
// int age
//
// Методи:
// конструктор со default вредности "NoName" и 0
// set(string n, int a) – ако a < 0, постави age = 0 и испечати "Invalid age"
// birthday() – ја зголемува возраста за 1
// print() – го печати името и возраста во формат: Name: X, Age: Y

#include "iostream"
using namespace std;

class Person {
    string name;
    int age;

public:
    Person(const string &name = "NoName", int age = 0) {
        this->name = name;
        this->age = age;
    }

    void set(string n, int a) {
        name = n;
        if (a < 0) {
            age = 0;
            cout << "Invalid age" << endl;
        } else {
            age = a;
        }
    }

    void birthday() {
        age++;
    }

    void print() {
        cout << "Name: " << name << " Age: " << age;
    }
};

int main() {
    Person p;
    int n, cmd, a;
    string s;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> s >> a;
                p.set(s, a);
                p.print();
                break;
            case 2:
                p.birthday();
                p.print();
                break;
        }
    }
}
