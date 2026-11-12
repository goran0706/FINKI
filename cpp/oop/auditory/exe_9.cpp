/*
    2.2. Вработен

    Да се напише класа во која ќе се чуваат основни податоци за вработен:

    - име
    - плата
    - работна позиција (работната позиција може да биде вработен, директор или шеф).

    Напишете главна програма во која се читаат од стандарден влез податоци за N вработени,
    а потоа се пачати листа на вработените сортирани според висината на платата во опаѓачки редослед.

*/
/*
    2.2. Вработен

    Да се напише класа во која ќе се чуваат основни податоци за вработен:

    - име
    - плата
    - работна позиција (работната позиција може да биде вработен, директор или шеф).

    Напишете главна програма во која се читаат од стандарден влез податоци за N вработени,
    а потоа се пачати листа на вработените сортирани според висината на платата во опаѓачки редослед.
*/
#include <cstring>
#include <iostream>
using namespace std;

enum Position {
    employee, manager, owner
};

class Person {
private:
    char name[50]{};
    int salary = 0;
    Position position = employee;

public:
    Person() : salary(0), position(employee) {
    }

    Person(const char *name, const int salary, const Position position) {
        strcpy(this->name, name);
        this->salary = salary;
        this->position = position;
    }

    ~Person() = default;

    void setName(const char *_name) { strcpy(this->name, _name); }
    void setSalary(const int _salary) { this->salary = _salary; }
    void setPosition(const Position _position) { this->position = _position; }

    [[nodiscard]] const char *getName() const { return name; }
    [[nodiscard]] int getSalary() const { return salary; }
    [[nodiscard]] Position getPosition() const { return position; }

    friend ostream &operator<<(ostream &os, const Person &p) {
        os << "Име: " << p.name << "\tПлата: " << p.salary << "\tПозиција: ";
        if (p.position == employee) os << "Вработен";
        else if (p.position == manager) os << "Шеф";
        else if (p.position == owner) os << "Директор";
        return os;
    }
};

void sort(Person employees[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (employees[j].getSalary() < employees[j + 1].getSalary()) {
                const Person tmp = employees[j];
                employees[j] = employees[j + 1];
                employees[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    int n = 0;
    cout << "Внесете го бројот на вработени N: ";
    cin >> n;

    Person employees[100];

    char input_name[50] = {};
    int input_salary = 0;
    int input_position = 0;

    for (int i = 0; i < n; i++) {
        cout << "\nВнесете податоци за вработен [" << i + 1 <<
                "] (Име Плата Позиција[0-Вработен, 1-Шеф, 2-Директор]): ";
        cin >> input_name >> input_salary >> input_position;

        employees[i].setName(input_name);
        employees[i].setSalary(input_salary);
        employees[i].setPosition(static_cast<Position>(input_position));
    }

    sort(employees, n);

    cout << "\n--- СОРТИРАНА ЛИСТА НА ВРАБОТЕНИ (ОПАЃАЧКИ СТАТУС НА ПЛАТА) ---" << endl;
    for (int i = 0; i < n; i++) {
        cout << i + 1 << ". " << employees[i] << endl;
    }

    return 0;
}
