/*
    1.2. Вработен

    Да се напише класа Date во која ќе се чуваат:

    - ден,
    - месец и
    - година (цели броеви).

    Да се напише класа Employee во која се чува:

    - име на вработениот (не повеќе од 20 знаци),
    - плата и
    - датум на раѓање (објект од класата Date).

    Да се напише класа Company во која се чуваат податоци за:

    - името на компанијата,
    - датумот на основање (објект од класата Date),
    - низа од вработени и
    - број на вработени во компанијата.

    Потребно е да се овозможи креирање на компанија на два начина, со предавање на низа од вработени или без вработени.

    Во класта Company да се имплементираат два метода, едниот го враќа вработениот со најголема плата, а другиот го враќа најмладиот вработен во компанијата.

    Да се овозможи додавање вработени во компанијата преку посебен метод addEmployee() во класата.

    Во главната програма потребно е да се испечатат на екран податоците за:

    - компанијата, вклучувајќи име,
    - датум на основање,
    - број на вработени и
    - податоците за најмладиот и најплатениот вработен.
    
    Печатењето на податоците за компанијата да се имплементира во посебен метод во рамки на класата Company.
    Печатењето на вработениот да биде реализирано со посебна функција print() во рамките на класата Employee.

    Дополнително, да се креира уште еден вработен кој ќе биде додаден во компанијата.
    По додавање на новиот вработен повторно да се испечатат деталите за компанијата.
*/
#include <iostream>
#include <cstring>
using namespace std;

enum {
    NameLen = 20,
    MaxEmployees = 100
};

class Date {
private:
    int day;
    int month;
    int year;

public:
    Date() : day(1), month(1), year(2000) {
    }

    Date(const int day, const int month, const int year)
        : day(day), month(month), year(year) {
    }

    ~Date() = default;

    void set_day(const int _day) { this->day = _day; }
    void set_month(const int _month) { this->month = _month; }
    void set_year(const int _year) { this->year = _year; }

    [[nodiscard]] int get_day() const { return day; }
    [[nodiscard]] int get_month() const { return month; }
    [[nodiscard]] int get_year() const { return year; }

    friend bool operator<(const Date &lhs, const Date &rhs) {
        if (lhs.year != rhs.year) return lhs.year < rhs.year;
        if (lhs.month != rhs.month) return lhs.month < rhs.month;
        return lhs.day < rhs.day;
    }
};

class Employee {
private:
    char name[NameLen]{};
    int salary;
    Date dateOfBirth;

public:
    Employee() : salary(0), dateOfBirth(Date()) {
    }

    Employee(const char *name, const int salary, const Date &dateOfBirth) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        this->salary = salary;
        this->dateOfBirth = dateOfBirth;
    }

    ~Employee() = default;

    void set_name(const char *_name) {
        strncpy(this->name, _name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
    }

    void set_salary(const int _salary) { this->salary = _salary; }
    void set_date_of_birth(const Date &_dateOfBirth) { dateOfBirth = _dateOfBirth; }

    [[nodiscard]] const char *get_name() const { return name; }
    [[nodiscard]] int get_salary() const { return salary; }
    [[nodiscard]] const Date &get_date_of_birth() const { return dateOfBirth; }

    void print() const {
        cout << name << ",\t" << salary << ",\t";
        cout << dateOfBirth.get_day() << ":" << dateOfBirth.get_month() << ":" << dateOfBirth.get_year() << endl;
    }
};

class Company {
private:
    char name[NameLen]{};
    Date foundingDate;
    int employeesCount;
    Employee employees[MaxEmployees];

public:
    Company() : employeesCount(0) {
    }

    Company(const char *name, const Date &foundingDate, const int employeesCount, const Employee employees[]) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        this->foundingDate = foundingDate;
        this->employeesCount = 0;

        for (int i = 0; i < employeesCount; i++) {
            this->addEmployee(employees[i]);
        }
    }

    Company(const char *name, const Date &foundingDate) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        this->foundingDate = foundingDate;
        this->employeesCount = 0;
    }

    ~Company() = default;

    void addEmployee(const Employee &employee) {
        if (employeesCount < MaxEmployees) {
            employees[employeesCount++] = employee;
        }
    }

    [[nodiscard]] const char *get_name() const { return name; }
    [[nodiscard]] const Date &get_founding_date() const { return foundingDate; }
    [[nodiscard]] int get_employees_count() const { return employeesCount; }

    // ЗЛАТНО ПРАВИЛО: Враќаме референца за да избегнеме копирање објекти
    [[nodiscard]] const Employee &highestPaid() const {
        int maxIndex = 0;
        for (int i = 1; i < employeesCount; i++) {
            if (employees[i].get_salary() > employees[maxIndex].get_salary()) {
                maxIndex = i;
            }
        }
        return employees[maxIndex];
    }

    [[nodiscard]] const Employee &youngestEmployee() const {
        int youngestIndex = 0;
        for (int i = 1; i < employeesCount; i++) {
            if (employees[youngestIndex].get_date_of_birth() < employees[i].get_date_of_birth()) {
                youngestIndex = i;
            }
        }
        return employees[youngestIndex];
    }

    void print() const {
        cout << "Company: " << name << "\tfounded ";
        cout << foundingDate.get_day() << ":" << foundingDate.get_month() << ":" << foundingDate.get_year() << "\t";
        cout << "employees count " << employeesCount << "." << endl;

        if (employeesCount > 0) {
            cout << "Youngest employee: ";
            youngestEmployee().print();

            cout << "Highest paid employee: ";
            highestPaid().print();
        }
    }
};

int main() {
    char companyName[20];
    int companyDay = 0, companyMonth = 0, companyYear = 0, employeesCount = 0;

    if (!(cin >> companyName >> companyDay >> companyMonth >> companyYear >> employeesCount)) return 0;

    Date companyDate(companyDay, companyMonth, companyYear);
    Employee employees[MaxEmployees];

    for (int i = 0; i < employeesCount; i++) {
        char empName[20];
        int salary;
        int day = 0, month = 0, year = 0;
        cin >> empName >> salary >> day >> month >> year;
        Date dateOfBirth(day, month, year);
        employees[i] = Employee(empName, salary, dateOfBirth);
    }

    Company company(companyName, companyDate, employeesCount, employees);
    company.print();

    cout << "Adding new employee..." << endl;
    company.addEmployee(Employee("Johnny", 58000, Date(10, 10, 2010)));
    company.print();

    return 0;
}
