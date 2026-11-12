// Да се дефинира класа Employee во која се чува информација за:
//
//     основна плата baseSalary (double)
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор со аргумент
//     copy конструктор
//     метод double salary() што ја враќа платата
//     метод void print() што печати:
//     Employee: <salary>
//
// Да се имплементира класа Manager која наследува од класата Employee. Во неа се чуваат дополнителни информации за:
//
//     бонус по тим bonus (double)
//     број на тимови teams (int)
//
// Платата на менаџерот се пресметува како:
//
// baseSalary + bonus * teams
//
// За класата да се дефинираат:
//
//     default конструктор
//     конструктор
//     Manager(const Employee &e, double bonus, int teams)
//     copy конструктор
//
// Да се препокријат методите:
//
//     salary()
//     print() во формат Manager: <salary>
//
// Напомени:
//
//     Ако teams == 0, тогаш објектот од класата Manager се однесува како Employee, односно print() треба да печати исто како кај Employee
//     При препокривање на методите во класата Manager мора да има повик кон методите од базната класа
//
// ----------------------------------------
//
// Define a class Employee that stores:
//
//     base salary baseSalary (double)
//
// For the class implement:
//
//     default constructor
//     constructor with arguments
//     copy constructor
//     method double salary() that returns the salary
//     method void print() that prints:
//     Employee: <salary>
//
// Implement a class Manager that inherits from the class Employee. It additionally stores:
//
//     bonus per team bonus (double)
//     number of teams teams (int)
//
// The manager’s salary is calculated as:
//
// baseSalary + bonus * teams
//
// For this class implement:
//
//     default constructor
//     constructor
//     Manager(const Employee &e, double bonus, int teams)
//     copy constructor
//
// Override the methods:
//
//     salary()
//     print() in the format: Manager: <salary>
//
// Notes:
//
//     If teams == 0, then the object behaves like an Employee, meaning print() should produce the same output as in the Employee class
//     When overriding the methods in the Manager class, you must call the corresponding methods from the base class
//
// For example:
// Input 	Result
//
// 3
// 1000
// 1500
// 2000
// 0 0
// 0 0
// 0 0
// 1
//
//
//
// === Employees ===
// Employee: 1000
// Employee: 1500
// Employee: 2000
//
// 3
// 1000
// 1500
// 2000
// 100 2
// 200 1
// 50 4
// 2
//
//
//
// === Managers ===
// Manager: 1200
// Manager: 1700
// Manager: 2200

#include <iostream>
using namespace std;

//YOUR CODE HERE


int main() {
    int n;
    cin >> n;

    Employee *employees;
    Manager *managers;

    employees = new Employee[n];
    managers = new Manager[n];

    double s, b;
    int t;

    for (int i = 0; i < n; i++) {
        cin >> s;
        employees[i] = Employee(s);
    }

    for (int i = 0; i < n; i++) {
        cin >> b >> t;
        managers[i] = Manager(employees[i], b, t);
    }

    int test;
    cin >> test;

    if (test == 1) {
        cout << "=== Employees ===" << endl;
        for (int i = 0; i < n; i++)
            employees[i].print();
    } else {
        cout << "=== Managers ===" << endl;
        for (int i = 0; i < n; i++)
            managers[i].print();
    }

    return 0;
}
