// Да се дефинира класа Employee во која ќе се чуваат информации за еден вработен:
//
//     ID на вработениот (низа од знаци)
//     име и презиме (низа од знаци)
//     плата (цел број)
//     статус (логичка променлива) — true = активен, false = неактивен
//
// За класата да се дефинираат:
//
//     default конструктор (каде што името и ID-то ќе останат празни, а платата и статусот ќе се сетираат на 0)
//     конструктор со аргументи
//     copy конструктор
//     доколку е потребно, get и set методи
//
//     функција void print() која печати во следниот формат:
//
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//
// Потоа, да се дефинира класа Company во која ќе се чуваат следните информации:
//
//     име на компанијата (низа од знаци)
//     број на вработени во компанијата (цел број)
//     низа од вработени (низа од објекти од класата Employee)
//
// За класата да се дефинираат:
//
//     конструктор со аргументи
//     copy конструктор
//     доколку е потребно, get и set методи
//     функција void print() која печати во следниот формат:
//
//     Company: [name]
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//     ...
//
// Прво името на компанијата, па секој вработен на нов ред.
//
// Во класата Company да се имплементира и функацијата getHighestPaidActiveEmployee() која го враќа активниот вработен со најголема плата. Доколку повеќе активни вработени ја имаат истата најголема плата, да се врати оној чие име е лексикографски помало (т.е. прв по азбучен ред). Се претпоставува дека секогаш ќе постои барем еден активен вработен во низата.
//
// НЕ ЈА МЕНУВАЈТЕ main() ФУНКЦИЈАТА.
//
// Define a class Employee that stores information about a single employee:
//
//     ID (character array)
//     full name (character array)
//     salary (integer)
//     status (boolean) — true = active, false = inactive
//
// For the class, define:
//
//     a default constructor (where the name and the ID will rename empty, and the salary and status will be set to 0)
//     a constructor with arguments
//     a copy constructor
//     get and set methods if necessary
//
//     a function void print() that prints in the following format:
//
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//
// Then, define a class Company that stores:
//
//     company name (character array)
//     number of employees (integer)
//     array of employees (array of Employee objects)
//
// For the class, define:
//
//     a constructor with arguments
//     a copy constructor
//     get and set methods if necessary
//
//     a function void print() that prints in the following format:
//
//     Company: [name]
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//     ID: [id] Name: [name] Salary: [salary] Status: [active/inactive]
//     ...
//
//     First the company name, then each employee on a new line.
//
// In the Company class, also implement getHighestPaidActiveEmployee() which returns the active employee with the highest salary. If multiple active employees share the highest salary, return the one whose name is lexicographically smallest (i.e., first alphabetically). It is assumed there will always be at least one active employee.
//
// DO NOT MODIFY THE main() FUNCTION.
//
// For example:
// Input 	Result
//
// 1
//
//
//
// Testing Employee default constructor
// ID:  Name:  Salary: 0 Status: inactive

#include <iostream>
#include <cstring>
using namespace std;

//Your code here
//DO NOT CHANGE THE MAIN FUNCTION

int main() {
    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        // Test 1: Employee default constructor + print
        cout << "Testing Employee default constructor" << endl;
        Employee e;
        e.print();
    } else if (testCase == 2) {
        // Test 2: Employee constructor with arguments + print
        cout << "Testing Employee constructor with arguments" << endl;
        char id[20], name[100];
        int salary;
        bool status;
        cin >> id;
        cin.ignore();
        cin.getline(name, 100);
        cin >> salary >> status;
        Employee e(id, name, salary, status);
        e.print();
    } else if (testCase == 3) {
        // Test 3: Employee copy constructor
        cout << "Testing Employee copy constructor" << endl;
        Employee e1("E001", "Alice Smith", 50000, true);
        Employee e2(e1);
        cout << "Original: ";
        e1.print();
        cout << "Copy: ";
        e2.print();
    } else if (testCase == 4) {
        // Test 4: Company constructor + print
        cout << "Testing Company constructor + print" << endl;
        Employee employees[3] = {
            Employee("E001", "Alice Smith", 50000, true),
            Employee("E002", "Bob Jones", 60000, false),
            Employee("E003", "Charlie Brown", 55000, true)
        };
        Company c("TechCorp", 3, employees);
        c.print();
    } else if (testCase == 5) {
        // Test 5: Company copy constructor
        cout << "Testing Company copy constructor" << endl;
        Employee employees[2] = {
            Employee("E010", "Diana Prince", 70000, true),
            Employee("E011", "Clark Kent", 65000, true)
        };
        Company c1("HeroCorp", 2, employees);
        Company c2(c1);
        cout << "Original:" << endl;
        c1.print();
        cout << "Copy:" << endl;
        c2.print();
    } else if (testCase == 6) {
        // Test 6: getHighestPaidActiveEmployee - single highest
        cout << "Testing highest paid active employee" << endl;
        Employee employees[4] = {
            Employee("E001", "Alice Smith", 50000, true),
            Employee("E002", "Bob Jones", 90000, false),
            Employee("E003", "Charlie Brown", 75000, true),
            Employee("E004", "Diana Prince", 60000, true)
        };
        Company c("MegaCorp", 4, employees);
        Employee best = c.getHighestPaidActiveEmployee();
        best.print();
    } else if (testCase == 7) {
        // Test 7: getHighestPaidActiveEmployee - tiebreak by name
        cout << "Testing highest paid active employee" << endl;
        Employee employees[4] = {
            Employee("E001", "Zara Williams", 80000, true),
            Employee("E002", "Anna Taylor", 80000, true),
            Employee("E003", "Mike Davis", 80000, true),
            Employee("E003", "Abbe Hunt", 80000, false)
        };
        Company c("EqualPay Inc", 4, employees);
        Employee best = c.getHighestPaidActiveEmployee();
        best.print();
    } else if (testCase == 8) {
        cout << "Testing highest paid active employee" << endl;
        Employee employees[3] = {
            Employee("E001", "Alice Smith", 100000, false),
            Employee("E002", "Bob Jones", 100000, false),
            Employee("E003", "Charlie Brown", 30000, true)
        };
        Company c("SmallCorp", 3, employees);
        Employee best = c.getHighestPaidActiveEmployee();
        best.print();
    } else if (testCase == 9) {
        // Test 9: Full scenario with user input
        cout << "Testing full scenario" << endl;
        char companyName[50];
        int n;
        cin.ignore();
        cin.getline(companyName, 50);
        cin >> n;
        Employee employees[100];
        for (int i = 0; i < n; i++) {
            char id[20], name[100];
            int salary;
            bool status;
            cin >> id;
            cin.ignore();
            cin.getline(name, 100);
            cin >> salary >> status;
            employees[i] = Employee(id, name, salary, status);
        }
        Company c(companyName, n, employees);
        c.print();
        cout << "Highest paid active: ";
        c.getHighestPaidActiveEmployee().print();
    }

    return 0;
}

