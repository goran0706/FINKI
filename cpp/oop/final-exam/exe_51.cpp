#include <iostream>
using namespace std;

class Student {
private:
    string id;
    int points;

public:
    Student(const string &id = "NO_ID", const int points = 0) {
        this->id = id;
        this->points = points;
    }

    Student(const Student &student) {
        this->id = student.id;
        this->points = student.points;
    }

    Student &operator=(const Student &student) {
        if (this != &student) {
            this->id = student.id;
            this->points = student.points;
        }
        return *this;
    }

    ~Student() {
    }

    void addPoints(int points) {
        if (this->points + points <= 100) {
            this->points = this->points + points;
        } else {
            this->points = 100;
        }
    }

    void print() {
        if (points < 50) {
            cout << id << " - " << points << " FAILED" << endl;
        }
        if (points >= 50 && points < 90) {
            cout << id << " - " << points << " PASSED" << endl;
        }
        if (points >= 90 && points <= 100) {
            cout << id << " - " << points << " BEST" << endl;
        }
    }
};

int main() {
    string command;
    Student s;
    string id;
    int points;

    while (cin >> command) {
        if (command == "constructor1") {
            cin >> id >> points;
            s = Student(id, points);
        } else if (command == "constructor2") {
            cin >> id;
            s = Student(id);
        } else if (command == "addPoints") {
            cin >> points;
            s.addPoints(points);
        } else if (command == "print") {
            s.print();
        }
    }
    return 0;
}
