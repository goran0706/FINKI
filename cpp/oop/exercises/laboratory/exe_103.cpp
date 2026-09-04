// Потребно е да имплементирате класа Employee. Таа треба да ги содржи следниве информации:
//
// име - динамички алоцирана низа од знаци
// плата - цел број
// бонус - цел број
// работно искуство - цел број
// За оваа класа потребно е да креирате:
//
// Default constructor
// Constructor со параметри
// Copy constructor
// Оператор =
// Destructor
// Getters и setters
// Функција getTotalSalary() што ја враќа вкупната плата на вработениот. (се пресметува како плата+(бонус*искуство))
// Функција print() што ги печати информациите за вработениот:
// Employee name: [име]
// Salary: [вкупна плата]
// Experience: [искуство]
// Треба да ја имплементирате и класата Manager која треба да наследува од класата Employee и дополнително да ги има следниве информации:
//
// оддел - динамички алоцирана низа од знаци
// менаџерски бонус - цел број
// За оваа класа потребно е да креирате:
//
// Default constructor
// Constructor со параметри
// Copy constructor
// Оператор =
// Destructor
// Функција getTotalManagerBonus() што го враќа вкупниот бонус на менаџерот (се пресметува како бонус + менаџерски бонус)
// Функција getTotalSalary() што ја враќа вкупната плата на менаџерот. (се пресметува како плата+(вкупен менаџерски бонус*искуство))
// Функција print() што ги печати информациите за вработениот:
// Manager name: [име]
// Department: [оддел]
// Salary: [вкупна менаџерска плата]
// Experience: [искуство]

#include "iostream"
#include "cstring"
using namespace std;

class Employee {
protected:
    char *name;
    int salary;
    int bonus;
    int experiance;

public:
    Employee() {
        this->name = new char[1];
        name[0] = '\0';
        salary = 0;
        bonus = 0;
        experiance = 0;
    }

    Employee(char *name, int salary, int bonus, int experiance) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        this->salary = salary;
        this->bonus = bonus;
        this->experiance = experiance;
    }

    Employee(const Employee &e) {
        this->name = new char[strlen(e.name) + 1];
        strcpy(this->name, e.name);
        this->salary = e.salary;
        this->bonus = e.bonus;
        this->experiance = e.experiance;
    }

    Employee &operator =(const Employee &e) {
        if (this != &e) {
            delete[]name;
            this->name = new char[strlen(e.name) + 1];
            strcpy(this->name, e.name);
            this->salary = e.salary;
            this->bonus = e.bonus;
            this->experiance = e.experiance;
        }
        return *this;
    }

    ~Employee() {
        delete[]name;
    }

    double getTotalSalary() {
        return salary + (bonus * experiance);
    }

    void print() {
        cout << "Employee name: " << name << endl;
        cout << "Salary: " << getTotalSalary() << endl;
        cout << "Ecperiance: " << experiance << endl;
    }
};

class Manager : public Employee {
private:
    char *department;
    int managerBonus;

public:
    Manager() : Employee() {
        this->department = new char[1];
        department[0] = '\0';
        managerBonus = 0;
    }

    Manager(char *name, int salary, int bonus, int experiance, char *department, int managerBonus) : Employee(
        name, salary, bonus, experiance) {
        this->department = new char[strlen(department) + 1];
        strcpy(this->department, department);
        this->managerBonus = managerBonus;
    }

    Manager(const Employee &e, char *department, int managerBonus) : Employee(e) {
        this->department = new char[strlen(department) + 1];
        strcpy(this->department, department);
        this->managerBonus = managerBonus;
    }

    Manager(const Manager &m) : Employee(m) {
        this->department = new char[strlen(m.department) + 1];
        strcpy(this->department, m.department);
        this->managerBonus = m.managerBonus;
    }

    Manager &operator=(const Manager &m) {
        if (this != &m) {
            delete[]department;
            delete[]name;
            this->department = new char[strlen(m.department) + 1];
            strcpy(this->department, m.department);
            this->managerBonus = m.managerBonus;

            this->name = new char[strlen(m.name) + 1];
            strcpy(this->name, m.name);
            this->salary = m.salary;
            this->bonus = m.bonus;
            this->experiance = m.experiance;
        }
        return *this;
    }

    double getTotalManagerBonus() {
        return bonus + managerBonus;
    }

    double getTotalSalary() {
        return salary + (getTotalManagerBonus() * experiance);
    }

    void print() {
        cout << "Manager name: " << name << endl;
        cout << "Department: " << department << endl;
        cout << "Salary: " << getTotalSalary() << endl;
        cout << "Experiance: " << experiance << endl;
    }
};

int main() {
    char name[20];
    int salary;
    int bonus;
    int experience;
    char department[50];
    int managerBonus;

    Employee *employees = new Employee[5];
    Manager *managers = new Manager[5];
    int n;
    cin >> n;

    if (n == 1) {
        cout << "EMPLOYEES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            cin >> name >> salary >> bonus >> experience;
            employees[i] = Employee(name, salary, bonus, experience);
            employees[i].print();
            cout << endl;
        }
    } else if (n == 2) {
        for (int i = 0; i < 5; ++i) {
            cin >> name >> salary >> bonus >> experience;
            cin >> department >> managerBonus;
            employees[i] = Employee(name, salary, bonus, experience);
            managers[i] = Manager(employees[i], department, managerBonus);
        }

        cout << "EMPLOYEES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            employees[i].print();
            cout << endl;
        }


        cout << "MANAGERS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            managers[i].print();
            cout << endl;
        }
    } else if (n == 3) {
        for (int i = 0; i < 5; ++i) {
            cin >> name >> salary >> bonus >> experience;
            cin >> department >> managerBonus;
            managers[i] = Manager(name, salary, bonus, experience, department, managerBonus);
        }
        cout << "MANAGERS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            managers[i].print();
            cout << endl;
        }
    }

    delete [] employees;
    delete [] managers;
}
